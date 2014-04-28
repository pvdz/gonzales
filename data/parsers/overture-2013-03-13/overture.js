// Overture is a fast JavaScript parser written in JavaScript.
//
// Overture was written by Alistair Braidwood and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Overture are available at
//
//         https://github.com/abraidwood/overture.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/abraidwood/overture/issues
//
// Overture owes a lot of its code structure and initial work to
// Acorn:
//
// Acorn was written by Marijn Haverbeke and released under an MIT
// license. The Unicode regexps (for identifiers and whitespace) were
// taken from [Esprima](http://esprima.org) by Ariya Hidayat.
//
// Git repositories for Acorn are available at
//
//         http://marijnhaverbeke.nl/git/acorn
//         https://github.com/marijnh/acorn.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/marijnh/acorn/issues

(function(exports) {
    "use strict";

    exports.version = "0.1";

    // The main exported interface (under `self.overture` when in the
    // browser) is a `parse` function that takes a code string and
    // returns an abstract syntax tree as specified by [Mozilla parser
    // API][api], with the caveat that the SpiderMonkey-specific syntax
    // (`let`, `yield`, inline XML, etc) is not recognized.
    //
    // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

    var options, input, inputLen, sourceFile;

    exports.parse = function(inpt, opts) {
        input = String(inpt); inputLen = input.length;
        options = opts || {};
        for (var opt in defaultOptions) if (!options.hasOwnProperty(opt))
            options[opt] = defaultOptions[opt];
        sourceFile = options.sourceFile || null;

        if(options.forbidReserved) readWord = readWord_checkReserved;

        return parseTopLevel(options.program);
    };

    // A second optional argument can be given to further configure
    // the parser process. These options are recognized:

    var defaultOptions = exports.defaultOptions = {
        // `ecmaVersion` indicates the ECMAScript version to parse. Must
        // be either 3 or 5. This
        // influences support for strict mode, the set of reserved words, and
        // support for getters and setter.
        ecmaVersion: 5,
        // Turn on `strictSemicolons` to prevent the parser from doing
        // automatic semicolon insertion.
        strictSemicolons: false,
        // When `allowTrailingCommas` is false, the parser will not allow
        // trailing commas in array and object literals.
        allowTrailingCommas: true,
        // By default, reserved words are not enforced. Enable
        // `forbidReserved` to enforce them.
        forbidReserved: false,
        // When `locations` is on, `loc` properties holding objects with
        // `start` and `end` properties in `{line, column}` form (with
        // line being 1-based and column 0-based) will be attached to the
        // nodes.
        locations: false,
        // A function can be passed as `onComment` option, which will
        // cause Overture to call that function with `(block, text, start,
        // end)` parameters whenever a comment is skipped. `block` is a
        // boolean indicating whether this is a block (`/* */`) comment,
        // `text` is the content of the comment, and `start` and `end` are
        // character offsets that denote the start and end of the comment.
        // When the `locations` option is on, two more parameters are
        // passed, the full `{line, column}` locations of the start and
        // end of the comments.
        onComment: null,
        // Nodes have their start and end characters offsets recorded in
        // `start` and `end` properties (directly on the node, rather than
        // the `loc` object, which holds line/column data. To also add a
        // [semi-standardized][range] `range` property holding a `[start,
        // end]` array with the same numbers, set the `ranges` option to
        // `true`.
        //
        // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
        ranges: false,
        // It is possible to parse multiple files into a single AST by
        // passing the tree produced by parsing the first file as
        // `program` option in subsequent parses. This will add the
        // toplevel forms of the parsed file to the `Program` (top) node
        // of an existing parse tree.
        program: null,
        // When `location` is on, you can pass this to record the source
        // file in every node's `loc` object.
        sourceFile: null
    };

    // The `getLineInfo` function is mostly useful when the
    // `locations` option is off (for performance reasons) and you
    // want to find the line/column position for a given character
    // offset. `input` should be the code string that the offset refers
    // into.

    var getLineInfo = exports.getLineInfo = function getLineInfo(input, offset) {
        for (var line = 1, cur = 0;;) {
            lineBreak.lastIndex = cur;
            var match = lineBreak.exec(input);
            if (match && match.index < offset) {
                ++line;
                cur = match.index + match[0].length;
            } else break;
        }
        return {line: line, column: offset - cur};
    };

    // Overture is organized as a tokenizer and a recursive-descent parser.
    // Both use (closure-)global variables to keep their state and
    // communicate. We already saw the `options`, `input`, and
    // `inputLen` variables above (set in `parse`).

    // The current position of the tokenizer in the input.

    var tokPos;

    // The start and end offsets of the current token.

    var tokStart, tokEnd;

    // When `options.locations` is true, these hold objects
    // containing the tokens start and end line/column pairs.

    var tokStartLoc, tokEndLoc;

    // The type and value of the current token. Token types are objects,
    // named by variables against which they can be compared, and
    // holding properties that describe them (indicating, for example,
    // the precedence of an infix operator, and the original name of a
    // keyword token). The kind of value that's held in `tokVal` depends
    // on the type of the token. For literals, it is the literal value,
    // for operators, the operator name, and so on.

    var tokType, tokVal;

    // Interal state for the tokenizer. To distinguish between division
    // operators and regular expressions, it remembers whether the last
    // token was one that is allowed to be followed by an expression.
    // (If it is, a slash is probably a regexp, if it isn't it's a
    // division operator. See the `parseStatement` function for a
    // caveat.)

    var tokRegexpAllowed;

    // When `options.locations` is true, these are used to keep
    // track of the current line, and know when a new line has been
    // entered.

    var tokCurLine, tokLineStart;

    // These store the position of the previous token, which is useful
    // when finishing a node and assigning its `end` position.

    var lastStart, lastEnd, lastEndLoc;

    // This is the parser's state. `inFunction` is used to reject
    // `return` statements outside of functions, `labels` to verify that
    // `break` and `continue` have somewhere to jump to, and `strict`
    // indicates whether strict mode is on.

    var inFunction, labels, strict;

    // This function is used to raise exceptions on parse errors. It
    // takes either a `{line, column}` object or an offset integer (into
    // the current `input`) as `pos` argument. It attaches the position
    // to the end of the error message, and then raises a `SyntaxError`
    // with that message.

    function raise(pos, message) {pos = pos || tokPos;
        if (typeof pos == "number") pos = getLineInfo(input, pos);
        message += " (" + pos.line + ":" + pos.column + ")";
        throw new SyntaxError(message);
    }

    // ## Token types

    // The assignment of fine-grained, information-carrying type objects
    // allows the tokenizer to store the information it has about a
    // token in a way that is very cheap for the parser to look up.

    // All token type variables start with an underscore, to make them
    // easy to recognize.

    // These are the general types. The `type` property is only used to
    // make them recognizeable when debugging.

    function type_t(type) {
        this.type = type;
    }

    function Label(name) { // utility, not spidermonkey
        this.name = name;
        this.kind = null;
    }

    var Node = function() {
        this.type = null;
    };

    function SourceLocation() {
        this.start = tokStartLoc;
        this.end = null;
        if (sourceFile !== null) this.source = sourceFile;
    };

    function Identifier() {
        this.type = 'Identifier';
        this.name = null;
    }

    function Program() {
        this.type = "Program";
        this.body = [];
    }

    function BreakStatement() {
        this.type = "BreakStatement";
        this.label = null;
    }

    function ContinueStatement() {
        this.type = "ContinueStatement";
        this.label = null;
    }

    function DebuggerStatement() {
        this.type = "DebuggerStatement";
    }
    function DoWhileStatement() {
        this.type = "DoWhileStatement";
        this.body = null;
        this.test = null;
    }
    function IfStatement() {
        this.type = "IfStatement";
        this.test = null;
        this.consequent = null;
        this.alternate = null;
    }

    function ReturnStatement() {
        this.type = "ReturnStatement";
        this.argument = null;
    }
    function SwitchStatement() {
        this.type = "SwitchStatement";
        this.discriminant = null;
        this.cases = [];
        this.lexical = false;
    }

    function SwitchCase() {
        this.type = 'SwitchCase';
        this.test = null;
        this.consequent = [];
    }


    function ThrowStatement() {
        this.type = "ThrowStatement";
        this.argument = null;
    }

    function TryStatement() {
        this.type = 'TryStatement';
        this.block = null;
        this.handler = null;
        this.finalizer = null;
    }
    function CatchClause() {
        this.type = 'CatchClause';
        this.param = null;
        this.body = null;
    }

    function WhileStatement() {
        this.type = "WhileStatement";
        this.test = null;
        this.body = null;
    }

    function WithStatement() {
        this.type = 'WithStatement';
        this.object = null;
        this.body = null;
    }
    function EmptyStatement() {
        this.type = "EmptyStatement";
    }
    function LabeledStatement() {
        this.type = "LabeledStatement";
        this.body = null;
        this.label = null;
    }
    function ExpressionStatement() {
        this.type = "ExpressionStatement";
        this.expression = null;
    }

    function BlockStatement() {
        this.type = "BlockStatement";
        this.body = [];
    }

    function ForStatement() {
        this.type = "ForStatement";
        this.init = null;
        this.test = null;
        this.update = null;
        this.body = null;
    }

    function ForInStatement() {
        this.type = "ForInStatement";
        this.left = null;
        this.right = null;
        this.body = null;
    }

    function VariableDeclaration() {
        this.type = "VariableDeclaration";
        this.declarations = [];
        this.kind = 'var';
    }
    function VariableDeclarator() {
        this.type = "VariableDeclarator";
        this.id = null;
        this.init = null;
    }

    function SequenceExpression() {
        this.type = "SequenceExpression";
        this.expressions = [];
    }

    function AssignmentExpression() {
        this.type = "AssignmentExpression";
        this.operator = null;
        this.left = null;
        this.right = null;
    }

    function ConditionalExpression() {
        this.type = "ConditionalExpression";
        this.test = null;
        this.consequent = null;
        this.alternate = null;
    }


    function LogicalExpression() {
        this.type = "LogicalExpression";
        this.left = null;
        this.operator = null;
        this.right = null;
    }
    function BinaryExpression() {
        this.type = "BinaryExpression";
        this.left = null;
        this.operator = null;
        this.right = null;
    }

    function UpdateExpression() {
        this.type = "UpdateExpression";
        this.operator = null;
        this.prefix = true;
        this.argument = null;
    }

    function UnaryExpression() {
        this.type = "UnaryExpression";
        this.operator = null;
        this.prefix = true;
        this.argument = null;
    }

    function MemberExpression_dot(b) {
        this.type = 'MemberExpression';
        this.object = b;
        this.property = null;
        this.computed = false;
    }
    function MemberExpression_bracketL(b) {
        this.type = 'MemberExpression';
        this.object = b;
        this.property = null;
        this.computed = true;
    }
    function CallExpression(callee) {
        this.type = "CallExpression";
        this.callee = callee;
        this.arguments = [];
    }

    function ThisExpression() {
        this.type = 'ThisExpression';
    }
    function Literal_number() {
        this.type = "Literal";
        this.value = 0;
    }
    function Literal_string() {
        this.type = "Literal";
        this.value = '';
    }
    function Literal_regexp() {
        this.type = "Literal";
        this.value = null;
    }
    function Literal_null() {
        this.type = "Literal";
        this.value = null;
    }
    function Literal_true() {
        this.type = "Literal";
        this.value = true;
    }
    function Literal_false() {
        this.type = "Literal";
        this.value = false;
    }

    function ArrayExpression() {
        this.type = "ArrayExpression";
        this.elements = [];
    }

    function NewExpression() {
        this.type = "NewExpression";
        this.callee = null;
        this.arguments = [];
    }

    function ObjectExpression() {
        this.type = "ObjectExpression";
        this.properties = [];
    }
    function ObjectExpressionProp() {
        this.key = null;
        this.value = null;
        this.kind = "init";
    }
    function FunctionDeclaration() {
        this.type = "FunctionDeclaration";
        this.id = null;
        this.params = [];
        this.defaults = [];
        this.rest = null;
        this.body = null;
        this.expression = false;
    }

    function FunctionExpression() {
        this.type = "FunctionExpression";
        this.id = null;
        this.params = [];
        this.defaults = [];
        this.rest = null;
        this.body = null;
        this.expression = false;
    }

    var PropertyKinds = {
        'init': new String('init'),
        'get': new String('get'),
        'set': new String('set')
    };

    var AssignmentOperator = {
            'eq'                                        : new String('='),
            'plus'                                    : new String('+='),
            'minus'                                 : new String('-='),
            'mult'                                    : new String('*='),
            'div'                                     : new String('/='),
            'modulo'                                : new String('%='),
            'left_shift'                        : new String('<<='),
            'right_shift'                     : new String('>>='),
            'zero_fill_right_shift' : new String('>>>='),
            'OR'                                    : new String('|='),
            'XOR'                                 : new String('^='),
            'AND'                                     : new String('&=')
    };

    var BinaryOperator = {
            'eq_eq'                                 : new String('=='),
            'ex_eq'                                 : new String('!='),
            'eq_eq_eq'                            : new String('==='),
            'ex_eq_eq'                            : new String('!=='),
            'lt'                                        : new String('<'),
            'lt_eq'                                 : new String('<='),
            'gt'                                        : new String('>'),
            'gt_eq'                                 : new String('>='),
            'left_shift'                        : new String('<<'),
            'right_shift'                     : new String('>>'),
            'zero_fill_right_shift' : new String('>>>'),
            'plus'                                    : new String('+'),
            'minus'                                 : new String('-'),
            'mult'                                    : new String('*'),
            'div'                                     : new String('/'),
            'modulo'                                : new String('%'),
            'OR'                                    : new String('|'),
            'AND'                                     : new String('&'),
            'XOR'                                 : new String('^'),
            'in'                                        : new String('in'),
            'instanceof'                        : new String('instanceof')
    };

    var LogicalOperator = {
            'OR'    : new String('||'),
            'AND' : new String('&&')
    };

    var UpdateOperator = {
            'increment' : new String('++'),
            'decrement' : new String('--')
    };

    var UnaryOperator = {
            'minus': new String('-'),
            'plus': new String('+'),
            'ex': new String('!'),
            'BITWISE_NOT': new String('~'),
            'typeof': new String('typeof'),
            'void': new String('void'),
            'delete': new String('delete')
    };

    var VariableDeclarationKind = {
            'var': new String('var'),
            'let': new String('let'),
            'const': new String('const')
    };

    var PropertyKind = {
            'init': new String('init'),
            'get': new String('get'),
            'set': new String('set')
    };

    // These are used when `options.locations` is on, in order to track
    // the current line number and start of line offset, in order to set
    // `tokStartLoc` and `tokEndLoc`.

    function line_loc_t() {
        this.line = tokCurLine;
        this.column = tokPos - tokLineStart;
    }


    var _num = new type_t("num"), _regexp = new type_t("regexp"), _string = new type_t("string");
    var _name = new type_t("name"), _eof = new binop_t(0);

    // Keyword tokens. The `keyword` property (also used in keyword-like
    // operators) indicates that the token originated from an
    // identifier-like word, which is used when parsing property names.
    //
    // The `beforeExpr` property is used to disambiguate between regular
    // expressions and divisions. It is set on all token types that can
    // be followed by an expression (thus, a slash after them would be a
    // regular expression).
    //
    // `isLoop` marks a keyword as starting a loop, which is important
    // to know when parsing a label, in order to allow or disallow
    // continue jumps to that label.

    function keyword_t(word) {
        this.keyword = new String(word);
        this.isLoop = false;
    }
    function binop_t(n) {
        this.binop = n;
    }
    function binop_pp_t(n) {
        this.binop = n;
        this.isAssign = false;
        this.prefix = false;
        this.postfix = false;
        this.isUpdate = false;
    }
    function prefix_t() {
        this.beforeExpr = false;
        this.binop = 0;
        this.prefix = false;
    }

    var _break = new keyword_t('break');
    var _case = new keyword_t('case');
    var _catch = new keyword_t('catch');
    var _continue = new keyword_t('continue');
    var _debugger = new keyword_t('debugger');
    var _default = new keyword_t('default');
    var _do = new keyword_t('do'); _do.isLoop = true;
    var _else = new keyword_t('else');
    var _finally = new keyword_t('finally');
    var _for = new keyword_t('for'); _for.isLoop = true;
    var _function = new keyword_t('function');
    var _if = new keyword_t('if');
    var _return = new keyword_t('return');
    var _switch = new keyword_t('switch');
    var _throw = new keyword_t('throw');
    var _try = new keyword_t('try');
    var _var = new keyword_t('var');
    var _while = new keyword_t('while'); _while.isLoop = true;
    var _with = new keyword_t('with');
    var _new = new keyword_t('new');
    var _this = new keyword_t('this');

    // The keywords that denote values.

    var _null = new keyword_t('null');
    var _true = new keyword_t('true');
    var _false = new keyword_t('false');

    // Some keywords are treated as regular operators. `in` sometimes
    // (when parsing `for`) needs to be tested against specifically, so
    // we assign a variable name to it for quick comparing.


    var _in = new binop_t(7);


    //
    var _void = new prefix_t(); _void.prefix = true;
    var _delete = new prefix_t(); _delete.prefix = true;
    var _typeof = new prefix_t(); _typeof.prefix = true;
    var _instanceof = new binop_t(7);

    // Punctuation token types. Again, the `type` property is purely for debugging.

    var _bracketL = new keyword_t('[');
    var _bracketR = new keyword_t(']');
    var _braceL = new keyword_t('{');
    var _braceR = new keyword_t('}');
    var _parenL = new keyword_t('(');
    var _parenR = new keyword_t(')');
    var _comma = new keyword_t(',');
    var _semi = new keyword_t(';');
    var _colon = new keyword_t(':');
    var _dot = new keyword_t('.');
    var _question = new keyword_t('?');

    // Operators. These carry several kinds of properties to help the
    // parser use them properly (the presence of these properties is
    // what categorizes them as operators).
    //
    // `binop`, when present, specifies that this operator is a binary
    // operator, and will refer to its precedence.
    //
    // `prefix` and `postfix` mark the operator as a prefix or postfix
    // unary operator. `isUpdate` specifies that the node produced by
    // the operator should be of type UpdateExpression rather than
    // simply UnaryExpression (`++` and `--`).
    //
    // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
    // binary operators with a very low precedence, that should result
    // in AssignmentExpression nodes.

    var _slash = new binop_pp_t(10);
    var _eq = new binop_pp_t(0); _eq.isAssign = true;
    var _assign = new binop_pp_t(0); _assign.isAssign = true;
    var _plusmin = new binop_pp_t(9); _plusmin.prefix = true;
    var _incdec = new binop_pp_t(0); _incdec.prefix = true; _incdec.postfix = true; _incdec.isUpdate = true;
    var _prefix = new binop_pp_t(0); _prefix.prefix = true;

    var _bin_minop = new binop_t(0);
    var _bin1 = new binop_t(1);
    var _bin2 = new binop_t(2);
    var _bin3 = new binop_t(3);
    var _bin4 = new binop_t(4);
    var _bin5 = new binop_t(5);
    var _bin6 = new binop_t(6);
    var _bin7 = new binop_t(7);
    var _bin8 = new binop_t(8);
    var _bin9 = new binop_t(9);
    var _bin10 = new binop_t(10);

    // This is a trick taken from Esprima. It turns out that, on
    // non-Chrome browsers, to check whether a string is in a set, a
    // predicate containing a big ugly `switch` statement is faster than
    // a regular expression, and on Chrome the two are about on par.
    //
    // eval was removed as it can't be optimized in v8 and the functions
    // are 'very hot' according to its tracing
    //
    // It starts by sorting the words by length.

    // The ECMAScript 3 reserved word list.

    var isReservedWord3 = function(str) {
        switch (str.length) {
            case 3:
                    return str==="int";
            case 4:
                return str==="byte"||str==="char"||str==="enum"||str==="goto"||str==="long";
            case 5:
                return str==="class"||str==="final"||str==="float"||str==="short"||str==="super";
            case 6:
                return str==="double"||str==="export"||str==="import"||str==="native"||str==="public"||str==="static"||str==="throws";
            case 7:
                return str==="boolean"||str==="extends"||str==="package"||str==="private";
            case 8:
                return str==="abstract"||str==="volatile";
            case 9:
                return str==="interface"||str==="protected"||str==="transient";
            case 10:
                    return str==="implements";
            case 12:
                    return str==="synchronized";
            default:
                return false;
        }
    }

    // ECMAScript 5 reserved words.

    function isReservedWord5(str) {
        switch (str.length) {
            case 4:
                return str === 'enum';
            case 5:
                return str === 'class' || str === 'super';
            case 6:
                return str === 'export' || str === 'import';
            case 7:
                return str === 'extends';
            default:
                return false;
        }
    }
    // The additional reserved words in strict mode.

    function isStrictReservedWord(str) {
        switch (str.length) {
            case 3:
                return str === 'let';
            case 5:
                return str === 'yield';
            case 6:
                return str === 'static' || str === 'public';
            case 7:
                return str === 'private' || str === 'package';
            case 9:
                return str === 'interface' || str === 'protected';
            case 10:
                return str === 'implements';
            default:
                return false;
        }
    }
    // The forbidden variable names in strict mode.

    var isStrictBadIdWord = function(str) {
        return str === "eval" || str === "arguments";
    }

    // And the keywords.

    var isKeyword = function(str, type) {
        switch (str.length) {
            case 4:
                    switch (str) {
                            case "null": return _null;
                            case "else": tokRegexpAllowed = false; return _else;
                            case "true": return _true;
                            case "this": return _this;
                            case "case": tokRegexpAllowed = true; return _case;
                            case "with": return _with;
                            case "void": return _void;
                    }
                    return type;
            case 5:
                    switch (str) {
                            case "false": return _false;
                            case "break": return _break;
                            case "while": return _while;
                            case "catch": return _catch
                            case "throw": tokRegexpAllowed = false; return _throw;
                    }
                    return type;
            case 3:
                    switch (str) {
                            case "var": return _var;
                            case "for": return _for;
                            case "new": tokRegexpAllowed = false; return _new;
                            case "try": return _try;
                    }
                    return type;
            case 6:
                    switch (str) {
                            case "return": tokRegexpAllowed = true; return _return;
                            case "switch": return _switch;
                            case "typeof": return _typeof;
                            case "delete": return _delete;
                    }
                    return type;
            case 8:
                    switch (str) {
                            case "function": return _function;
                            case "continue": return _continue;
                            case "debugger": return _debugger;
                    }
                    return type;
            case 2:
                    switch (str) {
                            case "if": return _if;
                            case "in": tokRegexpAllowed = true; return _in;
                            case "do": return _do;
                    }
                    return type;
            case 7:
                    switch (str) {
                            case "default": return _default;
                            case "finally": return _finally;
                    }
                    return type;
            case 10: if(str === "instanceof") return _instanceof;
            default: return type;
        }
    };

    // ## Character categories

    // Big ugly regular expressions that match characters in the
    // whitespace, identifier, and identifier-start categories. These
    // are only applied when a character is found to actually have a
    // code point above 128.

    var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;
    var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
    var nonASCIIidentifierChars = "\u0371-\u0374\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";
    var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

    // Whether a single character denotes a newline.

    var newline = /[\n\r\u2028\u2029]/;

    // Matches a whole line break (where CRLF is considered a single
    // line break). Used to count lines.

    var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;

    // Test whether a given character code starts an identifier.

    function isIdentifierStart(code) {
        if (code < 65) return code === 36;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        if (code >= 0xaa) {
            return nonASCIIidentifierStart.test(String.fromCharCode(code));
        }
        return false;
    }

    // Test whether a given character is part of an identifier.

    function isIdentifierChar(code) {
        if (code < 48) return code === 36;
        if (code < 58) return true;
        if (code < 65) return false;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123)return true;
        if (code >= 0xaa) {
            return nonASCIIidentifier.test(String.fromCharCode(code));
        }
        return false;
    }

    // ## Tokenizer


    // Reset the token state. Used at the start of a parse.

    function initTokenState() {
        tokCurLine = 1;
        tokPos = tokLineStart = 0;
        tokRegexpAllowed = true;
        skipSpace();
    }

    // Called at the end of every token. Sets `tokEnd`, `tokVal`, and
    // `tokRegexpAllowed`, and skips the space after the token, so that
    // the next one's `tokStart` will point at the right position.

    function finishToken(type, val) {
        tokEnd = tokPos;
        //if (options.locations) tokEndLoc = new line_loc_t();
        tokType = type;
        skipSpace();
        tokVal = val;
    }

    function skipBlockComment() {
        tokPos += 2;
        var end = input.indexOf("*/", tokPos);
        if (end === -1) raise(tokPos - 2, "Unterminated comment");
        tokPos = end + 2;
    }

    function skipLineComment() {
        tokPos += 2;
        var ch = input.charCodeAt(tokPos);
        while (ch !== 10 && ch !== 13 && tokPos < inputLen && ch !== 8232 && ch !== 8329) {
            ++tokPos;
            ch = input.charCodeAt(tokPos);
        }
    }

    // Called at the start of the parse and after every token. Skips
    // whitespace and comments, and.

    function skipSpace() {
        var ch = 0;
        while (tokPos < inputLen) {
            ch = input.charCodeAt(tokPos);

            switch(ch) {
                case 32: ++tokPos; break;
                case 9: ++tokPos; break;
                case 10: ++tokPos; break;
                case 47:
                    ch = input.charCodeAt(tokPos+1);
                    if (ch === 42) { // '*'
                        skipBlockComment();
                    } else if (ch === 47) { // '/'
                        skipLineComment();
                    } else return;
                    break;
                case 13:
                    ++tokPos;
                    ch = input.charCodeAt(tokPos);
                    if(ch === 10) {         // -> '\r\n'
                        ++tokPos;
                    }
                    break;
                case 11: ++tokPos; break;
                case 12: ++tokPos; break;
                case 160: ++tokPos; break;

                default:
                    if (ch >= 5760) {
                        if(ch === 0x1680 ||
                            ch === 0x180e ||
                            ch === 0x2028 ||
                            ch === 0x2029 ||
                            ch === 0x202f ||
                            ch === 0x205f ||
                            ch === 0x3000 ||
                            ch === 0xfeff || (ch >= 0x2000 && ch <= 0x200a)) {
                            ++tokPos;
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
            }
        }
    }

    // ### Token reading

    // This is the function that is called to fetch the next token. It
    // is somewhat obscure, because it works in character codes rather
    // than characters, and because operator parsing has been inlined
    // into it.
    //
    // All in the name of speed.
    //
    // The `forceRegexp` parameter is used in the one case where the
    // `tokRegexpAllowed` trick does not work. See `parseStatement`.

    var nextChar = 0;

    // The interpretation of a dot depends on whether it is followed
    // by a digit.
    function readToken_dot(code) {
        nextChar = input.charCodeAt(tokPos+1);
        if (nextChar >= 48 && nextChar <= 57) {
            readNumber(46);
        } else {
            ++tokPos;
            tokRegexpAllowed = true;
            finishToken(_dot);
        }
    }

    function readToken_slash() { // '/'
        ++tokPos;
        if (tokRegexpAllowed) {
            readRegexp();
            return;
        }

        nextChar = input.charCodeAt(tokPos);

        if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.div);
        } else {
            finishToken(_slash, BinaryOperator.div);
        }
        tokRegexpAllowed = true;
    }

    function readToken_mult() { // '%*'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.mult);
        } else {
            finishToken(_bin10, BinaryOperator.mult);
        }
        tokRegexpAllowed = true;
    }

    function readToken_modulo() { // '%*'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.modulo);
        } else {
            finishToken(_bin10, BinaryOperator.modulo);
        }
        tokRegexpAllowed = true;
    }

    function readToken_OR() { // '|'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 124) {
            ++tokPos;
            finishToken(_bin1, LogicalOperator.OR);
        } else if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.OR);
        } else {
            finishToken(_bin3, BinaryOperator.OR);
        }
        tokRegexpAllowed = true;
    }

    function readToken_AND() { // '&'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 38) {
            ++tokPos;
            finishToken(_bin2, LogicalOperator.AND);
        } else if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.AND);
        } else {
            finishToken(_bin5, BinaryOperator.AND);
        }
        tokRegexpAllowed = true;
    }

    function readToken_XOR() { // '^'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.XOR);
        } else {
            finishToken(_bin4, BinaryOperator.XOR);
        }
        tokRegexpAllowed = true;
    }

    function readToken_plus() { // '+'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 43) {
            ++tokPos;
            finishToken(_incdec, UpdateOperator.increment);
        } else if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.plus);
        } else {
            finishToken(_plusmin, UnaryOperator.plus);
        }
        tokRegexpAllowed = true;
    }

    function readToken_min() { // '-'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 45) {
            ++tokPos;
            finishToken(_incdec, UpdateOperator.decrement);
        } else if (nextChar === 61) {
            ++tokPos;
            finishToken(_assign, AssignmentOperator.minus);
        } else {
            finishToken(_plusmin, UnaryOperator.minus);
        }
        tokRegexpAllowed = true;
    }

    function readToken_lt() { // '<'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        var size = 1;
        if (nextChar === 60) {
            if (input.charCodeAt(tokPos + 1) === 61) {
                tokPos += 2;
                finishToken(_assign, AssignmentOperator.left_shift);
            } else {
                ++tokPos;
                finishToken(_bin8, BinaryOperator.left_shift);
            }
        } else {
            if (nextChar === 61) {
                ++tokPos;
                finishToken(_bin8, BinaryOperator.lt_eq);
            } else {
                finishToken(_bin8, BinaryOperator.lt);
            }
        }
        tokRegexpAllowed = true;
    }

    function readToken_gt() { // '>'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        var size = 1;
        if (nextChar === 62) {
            nextChar = input.charCodeAt(tokPos + 1);

            if (nextChar === 61) {
                tokPos += 2;
                finishToken(_assign, AssignmentOperator.right_shift);
            } else if (nextChar === 62) {
                nextChar = input.charCodeAt(tokPos + 2);
                if (nextChar === 61) {
                    tokPos += 3;
                    finishToken(_assign, AssignmentOperator.zero_fill_right_shift);
                } else {
                    tokPos += 2;
                    finishToken(_bin8, BinaryOperator.zero_fill_right_shift);
                }
            } else {
            ++tokPos;
                finishToken(_bin8, BinaryOperator.right_shift);
            }
        } else {
            if (nextChar === 61) {
                ++tokPos;
                finishToken(_bin8, BinaryOperator.gt_eq);
            } else {
                finishToken(_bin8, BinaryOperator.gt);
            }
        }
        tokRegexpAllowed = true;
    }

    function readToken_excl() { // '!'
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 61) {
            if (input.charCodeAt(tokPos+1) === 61) {
                tokPos += 2;
                finishToken(_bin6, BinaryOperator.ex_eq_eq);
            } else {
            ++tokPos;
                finishToken(_bin6, BinaryOperator.ex_eq);
            }
        } else {
            finishToken(_prefix, UnaryOperator.ex);
        }
        tokRegexpAllowed = true;
    }

    function readToken_eq() { // '='
        ++tokPos;
        nextChar = input.charCodeAt(tokPos);
        if (nextChar === 61) {
            ++tokPos;
            if (input.charCodeAt(tokPos) === 61) {
                ++tokPos;
                finishToken(_bin6, BinaryOperator.eq_eq_eq);
            } else {
                finishToken(_bin6, BinaryOperator.eq_eq);
            }
        } else {
            finishToken(_eq, AssignmentOperator.eq);
        }
        tokRegexpAllowed = true;
    }

    function readToken_BITWISE_NOT() {
        ++tokPos;
        finishToken(_prefix, UnaryOperator.BITWISE_NOT);
        tokRegexpAllowed = true;
    }

    function readMaybeHex() {
        nextChar = input.charCodeAt(tokPos+1);
        if (nextChar === 120 || nextChar === 88) {
            readHexNumber();
        } else {
            readNumber(48);
        }
    }

    function readToken_default(code) {
        // If we are here, we either found a non-ASCII identifier
        // character, or something that's entirely disallowed.
        var ch = String.fromCharCode(code);
        if (code === 92) {
            finishToken(_name, readWord_Esc('', isIdentifierStart));
        } else if (nonASCIIidentifierStart.test(ch)) {
            readWord();
        } else {
            raise(tokPos, "Unexpected character '" + ch + "'");
        }

    }

    function getTokenFromCode(code) {
        switch(code) {
        case 46: readToken_dot(); break;

            // Punctuation tokens.
        case 40: ++tokPos; tokRegexpAllowed = true; finishToken(_parenL); break;
        case 41: ++tokPos; tokRegexpAllowed = false; finishToken(_parenR); break;
        case 59: ++tokPos; tokRegexpAllowed = true; finishToken(_semi); break;
        case 44: ++tokPos; tokRegexpAllowed = true; finishToken(_comma); break;
        case 91: ++tokPos; tokRegexpAllowed = true; finishToken(_bracketL); break;
        case 93: ++tokPos; tokRegexpAllowed = false; finishToken(_bracketR); break;
        case 123: ++tokPos; tokRegexpAllowed = true; finishToken(_braceL); break;
        case 125: ++tokPos; tokRegexpAllowed = false; finishToken(_braceR); break;
        case 58: ++tokPos; tokRegexpAllowed = true; finishToken(_colon); break;
        case 63: ++tokPos; tokRegexpAllowed = true; finishToken(_question); break;

            // '0x' is a hexadecimal number.
        case 48: readMaybeHex(); break;
            // Anything else beginning with a digit is an integer, octal
            // number, or float.
        case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
            readNumber(code);
            break;

            // Quotes produce strings.
        case 34: case 39: readString(code); break;

        case 47: readToken_slash(); break;
        case 124: readToken_OR(); break;
        case 38: readToken_AND(); break;
        case 94: readToken_XOR(); break;
        case 60: readToken_lt(); break;
        case 62: readToken_gt(); break;
        case 61: readToken_eq(); break;
        case 33: readToken_excl(); break;
        case 126: readToken_BITWISE_NOT(); break;

        case 37: readToken_modulo(); break;
        case 42: readToken_mult(); break;
        case 43: readToken_plus(); break;
        case 45: readToken_min(); break;

        default:
            readToken_default(code);
        }
    }

    function readToken_forceRegexp() {
        tokStart = tokPos;
//        if (options.locations) tokStartLoc = new line_loc_t();
        tokCommentsBefore = tokComments;
        return readRegexp();
    }

    function readToken() {
    // readToken is necessarily big to avoid inlining in v8!
    // readToken is necessarily big to avoid inlining in v8!
    // readToken is necessarily big to avoid inlining in v8!
    // readToken is necessarily big to avoid inlining in v8!
    // readToken is necessarily big to avoid inlining in v8!
    // readToken is necessarily big to avoid inlining in v8!
    // readToken is necessarily big to avoid inlining in v8!

 //     if (options.locations) tokStartLoc = new line_loc_t();
        if (tokPos >= inputLen) {
            finishToken(_eof);
        } else {
            var code = input.charCodeAt(tokPos);

            tokStart = tokPos;

            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            if (isIdentifierStart(code)) {
                readWord();
            } else if (code === 92) { // '\'
                finishToken(_name, readWord_Esc('', isIdentifierStart));
            } else {
                getTokenFromCode(code);
            }
        }
    }

    // Parse a regular expression. Some context-awareness is necessary,
    // since a '/' inside a '[]' set does not end the expression.

    function readRegexp() {
        var start = tokPos;
        var flags = 0; // ESCAPED | IN CLASS
        var ch = 0;

        for (;;) {
            ch = input.charCodeAt(tokPos);
            if (tokPos >= inputLen || ch === 10 || ch === 13 || ch === 8232 || ch === 8329) {
                raise(start, "Unterminated regular expression");
            }
            if ((flags & 1) !== 0) { // escaped
                flags &= 2; // escaped = false
            } else {
                if (ch === 91) { // '['
                    flags |= 2; // inclass = true
                } else if (ch === 93 && (flags & 2) !== 0) {
                    flags &= 1; // inclass = false
                } else if (ch === 47 && (flags & 2 ^ 2) !== 0) { // inclass == false
                    break;
                } else if (ch === 92) {
                    flags |= 1; // escaped = true
                }
            }
            ++tokPos;
        }

        ++tokPos;
        // Need to use `readWord_regexpMods` because '\uXXXX' sequences are allowed
        // here (don't ask).
        var mods = readWord_regexpMods();

        var i=mods.length-1;
        for(;i>0;i--) {
            ch = mods.charCodeAt(i);
            if(ch !== 103 && ch !== 105 && ch !== 109 && ch !== 115 && ch !== 121) {
                raise(start, "Invalid regexp flag");
            }
        }

        tokRegexpAllowed = false;
        return finishToken(_regexp, new RegExp(input.substring(start, tokPos), mods));
    }

    function readInt16(len) {
        var start = tokPos, total = 0;
        for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
            var code = input.charCodeAt(tokPos), val;
            if (code >= 48 && code <= 57) val = code - 48; // 0-9
            else if (code >= 97) val = code - 87;//97 + 10; // a + 10
            else if (code >= 65) val = code - 55;//65 + 10; // A + 10
            else break;
            if (val >= 16) break;
            ++tokPos;
            total = total * 16 + val;
        }
        if (tokPos === start || len != null && tokPos - start !== len) return null;

        return total;
    }

    function readHexNumber() {
        tokPos += 2; // 0x
        var val = readInt16();
        if (val === null) raise(tokStart + 2, "Expected hexadecimal number");
        if (isIdentifierStart(input.charCodeAt(tokPos))) raise(tokPos, "Identifier directly after number");
        tokRegexpAllowed = false;
        return finishToken(_num, val);
    }

    // Read an integer, octal integer, or floating-point number.

    function readNumber(code) {
        var startCode = code;
        var start = tokPos;
        var flags = 0;    // FLOAT | EXP | OCTAL
        var prev = -1;

        while(tokPos < inputLen) {
            if(code === 46) { // '.'
                if((flags & 1) !== 0) {
                    break;
                } else {
                    flags |= 1;
                }
            } else if (code === 43 || code === 45) { // '+-'
                if(prev !== 101 && prev !== 69) { // 'eE'
                    break;
                }
            } else if (code === 101 || code === 69) { // 'eE'
                if((flags & 2) !== 0) {
                    raise(tokPos, "Identifier directly after number");
                    break;
                } else {
                    flags |= 3;
                }
            } else if(isIdentifierStart(input.charCodeAt(tokPos))) {
                if((flags & 2) !== 0) {
                    raise(start, "Invalid number");
                } else {
                    raise(tokPos, "Identifier directly after number");
                }
                break;
            } else if (code === 56 || code === 57) { // 89
                flags |= 4;
            } else if (code < 48 || code > 57) { // 0-9
                break;
            }
            prev = code;
            code = input.charCodeAt(++tokPos);
        }

        if((flags & 3) !== 0 && (prev === 101 || prev === 69 || prev === 43 || prev === 45)) { // 'eE','+-'
            raise(start, "Invalid number");
        }

        if((flags & 1) !== 0) {
            code = parseFloat(input.substring(start, tokPos));
        } else if(startCode !== 48 || (tokPos - start) === 1) {
            code = input.substring(start, tokPos) | 0; // this is what parseInt(...,10) does
        } else if (strict || (flags & 4) !== 0) {
            raise(start, "Invalid number");
        } else {
            code = parseInt(input.substring(start, tokPos), 8);
        }

        tokRegexpAllowed = false;
        return finishToken(_num, code);
    }

    // Read a string value, interpreting backslash-escapes.

    function readOctalLiteral(ch) {
        var shift = 0;
        var ret = ch - 48;

        var ch2 = input.charCodeAt(tokPos);
        if(ch2 >= 48 && ch2 <= 55) {    // 0-7
            shift = 1;
            ret = ret * 8 + ch2 - 48;

            if(ch < 52) { // '3' because value must be less than 255 overall -> 377 in octal
                var ch3 = input.charCodeAt(tokPos+1);
                if(ch3 >= 48 && ch3 <= 55) {    // 0-7
                    shift = 2;
                    ret = ret * 8 + ch3 - 48;
                }
            }
        }
        if(ret !== 0) {
            if (strict) raise(tokPos - 2, "Octal literal in strict mode");
            tokPos += shift;
        }
        return ret;
    }

    var rs_str = [];

    function readString(quote) {
        tokPos++;
        rs_str.length = 0;

        var start = tokPos;
        var lastEsc = tokPos;

        while (tokPos < inputLen) {
            var ch = input.charCodeAt(tokPos);

            if (ch === quote) {
                if(lastEsc === start) {
                    ch = input.substring(lastEsc,tokPos);
                } else {
                    if(lastEsc !== tokPos) {
                        rs_str.push(input.substring(lastEsc,tokPos));
                    }
                    ch = rs_str.join('');
                }

                ++tokPos;
                tokRegexpAllowed = false;
                finishToken(_string, ch);
                return;

            } else if (ch === 92) { // '\'
                if(lastEsc !== tokPos) {
                    rs_str.push(input.substring(lastEsc,tokPos));
                }

                ch = input.charCodeAt(++tokPos);
                ++tokPos;

                switch(ch) {
                    case 110: rs_str.push('\n'); break; // 'n' -> '\n'
                    case 114: rs_str.push('\r'); break; // 'r' -> '\r'
                    case 120: rs_str.push(String.fromCharCode(readHexChar(2))); break; // 'x'
                    case 117: rs_str.push(String.fromCharCode(readHexChar(4))); break; // 'u'
                    case 85: rs_str.push(String.fromCharCode(readHexChar(8))); break; // 'U'
                    case 116: rs_str.push('\t'); break; // 't' -> '\t'
                    case 98: rs_str.push('\b'); break; // 'b' -> '\b'
                    case 118: rs_str.push('\u000b'); break; // 'v' -> '\u000b'
                    case 102: rs_str.push('\f'); break; // 'f' -> '\f'
                    case 13: // '\r'
                        if (input.charCodeAt(tokPos) === 10) ++tokPos; // '\r\n'
                    case 10: // ' \n'
                        // if(options.locations) {
                        //     tokLineStart = tokPos;
                        //     ++tokCurLine;
                        // }
                        break;

                    default:
                        if(ch >= 48 & ch <= 55) { // 0-7 -> possible octal
                            ch = readOctalLiteral(ch);
                        }
                        rs_str.push(String.fromCharCode(ch));
                }

                lastEsc = tokPos;

            } else if (ch === 13 || ch === 10 || ch === 8232 || ch === 8329) {
                raise(tokStart, "Unterminated string constant");
                break;
            } else {
                ++tokPos;
            }
        }
        if (tokPos >= inputLen) {
            raise(tokStart, "Unterminated string constant");
        }
    }
    // Used to read character escape sequences ('\x', '\u', '\U').

    function readHexChar(len) {
        var n = readInt16(len);
        if (n === null) raise(tokStart, "Bad character escape sequence");
        return n;
    }

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.

    var containsEsc;

    // Read an identifier, and return it as a string. Sets `containsEsc`
    // to whether the word contained a '\u' escape.
    //
    // Only builds up the word character-by-character when it actually
    // containeds an escape, as a micro-optimization.

    function readWord_Esc(word, identifierFn) {
        containsEsc = true;

        for (;;) {
            var ch = input.charCodeAt(tokPos);
            if (isIdentifierChar(ch)) {
                word += input.charAt(tokPos);
                ++tokPos;
            } else if (ch === 92) { // "\"
                if (input.charCodeAt(++tokPos) != 117) // "u"
                    raise(tokPos, "Expecting Unicode escape sequence \\uXXXX");
                ++tokPos;
                var esc = readHexChar(4);
                var escStr = String.fromCharCode(esc);
                if (escStr === '') {
                    raise(tokPos - 1, "Invalid Unicode escape");
                } else if (identifierFn(esc) === false) {
                    raise(tokPos - 4, "Invalid Unicode escape");
                } else {
                    word += escStr;
                }
            } else {
                break;
            }
        }
        return word;
    }

    function readWord_regexpMods() {
        containsEsc = false;
        var word, start = tokPos;

        var ch = input.charCodeAt(tokPos);
        if (isIdentifierStart(ch)) {
            ++tokPos;
        } else if (ch === 92) { // "\"
            return readWord_Esc(input.substring(start, tokPos), isIdentifierStart);
        }

        for (;;) {
            ch = input.charCodeAt(tokPos);

            if (isIdentifierChar(ch)) {
                ++tokPos;
            } else if (ch === 92) { // "\"
                return readWord_Esc(input.substring(start, tokPos), isIdentifierChar);
            } else {
                break;
            }
        }
        return input.substring(start, tokPos);
    }

    function readWord_n() {
        var start = tokPos;
        var ch = 0;

        ++tokPos;

        for (;;) {
            ch = input.charCodeAt(tokPos);

            if (isIdentifierChar(ch)) {
                ++tokPos;
            } else if (ch === 92) { // "\"
                return readWord_Esc(input.substring(start, tokPos), isIdentifierChar);
            } else {
                break;
            }
        }
        return input.substring(start, tokPos);
    }

    // Read an identifier or keyword token. Will check for reserved
    // words when necessary.
    function readWord() {
        containsEsc = false;
        tokRegexpAllowed = false;

        var word = readWord_n();
        var type = _name;
        if (word.length > 1 && containsEsc === false) {
            type = isKeyword(word, type);
            if(strict && type === _name && isStrictReservedWord(word)) {
                raise(tokStart, "The keyword '" + word + "' is reserved");
            }
        }
        return finishToken(type, word);
    }

    function readWord_checkReserved() {
        containsEsc = false;
        tokRegexpAllowed = false;

        var word = readWord_n();
        var type = _name;
        if (word.length > 1 && containsEsc === false) {
            type = isKeyword(word, type);
            if(type === _name) {
                if ((options.ecmaVersion === 3 ? isReservedWord3 : isReservedWord5)(word))
                    raise(tokStart, "The keyword '" + word + "' is reserved");
                else if (strict && isStrictReservedWord(word))
                    raise(tokStart, "The keyword '" + word + "' is reserved");
            }
        }
        return finishToken(type, word);
    }

    // ## Parser

    // A recursive descent parser operates by defining functions for all
    // syntactic elements, and recursively calling those, each function
    // advancing the input stream and returning an AST node. Precedence
    // of constructs (for example, the fact that `!x[1]` means `!(x[1])`
    // instead of `(!x)[1]` is handled by the fact that the parser
    // function that parses unary prefix operators is called first, and
    // in turn calls the function that parses `[]` subscripts — that
    // way, it'll receive the node for `x[1]` already parsed, and wraps
    // *that* in the unary operator node.
    //
    // Overture uses an [operator precedence parser][opp] to handle binary
    // operator precedence, because it is much more compact than using
    // the technique outlined above, which uses different, nesting
    // functions to specify precedence, for all of the ten binary
    // precedence levels that JavaScript defines.
    //
    // [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

    // ### Parser utilities

    // Continue to the next token.

    function next() {
        lastEnd = tokEnd;
        readToken();
    }

    // Enter strict mode. Re-reads the next token to please pedantic
    // tests ("use strict"; 010; -- should fail).

    function setStrict(strct) {
        strict = strct;
        tokPos = lastEnd;
        skipSpace();
        readToken();
    }

    // Test whether a statement node is the string literal `"use strict"`.

    function isUseStrict(stmt) {
        return options.ecmaVersion >= 5 && stmt instanceof ExpressionStatement &&
            stmt.expression instanceof Literal_string && stmt.expression.value === "use strict";
    }

    // Predicate that tests whether the next token is of the given
    // type, and if yes, consumes it as a side effect.

    function eat(type) {
        if (tokType === type) {
            next();
            return true;
        }
        return false;
    }

    // Test whether a semicolon can be inserted at the current position.

    function canInsertSemicolon() {
        return !options.strictSemicolons &&
            (tokType === _eof || tokType === _braceR || newline.test(input.substring(lastEnd, tokStart)));
    }

    function cannotInsertSemicolon() {
        return tokType !== _eof && tokType !== _braceR && !newline.test(input.substring(lastEnd, tokStart));
    }

    function not_semicolon() {
        if(tokType === _semi) {
            next();
            return false;
        } else {
            return tokType !== _eof && tokType !== _braceR && !newline.test(input.substring(lastEnd, tokStart));
        }
    }
    // Consume a semicolon, or, failing that, see if we are allowed to
    // pretend that there is a semicolon at this position.

    function semicolon() {
        if (not_semicolon()) unexpected();
    }

    // Expect a token of a given type. If found, consume it, otherwise,
    // raise an unexpected token error.

    function expect(type) {
        if (tokType === type) next();
        else unexpected();
    }

    // Raise an unexpected token error.

    function unexpected() {
        raise(tokStart, "Unexpected token");
    }

    // Verify that a node is an lval — something that can be assigned
    // to.

    function checkLVal(expr) {
        if (expr instanceof MemberExpression_dot || expr instanceof MemberExpression_bracketL) {
            return;
        } else if (expr instanceof Identifier) {
            if (strict && isStrictBadIdWord(expr.name))
                raise(tokPos, "Assigning to " + expr.name + " in strict mode");
        } else {
            raise(tokPos, "Assigning to rvalue");
        }
    }

    // ### Statement parsing

    // Parse a program. Initializes the parser, reads any number of
    // statements, and wraps them in a Program node.    Optionally takes a
    // `program` argument.    If present, the statements will be appended
    // to its body instead of creating a new node.

    function parseTopLevel(program) {
        initTokenState();
//        lastStart = lastEnd = tokPos;
        lastEnd = tokPos;
//        if (options.locations) lastEndLoc = new line_loc_t();
        inFunction = strict = null;
        labels = [];
        readToken();

        var node = program || new Program();
        if(tokType !== _eof) {
                var stmt = parseStatement();
                node.body.push(stmt);
                if (isUseStrict(stmt)) setStrict(true);

                while(tokType !== _eof) {
                    var stmt = parseStatement();
                    node.body.push(stmt);
                }
        }
        return node;
    }

    var str_loop = new String('loop');
    var str_switch = new String('switch');

    var loopLabel = {kind: str_loop};
    var switchLabel = {kind: str_switch};

    // Parse a single statement.
    //
    // If expecting a statement and finding a slash operator, parse a
    // regular expression literal. This is to handle cases like
    // `if (foo) /blah/.exec(foo);`, where looking at the previous token
    // does not help.

    function check_label_exists(label,isBreak,starttype) {
        var i=0,leni = labels.length;
        // Verify that there is an actual destination to break or
        // continue to.

        for (; i < leni; ++i) {
            var lab = labels[i];
            if (label === null || lab.name === label.name) {
                if (lab.kind != null && (isBreak || lab.kind === str_loop)) break;
                if (isBreak) break;
            }
        }
        if (i === leni) raise(tokPos, "Unsyntactic " + starttype.keyword);
    }

    function parse_BreakStatement() {
        var starttype = tokType, node = new BreakStatement();
        next();

        if (not_semicolon()) {
            if (tokType !== _name) unexpected();
            else {
                node.label = parse_Identifier();
                semicolon();
            }
        }
        check_label_exists(node.label, true, starttype);
        return node;
    }

    function parse_ContinueStatement() {
        var starttype = tokType, node = new ContinueStatement();
        next();

        if (not_semicolon()) {
            if (tokType !== _name) unexpected();
            else {
                node.label = parse_Identifier();
                semicolon();
            }
        }
        check_label_exists(node.label, false, starttype);
        return node;
    }

    function parse_DebuggerStatement() {
        var node = new DebuggerStatement();
        next();
        semicolon();
//        node.type = "DebuggerStatement";
        return node;
    }

    function parse_DoWhileStatement() {
        var node = new DoWhileStatement();
        next();
        labels.push(loopLabel);
        node.body = parseStatement();
        labels.pop();
        expect(_while);
        node.test = parseParenExpression();
        semicolon();
        //node.type = "DoWhileStatement";
        return node
    }

    // Disambiguating between a `for` and a `for`/`in` loop is
    // non-trivial. Basically, we have to parse the init `var`
    // statement or expression, disallowing the `in` operator (see
    // the second parameter to `parseExpression`), and then check
    // whether the next token is `in`. When there is no init part
    // (semicolon immediately after the opening parenthesis), it is
    // a regular `for` loop.

    function parseStatement_for() {
        var init = null;
        var node = null;
        next();
        labels.push(loopLabel);
        expect(_parenL);
        if (tokType === _semi) return parse_ForStatement();
        if (tokType === _var) {
            next();
            init = parseVar(true);
            if (init.declarations.length === 1 && eat(_in) === true) {
                node = parse_ForInStatement();
                node.left = init;
            } else {
                node = parse_ForStatement();
                node.init = init;
            }
            return node;
        }
        init = parseExpression(true);
        if (eat(_in) === true) {
            checkLVal(init);
            node = parse_ForInStatement();
            node.left = init;
        } else {
            node = parse_ForStatement();
            node.init = init;
        }
        return node;
    }

    function parse_Function() {
        var node = new FunctionDeclaration();
        next();
        if(tokType !== _name) unexpected();
        return parseFunction(node);
    }

    function parse_IfStatement() {
        var node = new IfStatement();
        next();
        node.test = parseParenExpression();
        node.consequent = parseStatement();
        if(eat(_else) === true) {
            node.alternate = parseStatement();
        }
        return node;
    }

        // In `return` (and `break`/`continue`), the keywords with
        // optional arguments, we eagerly look for a semicolon or the
        // possibility to insert one.

    function parse_ReturnStatement() {
        var node = new ReturnStatement();
        if (inFunction) {
            next();
            if (not_semicolon()) {
                node.argument = parseExpression(false);
                semicolon();
            }
            return node;
        } else {
            raise(tokStart, "'return' outside of function");
        }
    }

    function parse_SwitchStatement() {
        var node = new SwitchStatement();
        var cur = null, sawDefault = false;
        next();
        node.discriminant = parseParenExpression();
        expect(_braceL);
        labels.push(switchLabel);

        // Statements under must be grouped (by label) in SwitchCase
        // nodes. `cur` is used to keep the node that we are currently
        // adding statements to.

        for (;;) {
            if (tokType === _braceR) {
                break;

            } else if (tokType === _case) {
                node.cases.push(cur = new SwitchCase());
                next();
                cur.test = parseExpression(false);
                expect(_colon);

            } else if (tokType === _default) {
                if (sawDefault) {
                    raise(lastStart, "Multiple default clauses");
                } else {
                    sawDefault = true;
                    node.cases.push(cur = new SwitchCase());
                    next();
                    expect(_colon);
                }

            } else {
                if (cur === null) unexpected();
                cur.consequent.push(parseStatement());
            }
        }

        next(); // Closing brace
        labels.pop();
        return node;
    }

    function parse_ThrowStatement() {
        var node = new ThrowStatement();
        next();
        if (newline.test(input.substring(lastEnd, tokStart)))
            raise(lastEnd, "Illegal newline after throw");
        node.argument = parseExpression(false);
        semicolon();
        return node;
    }

    function parse_TryStatement() {
        var node = new TryStatement();
        next();
        node.block = parse_BlockStatement();

        if (tokType === _catch) {
            var clause = new CatchClause();
            next();
            expect(_parenL);
            clause.param = parse_Identifier();
            if (strict && isStrictBadIdWord(clause.param.name))
                raise(tokPos, "Binding " + clause.param.name + " in strict mode");
            expect(_parenR);
            clause.body = parse_BlockStatement();
            node.handler = clause;
        }

        if(eat(_finally) === true) {
            node.finalizer = parse_BlockStatement();
        }

        if (node.handler === null && node.finalizer === null)
            raise(tokPos, "Missing catch or finally clause");

        return node;
    }

    function parseStatement_var() {
        next();
        var node = parseVar();
        semicolon();
        return node;
    }

    function parse_WhileStatement() {
        var node = new WhileStatement();
        next();
        node.test = parseParenExpression();
        labels.push(loopLabel);
        node.body = parseStatement();
        labels.pop();
        return node;
    }

    function parse_WithStatement() {
        var node = new WithStatement();
        if (strict) raise(tokStart, "'with' in strict mode");
        next();
        node.object = parseParenExpression();
        node.body = parseStatement();
        return node;
    }

    function parse_EmptyStatement() {
        var node = new EmptyStatement();
        next();
        return node;
    }

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.

    function parse_maybeLabeledStatement() {
        var starttype = tokType, i, node = null;
        var maybeName = tokVal, expr = parseExpression(false);
        if (starttype === _name && expr instanceof Identifier && eat(_colon) === true) {
            node = new LabeledStatement()
            for (var i = 0, leni = labels.length; i < leni; ++i)
                if (labels[i].name === maybeName) raise(tokPos, "Label '" + maybeName + "' is already declared");
            var label = new Label(maybeName);
            switch(tokType) {
                case _do:
                case _for:
                case _while:
                    label.kind = str_loop;
                    break;
                case _switch:
                    label.kind = str_switch;
                    break;
            }
            labels.push(label);
            node.body = parseStatement();
            labels.pop();
            node.label = expr;
        } else {
            node = new ExpressionStatement();
            node.expression = expr;
            semicolon();
        }
        return node;

    }

    function parse_ExpressionStatement() {
        var node = new ExpressionStatement();
        node.expression = parseExpression(false);
        semicolon();
        return node;
    }

    function parseStatement_default() {
        if(tokType === _name) {
            return parse_maybeLabeledStatement();
        } else {
            return parse_ExpressionStatement();
        }
    }

    function parseStatement() {

        // Most types of statements are recognized by the keyword they
        // start with. Many are trivial to parse, some require a bit of
        // complexity.

        switch (tokType) {
            case _break: return parse_BreakStatement();
            case _continue: return parse_ContinueStatement();
            case _debugger: return parse_DebuggerStatement();
            case _do: return parse_DoWhileStatement();
            case _for: return parseStatement_for();
            case _function: return parse_Function();
            case _if: return parse_IfStatement();
            case _return: return parse_ReturnStatement();
            case _switch: return parse_SwitchStatement();
            case _throw: return parse_ThrowStatement();
            case _try: return parse_TryStatement();
            case _var: return parseStatement_var();
            case _while: return parse_WhileStatement();
            case _with: return parse_WithStatement();
            case _braceL: return parse_BlockStatement();
            case _semi: return parse_EmptyStatement();

            case _slash:
                readToken_forceRegexp();

            default:
                return parseStatement_default();
        }
    }


    // Used for constructs like `switch` and `if` that insist on
    // parentheses around their expression.

    function parseParenExpression() {
        expect(_parenL);
        var val = parseExpression(false);
        expect(_parenR);
        return val;
    }

    // Parse a semicolon-enclosed block of statements, handling `"use
    // strict"` declarations when `allowStrict` is true (used for
    // function bodies).

    function parse_BlockStatement() {
        var node = new BlockStatement(), strict = false, oldStrict;
        expect(_braceL);
        if(eat(_braceR) === false) {
            for(;;) {
                var stmt = parseStatement();
                node.body.push(stmt);
                if (isUseStrict(stmt)) {
                    oldStrict = strict;
                    setStrict(strict = true);
                }
                if(eat(_braceR) === true) {break;}
            }
        }
        if (strict && !oldStrict) setStrict(false);
        return node;
    }

    // Parse a regular `for` loop. The disambiguation code in
    // `parseStatement` will already have parsed the init statement or
    // expression.

    function parse_ForStatement() {
        var node = new ForStatement();
        expect(_semi);
        if (tokType !== _semi) node.test = parseExpression(false);
        expect(_semi);
        if (tokType !== _parenR) node.update = parseExpression(false);
        expect(_parenR);
        node.body = parseStatement();
        labels.pop();
        return node;
    }

    // Parse a `for`/`in` loop.

    function parse_ForInStatement() {
        var node = new ForInStatement();
        node.right = parseExpression(false);
        expect(_parenR);
        node.body = parseStatement();
        labels.pop();
        return node;
    }

    // Parse a list of variable declarations.

    function parseVar(noIn) {
        var node = new VariableDeclaration();
        for (;;) {
            var decl = new VariableDeclarator();
            decl.id = parse_Identifier();
            if (strict && isStrictBadIdWord(decl.id.name))
                raise(tokPos, "Binding " + decl.id.name + " in strict mode");
            if(eat(_eq) === true) {
                decl.init = parseExpression_noComma(noIn);
            }
            node.declarations.push(decl);
            if (eat(_comma) === false) break;
        }
        return node;
    }

    // ### Expression parsing

    // These nest, from the most general expression type at the top to
    // 'atomic', nondivisible expression types at the bottom. Most of
    // the functions will simply let the function(s) below them parse,
    // and, *if* the syntactic construct they handle is present, wrap
    // the AST node that the inner parser gave them in another node.

    // Parse a full expression. The arguments are used to forbid comma
    // sequences (in argument lists, array literals, or object literals)
    // or the `in` operator (in for loops initalization expressions).


    function parseExpression_noComma(noIn) {
        return parseMaybeAssign(noIn);
        // if (!noComma && tokType === _comma) {
        //     var node = new SequenceExpression();
        //     node.expressions.push(expr);
        //     while (eat(_comma)) node.expressions.push(parseMaybeAssign(noIn));
        //     return node;
        // }
    }

    function parseExpression(noIn) {
        var expr = parseMaybeAssign(noIn);
        if (tokType === _comma) {
            var node = new SequenceExpression();
            node.expressions.push(expr);
            while (eat(_comma) === true) {
                node.expressions.push(parseMaybeAssign(noIn));
            }
            return node;
        }
        return expr;
    }

    // Parse an assignment expression. This includes applications of
    // operators like `+=`.

    function parseMaybeAssign(noIn) {
        var left = parseMaybeConditional(noIn);
        if (tokType.isAssign) {
            var node = new AssignmentExpression();
            node.operator = tokVal;
            node.left = left;
            next();
            node.right = parseMaybeAssign(noIn);
            checkLVal(left);
            return node;
        }
        return left;
    }

    // Parse a ternary conditional (`?:`) operator.

    function parseMaybeConditional(noIn) {
        var expr = parseExprOps(noIn);
        if (eat(_question) === true) {
            var node = new ConditionalExpression();
            node.test = expr;
            node.consequent = parseExpression_noComma(false);
            expect(_colon);
            node.alternate = parseExpression_noComma(noIn);
            return node;
        }
        return expr;
    }

    // Start the precedence parser.

    function parseExprOps(noIn) {
        return parseExprOp(parseMaybeUnary(noIn), _bin_minop, noIn);
    }

    // Parse binary operators with the operator precedence parsing
    // algorithm. `left` is the left-hand side of the operator.
    // `minPrec` provides context that allows the function to stop and
    // defer further parser to one of its callers when it encounters an
    // operator that has a lower precedence than the set it is parsing.

    function parseExprOp(left, minTokType, noIn) { // what to do about this garbage producing noIn?
        var node = null;
        var curTokType = tokType;

        if (curTokType.binop !== 0 && curTokType.binop > minTokType.binop && (!noIn || tokType !== _in)) {

            if(tokVal === LogicalOperator.AND || tokVal === LogicalOperator.OR) {
                node = new LogicalExpression();
            } else {
                node = new BinaryExpression();
            }
            node.left = left;
            node.operator = tokVal;
            next();
            node.right = parseExprOp(parseMaybeUnary(noIn), curTokType, noIn);
            return parseExprOp(node, minTokType, noIn);
        }
        return left;
    }

    // Parse unary operators, both prefix and postfix.

    function parseMaybeUnary(noIn) {
        var node = null;
        if (tokType.prefix) {
            if(tokType.isUpdate) {
                node = new UpdateExpression();
                node.operator = tokVal;
                next();
                node.argument = parseMaybeUnary(noIn);
                checkLVal(node.argument);
            } else {
                node = new UnaryExpression();
                node.operator = tokVal;
                next();
                node.argument = parseMaybeUnary(noIn);
                if (strict && node.operator === "delete" &&
                             node.argument instanceof Identifier)
                raise(tokPos, "Deleting local variable in strict mode");
            }
            return node;
        } else {
            var expr = parseExprSubscripts();
            while (tokType.postfix && cannotInsertSemicolon()) {
                node = new UpdateExpression();
                node.operator = tokVal;
                node.prefix = false;
                node.argument = expr;
                checkLVal(expr);
                next();
                expr = node;
            }
            return expr;
        }
    }

    // Parse call, dot, and `[]`-subscript expressions.

    function parseExprSubscripts() {
        return parseSubscripts(parseExprAtom());
    }

    function parseSubscripts(base) {
        var node;
        if (eat(_dot) === true) {
            node = new MemberExpression_dot(base);
            node.property = parse_Identifier_liberal();
            return parseSubscripts(node);

        } else if (eat(_bracketL) === true) {
            node = new MemberExpression_bracketL(base);
            node.property = parseExpression(false);
            expect(_bracketR);
            return parseSubscripts(node);

        } else if (eat(_parenL) === true) {
            node = new CallExpression(base);
            parse_ExpressionList(node.arguments);
            return parseSubscripts(node);

        } else return base;
    }

    function parseSubscripts_nocalls(base) {
        var node;
        if (eat(_dot) === true) {
            node = new MemberExpression_dot(base);
            node.property = parse_Identifier_liberal();
            return parseSubscripts_nocalls(node);

        } else if (eat(_bracketL) === true) {
            node = new MemberExpression_bracketL(base);
            node.property = parseExpression(false);
            expect(_bracketR);
            return parseSubscripts_nocalls(node);

        } else return base;
    }

    // Parse an atomic expression — either a single token that is an
    // expression, an expression started by a keyword like `function` or
    // `new`, or an expression wrapped in punctuation like `()`, `[]`,
    // or `{}`.

    function parse_ThisExpression() {
        var node = new ThisExpression();
        next();
        return node;
    }

    function parse_Literal_Number() {
        var node = new Literal_number();
        node.value = tokVal;
        next();
        return node;
    }

    function parse_Literal_String() {
        var node = new Literal_string();
        node.value = tokVal;
        next();
        return node;
    }

    function parse_Literal_Regexp() {
        var node = new Literal_regexp();
        node.value = tokVal;
        next();
        return node;
    }

    function parse_Literal_Null() {
        var node = new Literal_null();
        next();
        return node;
    }
    function parse_Literal_True() {
        var node = new Literal_true();
        next();
        return node;
    }
    function parse_Literal_False() {
        var node = new Literal_false();
        next();
        return node;
    }

    function parseExprAtom_parenL() {
        next();
        var val = parseExpression(false);
        expect(_parenR);
        return val;
    }
    function parse_ArrayExpression() {
        var node = new ArrayExpression();
        next();
        parse_ArrayExpressionList(node.elements);
        return node;
    }

    function parse_FunctionExpression() {
        var node = new FunctionExpression();
        next();
        return parseFunction(node);
    }

    function parseExprAtom() {
        switch (tokType) {
            case _new: return parse_NewExpression();
            case _num: return parse_Literal_Number();
            case _this: return parse_ThisExpression();
            case _name: return parse_Identifier();
            case _null: return parse_Literal_Null();
            case _true: return parse_Literal_True();
            case _false: return parse_Literal_False();
            case _braceL: return parse_ObjectExpression();
            case _string: return parse_Literal_String();
            case _regexp: return parse_Literal_Regexp();
            case _parenL: return parseExprAtom_parenL();
            case _bracketL: return parse_ArrayExpression();
            case _function: return parse_FunctionExpression();

            default:
                unexpected();
        }
    }

    // New's precedence is slightly tricky. It must allow its argument
    // to be a `[]` or dot subscript expression, but not a call — at
    // least, not without wrapping it in parentheses. Thus, it uses the

    function parse_NewExpression() {
        var node = new NewExpression();
        next();
        node.callee = parseSubscripts_nocalls(parseExprAtom(false));
        if (eat(_parenL) === true) parse_ExpressionList(node.arguments);
        return node;
    }

    // Parse an object literal.

    function parse_ObjectExpression() {
        var node = new ObjectExpression();
        var flags = 0; // SAW A GET/SET | IS A GET/SET
        next();

        if (eat(_braceR) === false) {
            for(;;) {
                var prop = new ObjectExpressionProp();
                prop.key = parsePropertyName();
                flags &= 2;
                if (eat(_colon) === true) {
                    prop.value = parseExpression_noComma(false);
                    prop.kind = PropertyKinds.init;
                } else if (options.ecmaVersion >= 5 && prop.key instanceof Identifier) {
                    if (prop.key.name === "get") {
                        flags = 3;
                        prop.kind = PropertyKinds.get;
                        prop.key = parsePropertyName();
                        if (tokType !== _parenL) unexpected();
                        prop.value = parseFunction(new FunctionExpression());
                    } else if (prop.key.name === "set") {
                        flags = 3;
                        prop.kind = PropertyKinds.set;
                        prop.key = parsePropertyName();
                        if (tokType !== _parenL) unexpected();
                        prop.value = parseFunction(new FunctionExpression());
                    } else unexpected();
                } else unexpected();

                // getters and setters are not allowed to clash — either with
                // each other or with an init property — and in strict mode,
                // init properties are also not allowed to be repeated.

                if (prop.key instanceof Identifier && (strict || (flags & 2) !== 0)) {
                    for (var i = 0, leni = node.properties.length; i < leni; ++i) {
                        var other = node.properties[i];
                        if (other.key.name === prop.key.name) {
                            var conflict = prop.kind == other.kind ||
                                                         flags & 1 && other.kind === PropertyKinds.init ||
                                                         prop.kind === PropertyKinds.init && (other.kind === PropertyKinds.get || other.kind === PropertyKinds.set);
                            if (conflict && !strict && prop.kind === PropertyKinds.init && other.kind === PropertyKinds.init) conflict = false;
                            if (conflict) raise(tokPos, "Redefinition of property");
                        }
                    }
                }

                node.properties.push(prop);

                if(eat(_braceR) === true) break;

                expect(_comma);

                if(options.allowTrailingCommas && eat(_braceR) === true) break;
            }
        }
        return node;
    }

    function parsePropertyName() {
        if (tokType === _string || tokType === _num) {
            return parseExprAtom();
        } else {
            return parse_Identifier_liberal();
        }
    }

    // Parse a function declaration or literal
    function parseFunction(node) {
        if (tokType === _name) node.id = parse_Identifier();

        expect(_parenL);

        if(eat(_parenR) === false) {
            for(;;) {
                node.params.push(parse_Identifier());
                if(eat(_parenR) === true) {break;}
                expect(_comma);
            }
        }

        // Start a new scope with regard to labels and the `inFunction`
        // flag (restore them to their old value afterwards).
        var oldInFunc = inFunction, oldLabels = labels;
        inFunction = true; labels = [];
        node.body = parse_BlockStatement(true);
        inFunction = oldInFunc; labels = oldLabels;

        // If this is a strict mode function, verify that argument names
        // are not repeated, and it does not try to bind the words `eval`
        // or `arguments`.
        if (strict || node.body.body.length && isUseStrict(node.body.body[0])) {
            for (var i = node.id ? -1 : 0, leni = node.params.length; i < leni; ++i) {
                var id = i < 0 ? node.id : node.params[i];
                if (isStrictReservedWord(id.name) || isStrictBadIdWord(id.name))
                    raise(tokPos, "Defining '" + id.name + "' in strict mode");
                if (i >= 0) for (var j = 0; j < i; ++j) if (id.name === node.params[j].name)
                    raise(tokPos, "Argument name clash in strict mode");
            }
        }

        return node;
    }

    // Parses a comma-separated list of expressions, and returns them as
    // an array. `close` is the token type that ends the list, and
    // `allowEmpty` can be turned on to allow subsequent commas with
    // nothing in between them to be parsed as `null` (which is needed
    // for array literals).

    function parse_ArrayExpressionList(list) {
        if(eat(_bracketR) === false) {
            for(;;) {
                if (tokType === _comma) {
                    list.push(null);
                } else {
                    list.push(parseExpression_noComma(false));
                }

                if(eat(_bracketR) === true) return;

                expect(_comma);

                if (options.allowTrailingCommas && eat(_bracketR) === true) return;
            }
        }
    }

    function parse_ExpressionList(list) {
        if(eat(_parenR) === false) {
            for(;;) {
                list.push(parseExpression_noComma(false));
                if(eat(_parenR) === true) {
                    return;
                } else {
                    expect(_comma);
                }
            }
        }
    }

    // Parse the next token as an identifier. If `liberal` is true (used
    // when parsing properties), it will also convert keywords into
    // identifiers.

    function parse_Identifier_liberal() {
        var node = new Identifier();
        node.name = tokType === _name ? tokVal : (!options.forbidReserved && tokType.keyword) || unexpected();
        next();
        return node;
    }

    function parse_Identifier() {
        var node = new Identifier();
        if(tokType === _name) {
            node.name = tokVal;
        } else {
            unexpected();
        }
        next();
        return node;
    }
})(typeof exports === "undefined" ? (self.overture = {}) : exports);

