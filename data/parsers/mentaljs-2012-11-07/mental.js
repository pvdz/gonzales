(function(exports){
		var rules = {		
			ArrayComma:createRule('NewExpressions,Expression,Postfix'),
			ArrayOpen:createRule('Statements,Operators,NewExpressions,Prefix'),		
			ArrayClose:createRule('ArrayComma,ArrayOpen,Expression,Postfix'),		
			AccessorOpen: createRule('Expression'),		
			AccessorClose: createRule('Expression,Postfix'),
			Addition:createRule('Expression'),
			AdditionAssignment:createRule('Expression'),		
			AssignmentDivide:createRule('Expression'),
			AndAssignment:createRule('Expression'),
			BlockStatementCurlyOpen:createRule('Statements,SwitchColon'),
			BlockStatementCurlyClose:createRule('Statements,Expression,BlockStatementCurlyOpen,Postfix,Break,Continue'),										
			BitwiseNot:createRule('Prefix,Statements,NewExpressions,Operators'),
			BitwiseOr:createRule('Expression,Postfix'),
			BitwiseAnd:createRule('Expression,Postfix'),		
			Break:createRule('Statements'),
			Case: createRule('SwitchStatementCurlyOpen,EndStatement,SwitchColon'),		
			Default:createRule('SwitchStatementCurlyOpen,EndStatement,SwitchColon'),
			Debugger:createRule('Statements'),
			Delete:createRule('Statements,NewExpressions,Operators'),
			Do:createRule('Statements,SwitchColon'),	
			DoStatementCurlyOpen:createRule('Do'),
			DoStatementCurlyClose:createRule('Statements,Expression,DoStatementCurlyOpen,Postfix,Break,Continue'),
			DivideOperator:createRule('Expression'),
			CatchStatement:createRule('TryStatementCurlyClose'),
			CatchStatementParenOpen:createRule('CatchStatement'),
			CatchStatementParenClose:createRule('CatchStatementIdentifier'),
			CatchStatementIdentifier:createRule('CatchStatementParenOpen'),
			CatchStatementCurlyOpen:createRule('CatchStatementParenClose'),
			CatchStatementCurlyClose:createRule('Statements,Expression,CatchStatementCurlyOpen,Postfix,Break,Continue'),	
			Comma:createRule('Expression,Postfix'),
			Continue:createRule('Statements'),										
			EqualAssignment:createRule('Expression'),
			Equal:createRule('Expression,Postfix'),					
			Else:createRule('IfStatementCurlyClose,Statements'),
			ElseCurlyOpen:createRule('Else'),
			ElseCurlyClose:createRule('Statements,Expression,ElseCurlyOpen,Postfix,Break,Continue'),
			EndStatement:createRule('Statements,Expression,Postfix,Continue,Break,Return,SwitchColon,ForStatementParenClose,IfStatementParenClose,WithStatementParenClose,WhileStatementParenClose'),		
			False:createRule('Statements,Operators,Prefix,NewExpressions'),
			FinallyStatement:createRule('CatchStatementCurlyClose,TryStatementCurlyClose'),
			FinallyStatementCurlyOpen:createRule('FinallyStatement'),
			FinallyStatementCurlyClose:createRule('Statements,Expression,FinallyStatementCurlyOpen,Postfix,Break,Continue'),
			ForStatement:createRule('Statements,SwitchColon'),
			ForStatementParenOpen:createRule('ForStatement'),
			ForStatementParenClose:createRule('ForSemi,Expression,Postfix,Break,Continue'),
			ForStatementCurlyOpen:createRule('ForStatementParenClose'),
			ForStatementCurlyClose:createRule('Statements,Expression,ForStatementCurlyOpen,Postfix,Break,Continue'),
			ForSemi:createRule('ForSemi,Expression,Postfix,ForStatementParenOpen'),
			FunctionCallOpen:createRule('Identifier,FunctionExpressionCurlyClose,ParenExpressionClose,AccessorClose,FunctionCallClose,This'),
			FunctionCallClose:createRule('Expression,FunctionCallOpen,Postfix'),
			FunctionArgumentIdentifier: createRule('FunctionParenOpen,FunctionArgumentComma'),
			FunctionArgumentComma: createRule('FunctionArgumentIdentifier'),
			FunctionIdentifier: createRule('FunctionStatement'),					
			FunctionParenOpen: createRule('FunctionIdentifier'),
			FunctionExpression: createRule('Operators,Prefix,NewExpressions'),
			FunctionExpressionIdentifier:createRule('FunctionExpression'),
			FunctionExpressionParenOpen:createRule('FunctionExpression,FunctionExpressionIdentifier'),
			FunctionExpressionArgumentIdentifier:createRule('FunctionExpressionParenOpen,FunctionExpressionArgumentComma'),		
			FunctionExpressionArgumentComma:createRule('FunctionExpressionArgumentIdentifier'),
			FunctionParenClose: createRule('FunctionStatementCurlyOpen,FunctionParenOpen,FunctionArgumentIdentifier'),
			FunctionExpressionParenClose: createRule('FunctionExpressionArgumentIdentifier,FunctionExpressionParenOpen'),
			FunctionExpressionCurlyOpen:createRule('FunctionExpressionParenClose'),
			FunctionStatement:createRule('Statements,SwitchColon'),
			FunctionStatementCurlyOpen: createRule('FunctionParenClose'),										
			FunctionStatementCurlyClose:createRule('Statements,Expression,FunctionStatementCurlyOpen,Postfix,Break,Continue'),
			FunctionExpressionCurlyClose:createRule('Statements,Expression,FunctionExpressionCurlyOpen,Postfix,Break,Continue'),
			GreaterThan:createRule('Expression,Postfix'),
			GreaterThanEqual:createRule('Expression,Postfix'),
			IdentifierDot:createRule('Expression'),
			Identifier: createRule('Statements,Operators,Prefix,NewExpressions,IdentifierDot'),
			IfStatement:createRule('Statements,SwitchColon'),
			IfStatementParenOpen:createRule('IfStatement'),
			IfStatementParenClose:createRule('Expression,Postfix'),
			IfStatementCurlyOpen:createRule('IfStatementParenClose'),
			IfStatementCurlyClose:createRule('Statements,Expression,IfStatementCurlyOpen,Postfix,Break,Continue'),
			In:createRule('Expression'),
			'Infinity':createRule('Statements,Operators,Prefix,NewExpressions'),
			InstanceOf:createRule('Expression'),
			LabelColon:createRule('Expression'),
			LessThan:createRule('Expression,Postfix'),
			LessThanEqual:createRule('Expression,Postfix'),
			LeftShift:createRule('Expression,Postfix'),
			LeftShiftAssignment:createRule('Expression'),
			LogicalOr:createRule('Expression,Postfix'),
			LogicalAnd:createRule('Expression,Postfix'),
			'NaN':createRule('Statements,Operators,Prefix,NewExpressions'),
			New: createRule('Statements,Operators,Prefix,NewExpressions'),		
			Number: createRule('Statements,Operators,NewExpressions,Prefix'),
			Null: createRule('Statements,Operators,NewExpressions,Prefix'),
			NotEqual:createRule('Expression,Postfix'),					
			Not:createRule('Prefix,Statements,NewExpressions,Operators'),
			Minus:createRule('Expression,Postfix'),
			MinusAssignment:createRule('Expression'),
			Modulus:createRule('Expression,Postfix'),
			ModulusAssignment:createRule('Expression'),																		
			Multiply:createRule('Expression,Postfix'),
			MultiplyAssignment:createRule('Expression'),
			ObjectLiteralCurlyOpen:createRule('NewExpressions,Operators,Prefix'),
			ObjectLiteralCurlyClose: createRule('Statements,Expression,ObjectLiteralCurlyOpen,Postfix'),
			ObjectLiteralIdentifier: createRule('ObjectLiteralCurlyOpen,ObjectLiteralComma'),
			ObjectLiteralColon: createRule('ObjectLiteralIdentifier,ObjectLiteralIdentifierNumber,ObjectLiteralIdentifierString'),
			ObjectLiteralComma: createRule('Expression,Postfix'),
			ObjectLiteralIdentifierNumber:createRule('ObjectLiteralCurlyOpen,ObjectLiteralComma'),
			ObjectLiteralIdentifierString:createRule('ObjectLiteralCurlyOpen,ObjectLiteralComma'),
			OrAssignment:createRule('Expression'),
			ParenExpressionOpen:createRule('Statements,NewExpressions,Operators,Prefix'),
			ParenExpressionComma:createRule('Expression'),
			ParenExpressionClose:createRule('Expression,Postfix'),
			PostfixIncrement:createRule('Expression'),
			PostfixDeincrement:createRule('Expression'),
			PrefixDeincrement:createRule('Statements,NewExpressions,Operators,Prefix'),
			PrefixIncrement:createRule('Statements,NewExpressions,Operators,Prefix'),
			Return:createRule('Statements,SwitchColon'),
			RegExp:createRule('Statements,Operators,NewExpressions,Prefix'),
			RightShift:createRule('Expression,Postfix'),
			RightShiftAssignment:createRule('Expression'),
			String:createRule('Statements,Operators,NewExpressions,Prefix'),											
			StrictEqual:createRule('Expression,Postfix'),
			StrictNotEqual:createRule('Expression,Postfix'),
			SwitchStatement:createRule('Statements,SwitchColon'),
			SwitchStatementParenOpen:createRule('SwitchStatement'),
			SwitchStatementParenClose:createRule('Expression'),
			SwitchStatementCurlyOpen:createRule('SwitchStatementParenClose'),
			SwitchStatementCurlyClose:createRule('SwitchStatementCurlyOpen,Expression,Statements,Postfix,Break,Continue'),
			SwitchColon:createRule('Expression,Default'),					
			This:createRule('Statements,Operators,NewExpressions,Prefix'),
			TernaryQuestionMark:createRule('Expression,Postfix'),
			TernaryColon:createRule('Expression,Postfix'),
			TryStatement:createRule('Statements,SwitchColon'),
			TryStatementCurlyOpen:createRule('TryStatement'),
			TryStatementCurlyClose:createRule('TryStatementCurlyOpen,Expression,Statements,Postfix,Break,Continue'),
			True:createRule('Statements,Operators,Prefix,NewExpressions'),
			Throw:createRule('Statements,NewExpressions'),
			TypeOf:createRule('Statements,NewExpressions,Operators'),
			UnaryPlus:createRule('Prefix,Statements,NewExpressions,Operators'),
			UnaryMinus:createRule('Prefix,Statements,NewExpressions,Operators'),
			Undefined:createRule('Statements,Operators,Prefix,NewExpressions'),
			Var:createRule('Statements,NewExpressions'),
			VarIdentifier:createRule('Var,VarComma'),
			VarComma:createRule('Expression,Postfix'),
			Void:createRule('Statements,NewExpressions,Operators'),
			WithStatement:createRule('Statements,SwitchColon'),
			WithStatementParenOpen:createRule('WithStatement'),
			WithStatementParenClose:createRule('Expression,Postfix'),
			WithStatementCurlyOpen:createRule('WithStatementParenClose'),
			WithStatementCurlyClose:createRule('WithStatementCurlyOpen,Expression,Statements,Postfix,Break,Continue'),
			WhileStatement:createRule('Statements,DoStatementCurlyClose,SwitchColon'),
			WhileStatementParenOpen:createRule('WhileStatement'),
			WhileStatementParenClose:createRule('Expression,Postfix'),
			WhileStatementCurlyOpen:createRule('WhileStatementParenClose'),
			WhileStatementCurlyClose:createRule('WhileStatementCurlyOpen,Expression,Statements,Postfix,Break,Continue'),
			Xor:createRule('Expression,Postfix'),
			XorAssignment:createRule('Expression'),		
			ZeroRightShift:createRule('Expression,Postfix'),
			ZeroRightShiftAssignment:createRule('Expression'),										
	};
	function createRule(rules) {
		rules = rules.split(',');
		var expression = {
			ArrayClose:1,AccessorClose:1,False:1,FunctionCallClose:1,FunctionExpressionCurlyClose:1,Identifier:1,'Infinity':1,
			'NaN':1,Number:1,Null:1,ObjectLiteralCurlyClose:1,ParenExpressionClose:1,RegExp:1,String:1,This:1,True:1,Undefined:1,
			VarIdentifier:1
		},
		prefix = {
			Not:1,BitwiseNot:1,UnaryMinus:1,UnaryPlus:1,PrefixDeincrement:1,PrefixIncrement:1
		},
		postfix = {
			PostfixIncrement:1,PostfixDeincrement:1
		},
		operators = {
			In:1,InstanceOf:1,
			Addition:1,DivideOperator:1,Equal:1,NotEqual:1,StrictEqual:1,StrictNotEqual:1,
			LogicalOr:1,BitwiseOr:1,Xor:1,Modulus:1,LogicalAnd:1,BitwiseAnd:1,ZeroRightShift:1,
			RightShift:1,GreaterThan:1,GreaterThanEqual:1,LeftShift:1,LessThan:1,LessThanEqual:1,
			Multiply:1,Minus:1,EqualAssignment:1,AdditionAssignment:1,OrAssignment:1,XorAssignment:1,ModulusAssignment:1,AndAssignment:1,
			ZeroRightShiftAssignment:1,RightShiftAssignment:1,LeftShiftAssignment:1,MultiplyAssignment:1,MinusAssignment:1,
			AssignmentDivide:1
		},			
		statements = {
			Nothing:1,EndStatement:1,BlockStatementCurlyClose:1,DoStatementCurlyClose:1,CatchStatementCurlyClose:1,
			ElseCurlyClose:1,FinallyStatementCurlyClose:1,FunctionStatementCurlyClose:1,IfStatementCurlyClose:1,
			SwitchStatementCurlyClose:1,TryStatementCurlyClose:1,WithStatementCurlyClose:1,WhileStatementCurlyClose:1,
			BlockStatementCurlyOpen:1,DoStatementCurlyOpen:1,CatchStatementCurlyOpen:1,
			ElseCurlyOpen:1,FinallyStatementCurlyOpen:1,FunctionStatementCurlyOpen:1,IfStatementCurlyOpen:1,
			SwitchStatementCurlyOpen:1,TryStatementCurlyOpen:1,WithStatementCurlyOpen:1,WhileStatementCurlyOpen:1,
			FunctionExpressionCurlyOpen:1,ForStatementCurlyOpen:1,ForStatementCurlyClose:1,
			ElseParenClose:1,IfStatementParenClose:1,SwitchStatementParenClose:1,WithStatementParenClose:1,
			WhileStatementParenClose:1,ForStatementParenClose:1,LabelColon:1,Return:1,Else:1,SwitchColon:1,Do:1
		},
		newExpressions = {
			Comma:1, ArrayComma:1,VarComma:1,ForStatementParenOpen:1,IfStatementParenOpen:1,SwitchStatementParenOpen:1,
			WithStatementParenOpen:1,WhileStatementParenOpen:1,FunctionCallOpen:1,ParenExpressionOpen:1,
			ArrayOpen:1,AccessorOpen:1,Case:1,Return:1,New:1,TypeOf:1,Delete:1,Void:1,ObjectLiteralColon:1,
			TernaryQuestionMark:1,TernaryColon:1,ForSemi:1,Continue:1,Break:1,Throw:1
		},	 
		obj = {}, i, k;		
		for(i=0;i<rules.length;i++) {
			if(rules[i] === 'Expression') {
				for(k in expression) {
					if(expression.hasOwnProperty(k)) {
						obj[k] = 1;
					}
				}
			} else if(rules[i] === 'Operators') {
				for(k in operators) {
					if(operators.hasOwnProperty(k)) {
						obj[k] = 1;
					}
				}			
			} else if(rules[i] === 'Prefix') {
				for(k in prefix) {
					if(prefix.hasOwnProperty(k)) {
						obj[k] = 1;
					}
				}
			} else if(rules[i] === 'Postfix') {
				for(k in postfix) {
					if(postfix.hasOwnProperty(k)) {
						obj[k] = 1;
					}
				}
			} else if(rules[i] === 'Statements') {
				for(k in statements) {
					if(statements.hasOwnProperty(k)) {
						obj[k] = 1;
					}
				}
			} else if(rules[i] === 'NewExpressions') {
				for(k in newExpressions) {
					if(newExpressions.hasOwnProperty(k)) {
						obj[k] = 1;
					}
				}
			} else {
				obj[rules[i]] = 1;
			}
		}
		return Object.create(obj);		
	};	
	  
    var MentalJS = exports.MentalJS = function() {
        function Mental() {
            this.parse = function(obj) {
                
                if(!Object.defineProperty) {
                    error("MentalJS requires ES5. Please upgrade your browser.");
                }
                            
                var parseTreeOutput = '', converted, result, that = this,                                         
                	pos = 0, chr, output = '', left = 0, lastState, scoping = '$', lastParseChr, parseResult,  lastChr = '', states = [],
                    functionKeyword = false, result, replaceScoping = new RegExp('['+scoping+']'),
                    allowedProperties = /^(?:length|prototype)$/, expressions = [], currentExpression,
                    functionParenOpen = false,                                         
                    attributeWhitelist = /^(?:alt|title)$/i,                           
                    setTimeoutIDS = {},
                    setIntervalIDS = {},            
                    lookups = {
                                    '[':{
                                            end:']',
                                            states:[],
                                            positions:[]                                                                                                                                                                            
                                    },
                                    '{':{
                                            end:'}',
                                            states:[],
                                            positions:[]                                                                                         
                                    },
                                    '(':{
                                            end:')',
                                            states:[],
                                            positions:[]
                                    }                                                                                       
                    };                                                      
                    function error(str) {
                        var e = Error();                                                                                       
                        throw {
                            msg: str+(e.stack?' - '+e.stack:''),
                            pos: pos,
                            chr: typeof chr == 'undefined' ? '(end)' : chr,
                            state: parseTreeOutput,
                            text: code.slice(pos-10, pos+10),
                            code: this.code
                        }           
                    };
                    
                    function execute(code) {
                    var result, hiddenProperties,
                        M = {
                            O: function(obj) {
                                var keys = Object.keys(obj);
                                for(var key in obj) {
                                    if(!/^[$].+[$]$/.test(key)) {
                                        continue;
                                    }
                                    if(/^[$](?:toString|valueOf|constructor|hasOwnProperty)[$]$/.test(key)) {
                                        Object.defineProperty(obj,key.replace(new RegExp('^'+replaceScoping.source,'i'),'').replace(new RegExp(replaceScoping.source+'$','i'),''), {enumerable: false});
                                        Object.defineProperty(obj,key,{value:obj[key],enumerable: false, writable: false, configurable: true});
                                    } else {
                                        Object.defineProperty(obj,key.replace(new RegExp('^'+replaceScoping.source,'i'),'').replace(new RegExp(replaceScoping.source+'$','i'),''), {enumerable: true});
                                        Object.defineProperty(obj,key,{value:obj[key],enumerable: false});
                                    }                                                                                                                       
                                }
                                return obj;
                            },
                            P: function() {                               
                                    var exp = arguments[arguments.length-1];                                                                                                                                    
                                    if(typeof exp == 'undefined') {
                                       return null;
                                    }                        
                                    if((/[^\d]/.test(exp) || exp === '') && !allowedProperties.test(exp)) {                                                        
                                        return scoping + exp + scoping;
                                    } else {                                    
                                        return +exp;
                                    }
                            },
                            A: function(args) {
                                var args = [].slice.call(args,0);
                                args.$callee$=arguments.callee.caller;
                                return args;
                            }                
                        };
                        function createSandboxedNode(node) {
                            Object.defineProperties(node, {
                                '$innerText$': {configurable:true, get:function(){return this.innerText;},set:function(innerText){this.innerText = innerText;}},
                                '$innerHTML$': {configurable:true, get:function(){return this.innerHTML}, set:function(innerHTML){
                                    var doc, elements, element, i, j, tags;
                                    doc = document.implementation.createHTMLDocument('');
                                    doc.body.innerHTML = innerHTML;                                    
                                    tags = doc.body.getElementsByTagName('*');                                    
                                    for(i = 0; i < tags.length;i++) {
                                        element = tags[i];                                        
                                        for(j=0;j<element.attributes.length;j++) {
                                            if(attributeWhitelist.test(element.attributes[j].name)) {
                                                continue;
                                            }                                            
                                            element.setAttribute(element.attributes[j].name, '');
                                            element[element.attributes[j].name] =  '';                                                                                                                                    
                                        }                                        
                                        element.appendChild(document.createTextNode(' '));
                                    }                                                                                                            
                                    this.innerHTML = doc.body.innerHTML; 
                                 }},
                                '$textContent$': {configurable:true, get:function(){return this.textContent;},set:function(textContent){this.textContent = textContent;}},
                                '$style$': {configurable:true, get:function(){ 
                                        var style = this.style;
                                        Object.defineProperties(style,{ 
                                            '$color$' : {configurable:true, get:function(){return style.color;}, set:function(color){style.color = color;}},
                                            '$backgroundColor$' : {configurable:true, get:function(){return style.backgroundColor;}, set:function(backgroundColor){style.backgroundColor = backgroundColor;}}  
                                        });
                                        return style;
                                    }
                                 },
                                '$appendChild$': {configurable:true, writable:false, value:function(){return this.appendChild.apply(this, arguments);}},
                                '$firstChild$': {configurable:true, get:function(){return this.firstChild}},
                                '$lastChild$': {configurable:true, get:function(){return this.lastChild}},
                                '$nextSibling$': {configurable:true, get:function(){return this.nextSibling}},
                                '$parentNode$': {configurable:true, get:function(){return this.parentNode}},
                                '$insertBefore$': {configurable:true, writable:false, value:function(){return this.insertBefore.apply(this, arguments);}},
                                '$insertAfter$': {configurable:true, writable:false, value:function(){return this.insertAfter.apply(this, arguments);}},
                                '$cloneNode$': {configurable:true, writable:false, value:function(){return this.cloneNode.apply(this, arguments);}},
                                '$removeChild$': {configurable:true, writable:false, value:function(){return this.removeChild.apply(this, arguments);}},
                                '$getAttribute$': {configurable:true, writable:false, value:function(name){if(attributeWhitelist.test(name)){return this.getAttribute(name)}}},
                                '$setAttribute$': {configurable:true, writable:false, value:function(name, value){if(attributeWhitelist.test(name)){return this.setAttribute(name, value+'')}}},
                                '$getElementsByTagName$': {configurable:true, writable:false, value:function(){return this.getElementsByTagName.apply(this, arguments);}}                               
                            });
                            return node;
                        };                        
                        function objWhitelist(obj, list, noprototype) {             
                            list = list.split(',');
                            for(var i=0;i<list.length;i++) {
                                var prop = list[i];
                                if(noprototype) {
                                    Object.defineProperty(obj,scoping+prop+scoping, {value:obj[prop], configurable:true, enumerable:false, writable: false});                               
                                } else {                                     
                                    Object.defineProperty(obj.prototype,scoping+prop+scoping, {configurable:true, enumerable:false, value:(function(obj, prop){ 
                                    function func() {
                                        if(!this[prop]) {
                                            return false;
                                        }                                                                  
                                        var that = this, args = arguments;                      
                                        return that[prop].apply(that, args);
                                        
                                    }
                                    func.valueOf = function() {
                                        return 'function '+prop+'() {\n [jsreg code] \n}';
                                    }
                                    return func;
                                })(obj, prop)});                                                                                       
                                }
                            }
                            return obj;
                        };
                        function constWhitelist(obj, list, transObj) {
                            list = list.split(',');
                            for(var i=0;i<list.length;i++) {
                                var prop = list[i];  
                                if(transObj) {                              
                                    Object.defineProperty(transObj,scoping+prop+scoping, {value:obj[prop], configurable:true, enumerable:false, writable: false});
                                } else {
                                    Object.defineProperty(obj,scoping+prop+scoping, {value:obj[prop], configurable:true, enumerable:false, writable: false});                               
                                }
                            }           
                        }; 
                        
                        
                        function FUNCTION(){                                                                                                                                                                                 
                            var converted = Function.apply(exports, arguments) + '',                                             
                                js = MentalJS();                                                                   
                            if(typeof str != 'function') {                           
                                converted = eval(js.parse({options:{eval:false},code:'('+converted+')'}));                                                                                                                                                                   
                            } else {
                                converted = eval(converted)
                            }
                            if(that.functionCode) {
                                that.functionCode(converted);
                            }
                            return converted;        
                        };
                        FUNCTION.$constructor$ = FUNCTION;                                                                                                                                          
                        $Function$ = FUNCTION;                                                                                                                                                        
                        Boolean.$constructor$ = $Function$;
                        Boolean.prototype.$constructor$ = Boolean;                                       
                        $Boolean$ = Boolean;                                                            
                        Function.prototype.$constructor$ = $Function$;
                        objWhitelist(Function, 'call,apply');                                                            
                        objWhitelist(String,'charAt,charCodeAt,concat,indexOf,lastIndexOf,localeCompare,match,replace,search,slice,split,substr,substring,toLocaleLowerCase,toLocaleString,toLocaleUpperCase,toLowerCase,toUpperCase');
                        String = objWhitelist(String, 'fromCharCode', true);
                        String.prototype.$constructor$ = String;
                        String.$constructor$ = $Function$;                                                            
                        $String$ = String;
                                                                                                          
                        objWhitelist(Array,'sort,join,pop,push,reverse,shift,slice,splice,unshift,concat');                                                                                                                                     
                        Array.prototype.$constructor$ = Array;
                        Array.$constructor$ = $Function$;                                                                                     
                        $Array$ = Array;                                                             
                        objWhitelist(RegExp,'compile,exec,test');                    
                        RegExp.prototype.$constructor$ = RegExp;
                        Object.defineProperty(RegExp.prototype, '$source$', {configurable:true, get:function(){return this.source}});                        
                        RegExp.$lastMatch$ = RegExp.lastMatch;                    
                        RegExp.$lastParen$ = RegExp.lastParen;                    
                        RegExp.$leftContext$ = RegExp.leftContext;                                                            
                        RegExp.$constructor$ = $Function$;    
                        $RegExp$ = RegExp;                     
                        objWhitelist(Number,'toExponential,toFixed,toPrecision');                    
                        constWhitelist(Number, 'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY');                                                          
                        Number.$constructor$ = $Function$;
                        Number.prototype.$constructor$ = Number;
                        $Number$ = Number;                                                         
                        objWhitelist(Date,'getDate,getDay,getFullYear,getHours,getMilliseconds,getMinutes,getMonth,getSeconds,getTime,getTimezoneOffset,getUTCDate,getUTCDay,getUTCFullYear,getUTCHours,getUTCMilliseconds,getUTCMinutes,getUTCMonth,getUTCSeconds,getYear,setDate,setFullYear,setHours,setMilliseconds,setMinutes,setMonth,setSeconds,setTime,setUTCDate,setUTCFullYear,setUTCHours,setUTCMilliseconds,setUTCMinutes,setUTCMonth,setUTCSeconds,setYear,toDateString,toGMTString,toLocaleDateString,toLocaleString,toLocaleTimeString,toTimeString,toUTCString');                    
                        Date.prototype.$constructor$ = Date;
                        Date.$constructor$ = $Function$;                    
                        $Date$ = Date;                         
                        objWhitelist(Math,'abs,acos,asin,atan,atan2,ceil,cos,exp,floor,log,max,min,pow,random,round,sin,sqrt,tan', true);
                        constWhitelist(Math, 'E,LN10,LN2,LOG10E,LOG2E,PI,SQRT1_2,SQRT2');                                                                                                                                          
                        Math.$constructor$ = Object;
                        $Math$ = Math;                    
                        constWhitelist(exports,'decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,escape,isFinite,isNaN,parseFloat,parseInt,unescape', exports);
                        function CLEAR_INTERVAL(id){                
                            id = +id;
                            if (typeof setIntervalIDS[id] == 'undefined') {
                                return null;
                            }
                            return clearInterval(id);
                        };                    
                        $clearInterval$ = CLEAR_INTERVAL;                      
                        var CLEAR_TIMEOUT = function(id){               
                            id = +id;
                            if (typeof setTimeoutIDS[id] == 'undefined') {
                                return null;
                            }
                            return clearTimeout(id);
                        };                    
                        $clearTimeout$ = CLEAR_TIMEOUT;                                        
                        var SET_TIMEOUT = function(func, time){             
                            time = +time;                
                            if (typeof func !== 'function') {
                                func = $Function$(func);
                            }
                            var id = +setTimeout(func, time);
                            setTimeoutIDS[id] = true;
                            return id;                
                        };                     
                        $setTimeout$ = SET_TIMEOUT;                                          
                        var SET_INTERVAL = function(func, time){                
                            time = +time;                
                            if (typeof func !== 'function') {
                                func = $Function$(func);
                            }
                            var id = +setInterval(func, time);
                            setIntervalIDS[id] = true;
                            return id;                
                        };                    
                        $setInterval$ = SET_INTERVAL;                                         
                        var ALERT = function(str) {             
                            alert(str);
                        };                      
                        $alert$ = ALERT;                    
                        var EVAL = function(str) {                      
                            var js = MentalJS(), converted;                                            
                            if(typeof str != 'function') {                           
                                return eval(js.parse({options:{eval:false},code:str, converted: function(converted){
                                    if(that.evalCode) {
                                        that.evalCode(converted);
                                    }
                                }}));                                                                                                                                                                  
                            } else {
                                if(that.evalCode) {
                                    that.evalCode(str);
                                }
                                return eval(str)
                            }                                                                                   
                        };                   
                        $eval$ = EVAL;                                
                        Object.$constructor$ = $Function$;                                        
                        Object.prototype.$constructor$ = Object;                    
                        Object.prototype.$hasOwnProperty$ = Object.prototype.hasOwnProperty;
                        objWhitelist(Object, 'valueOf');
                        objWhitelist(Object, 'toString');                                                                                                                                                                   
                        $Object$ = Object;                         
                        if(that.global) {                              
                            Object.defineProperties(this, {
                               '$document$': {configurable: true, writable: false, value: document},
                               '$Object$': {configurable: true, writable: false, value: Object},
                               '$eval$': {configurable: true, writable: false, value: EVAL},
                               '$alert$': {configurable: true, writable: false, value: ALERT},
                               '$setInterval$': {configurable: true, writable: false, value: SET_INTERVAL},
                               '$setTimeout$': {configurable: true, writable: false, value: SET_TIMEOUT},
                               '$clearInterval$': {configurable: true, writable: false, value: CLEAR_INTERVAL},
                               '$clearTimeout$': {configurable: true, writable: false, value: CLEAR_TIMEOUT},
                               '$Math$': {configurable: true, writable: false, value: Math},
                               '$Date$': {configurable: true, writable: false, value: Date},
                               '$Number$': {configurable: true, writable: false, value: Number},
                               '$RegExp$': {configurable: true, writable: false, value: RegExp},
                               '$Array$': {configurable: true, writable: false, value: Array},
                               '$String$': {configurable: true, writable: false, value: String},
                               '$Boolean$': {configurable: true, writable: false, value: Boolean},
                               '$Function$': {configurable: true, writable: false, value: FUNCTION},
                               '$decodeURI$': {configurable: true, writable: false, value: decodeURI},
                               '$decodeURIComponent$': {configurable: true, writable: false, value: decodeURIComponent},
                               '$encodeURI$': {configurable: true, writable: false, value: encodeURI},
                               '$encodeURIComponent$': {configurable: true, writable: false, value: encodeURIComponent},
                               '$escape$': {configurable: true, writable: false, value: escape},
                               '$isFinite$': {configurable: true, writable: false, value: isFinite},
                               '$isNaN$': {configurable: true, writable: false, value: isNaN},
                               '$parseFloat$': {configurable: true, writable: false, value: parseFloat},
                               '$parseInt$': {configurable: true, writable: false, value: parseInt},
                               '$unescape$': {configurable: true, writable: false, value: unescape},                               
                               '$location$': {configurable: true, writable: false, value: {}},
                               '$navigator$': {configurable: true, writable: false, value: {}},
                               '$removeEventListener$': {configurable: true, writable: false, value: function(){ return exports.removeEventListener.apply(document, arguments); }},
                               '$addEventListener$': {configurable: true, writable: false, value: function(){
                                        if(typeof arguments[1] != 'function') {
                                            var js = Mental(),
                                                converted = Function.apply(exports, arguments) + '',                                             
                                            js = MentalJS();                                                                                                                                    
                                            converted = eval(js.parse({options:{eval:false},code:'('+converted+')'}));    
                                            arguments[1] = converted;
                                        }
                                        return exports.addEventListener.apply(exports, arguments);
                                    }
                                 }                                 
                            });
                            
                            Object.defineProperties(this.$location$, {
                                'toString': {configurable: true, value:function(){ return 'http://sandboxed'; }},
                                'valueOf': {configurable: true, value:function(){ return 'http://sandboxed'; }},
                                '$href$': {configurable: true, get:function(){return 'http://sandboxed'}},
                                '$replace$': {configurable: true, get:function(){return function(){}}},
                                '$reload$': {configurable: true, get:function(){return function(){}}},
                                '$assign$': {configurable: true, get:function(){return function(){}}},
                                '$constructor$': {configurable: true, get:function(){return location}},
                                '$hash$': {configurable: true, set:function(hash){ location.hash=hash;},get:function(){return location.hash}},
                                '$host$': {configurable: true, get:function(){return 'sandboxed'}},
                                '$hostname$': {configurable: true, get:function(){return 'sandboxed'}},
                                '$pathname$': {configurable: true, get:function(){return '/'}},
                                '$port$': {configurable: true, get:function(){return ''}},
                                '$protocol$': {configurable: true, get:function(){return 'http:'}},
                                '$search$': {configurable: true, get:function(){return ''}}
                            });
                             Object.defineProperties(this.$navigator$, {                                
                                '$appCodeName$': {configurable: true, get:function(){return navigator.appCodeName}},
                                '$appName$': {configurable: true, get:function(){return navigator.appName}},
                                '$appVersion$': {configurable: true, get:function(){return navigator.appVersion}},
                                '$language$': {configurable: true, get:function(){return navigator.language}},
                                '$onLine$': {configurable: true, get:function(){return navigator.onLine}},
                                '$oscpu$': {configurable: true, get:function(){return navigator.oscpu}},
                                '$platform$': {configurable: true, get:function(){return navigator.platform}},
                                '$product$': {configurable: true, get:function(){return navigator.product}},
                                '$productSub$': {configurable: true, get:function(){return navigator.productSub}},
                                '$userAgent$': {configurable: true, get:function(){return navigator.userAgent}},
                                '$vendor$': {configurable: true, get:function(){return navigator.vendor}},
                                '$vendorSub$': {configurable: true, get:function(){return navigator.vendorSub}},                                
                            }); 
                            Object.defineProperties(document.documentElement, {
                                '$contains$': {enumerable:false,configurable: true, writable: false, value: function(){return document.documentElement.contains.apply(document.documentElement, arguments)}},
                                '$compareDocumentPosition$': {enumerable:false,configurable: true, writable: false, value: function(){return document.documentElement.compareDocumentPosition.apply(document.documentElement, arguments)}},
                            });  
                            
                            createSandboxedNode(Element.prototype); 
                            createSandboxedNode(DocumentFragment.prototype);                            
                            
                            Object.defineProperties(HTMLScriptElement.prototype, {
                                '$innerText$': {configurable:true, get:function(){return this.innerText;},set:function(innerText){ var js = MentalJS();this.innerText = js.parse({options:{eval:false},code:innerText+''});}},
                                '$textContent$': {configurable:true, get:function(){return this.textContent;},set:function(textContent){ var js = MentalJS();this.textContent = js.parse({options:{eval:false},code:textContent+''});}},
                                '$text$': {configurable:true, get:function(){return this.text;},set:function(text){ var js = MentalJS();this.text = js.parse({options:{eval:false},code:text+''});}},
                                '$appendChild$': {configurable:true, writable:false, value:function(){var js = MentalJS();return this.appendChild(document.createTextNode(js.parse({options:{eval:false},code:arguments[0].nodeValue+''})));}},
                            });                                                         
                                                                              
                            Object.defineProperties(document, {
                                '$compatMode$': {enumerable:false, configurable: true, writable: false, value: document.compatMode},
                                '$head$': {enumerable:false, configurable: true, writable: false, value: document.head},
                                '$defaultView$': {enumerable:false, configurable: true, writable: false, value: exports},
                                '$documentElement$': {enumerable:false, configurable: true, writable: false, value: document.documentElement},                                
                                '$readyState$': {enumerable:false,configurable: true, writable: false, value: document.readyState}, 
                                '$body$': {enumerable:false,configurable: true, writable: false, value: document.body},                                
                                '$createTextNode$': {enumerable:false,configurable: true, writable: false, value: function(){return document.createTextNode.apply(document, arguments)}},
                                '$createComment$': {enumerable:false,configurable: true, writable: false, value: function(){return document.createComment.apply(document, arguments)}},                                
                                '$createDocumentFragment$': {enumerable:false,configurable: true, writable: false, value: document.createDocumentFragment},
                                '$getElementById$': {enumerable:false,configurable: true, writable: false, value: function(){return document.getElementById.apply(document, arguments)}},
                                '$getElementsByTagName$': {enumerable:false,configurable: true, writable: false, value: function(){return document.getElementsByTagName.apply(document, arguments)}},
                                '$querySelector$': {enumerable:false,configurable: true, writable: false, value: function(){return document.querySelector.apply(document, arguments)}},
                                '$querySelectorAll$': {enumerable:false,configurable: true, writable: false, value: function(){return document.querySelectorAll.apply(document, arguments)}},
                                '$createElement$': {enumerable:false,configurable: true, writable: false, value: function(){return document.createElement.apply(document, arguments)}},
                                '$removeEventListener$': {enumerable:false,configurable: true, writable: false, value: function(){ return document.removeEventListener.apply(document, arguments); }}, 
                                '$addEventListener$': {enumerable:false,configurable: true, writable: false, value: function(){
                                        if(typeof arguments[1] != 'function') {
                                            var js = Mental(),
                                                converted = Function.apply(exports, arguments) + '',                                             
                                            js = MentalJS();                                                                                                                                    
                                            converted = eval(js.parse({options:{eval:false},code:'('+converted+')'}));    
                                            arguments[1] = converted;
                                        }
                                        return document.addEventListener.apply(document, arguments);
                                    }
                                 }                                
                            });
                                                                                                                                                                                                                                                                                                                            
                            exports[scoping+'exports'+scoping] = this;                                                                       
                        }                   
                        result = eval(code);                                                                  
                        if(that.result) {
                            that.result(result);
                        }
                        return result;
                };
                
            	function sandbox(code) {	
            		this.code = code; 													
					var scoping = '$', pos = 0, chr, parentState, parentStates = {}, states, msg, state = 'Nothing', left = 0, output = '', outputLine = '', 
					last, next, next2, next3, next4, next5, next6, next7, next8, next9, next10,
					unicodeChr1, unicodeChr2, unicodeChr3, unicodeChr4,
					previous, previous2, previous3, previous4,previous5,				
					length = code.length, parseTree = that.parseTree,
					lookupSquare = 0, lookupCurly = 0, lookupParen = 0, ternaryCount = 0, isTernary = {}, caseCount = 0, isCase = {}, isVar = {},
					isFor = {}, isForIn = {},  isIf = {}, isObjectLiteral = {},																
					expected = 0, expect = 0, expected2 = 0, expected3 = 0, expected4 = 0, lastState = 'Nothing', newLineFlag = 0,
					SQUARE_OPEN = 91, SQUARE_CLOSE = 93, PAREN_OPEN = 40, PAREN_CLOSE = 41,
					CURLY_OPEN = 123, CURLY_CLOSE = 125,
					LOWER_A = 97, LOWER_B = 98, LOWER_C = 99, LOWER_D = 100, LOWER_E = 101,
					LOWER_F = 102, LOWER_G = 103, LOWER_H = 104, LOWER_I = 105, LOWER_J = 106,
					LOWER_K = 107, LOWER_L = 108, LOWER_M = 109, LOWER_N = 110, LOWER_O = 111,
					LOWER_P = 112, LOWER_Q = 113, LOWER_R = 114, LOWER_S = 115, LOWER_T = 116,
					LOWER_U = 117, LOWER_V = 118, LOWER_W = 119, LOWER_X = 120, LOWER_Y = 121,
					LOWER_Z = 122,
					UPPER_A = 65, UPPER_B = 66, UPPER_C = 67, UPPER_D = 68, UPPER_E = 69,
					UPPER_F = 70, UPPER_G = 71, UPPER_H = 72, UPPER_I = 73, UPPER_J = 74,
					UPPER_K = 75, UPPER_L = 76, UPPER_M = 77, UPPER_N = 78, UPPER_O = 79,
					UPPER_P = 80, UPPER_Q = 81, UPPER_R = 82, UPPER_S = 83, UPPER_T = 84,
					UPPER_U = 85, UPPER_V = 86, UPPER_W = 87, UPPER_X = 88, UPPER_Y = 89,
					UPPER_Z = 90,
					DIGIT_0 = 48, DIGIT_1 = 49, DIGIT_2 = 50, DIGIT_3 = 51, DIGIT_4 = 52, DIGIT_5 = 53,
					DIGIT_6 = 54, DIGIT_7 = 55, DIGIT_8 = 56, DIGIT_9 = 57, 
					DOLLAR = 36, UNDERSCORE = 95, SINGLE_QUOTE = 39, DOUBLE_QUOTE = 34,
					FORWARD_SLASH = 47, BACKSLASH = 92, ASTERIX = 42, EQUAL = 61, CARET = 94,
					COLON = 58, QUESTION_MARK = 63, COMMA = 44, PERIOD = 46, SEMI_COLON = 59,
					EXCLAMATION_MARK = 33, 	TILDE = 126, PLUS = 43, MINUS = 45,
					AMPERSAND = 38, PIPE = 124, GREATER_THAN = 62, LESS_THAN = 60,
					PERCENT = 37,
					NEWLINE = 10, CARRIAGE_RETURN = 13, LINE_SEPARATOR = 8232, PARAGRAPH_SEPARATOR = 8233;								
				
					function checkSyntax(code){                                        
                        try {
                            throw new Error()
                        }
                        catch (e) {
                            var relativeLineNumber = e.lineNumber
                        }
                        try {
                            code = new Function(code);
                        }
                        catch (e) {                                
                            msg = e;
                            pos = (e.lineNumber - relativeLineNumber - 1);                
                            error(e, code);
                        }
                    }; 
					
					function isValidVariable(c) {
				    	if((c >= LOWER_A && c <= LOWER_Z) || (c >= UPPER_A && c <= UPPER_Z) || c === UNDERSCORE || c === DOLLAR) {
				    		return true;
				    	} else if(c >= 0x80) {
				    		if(c==170||c==181||c==186||c==192||(c>=193&&c<=215)||(c>=217&&c<=247)||(c>=249&&c<=709)||(c>=711&&c<=735)||(c>=737&&c<=747)||c==750||c==880||(c>=881&&c<=885)||(c>=887&&c<=889)||(c>=891&&c<=901)||c==904||(c>=905&&c<=907)||c==910||(c>=911&&c<=930)||(c>=932&&c<=1014)||(c>=1016&&c<=1161)||(c>=1163&&c<=1328)||(c>=1330&&c<=1368)||c==1377||(c>=1378&&c<=1487)||(c>=1489&&c<=1519)||(c>=1521&&c<=1567)||(c>=1569&&c<=1645)||(c>=1647&&c<=1648)||(c>=1650&&c<=1748)||c==1765||(c>=1766&&c<=1773)||(c>=1775&&c<=1785)||(c>=1787&&c<=1790)||c==1808||c==1810||(c>=1811&&c<=1868)||(c>=1870&&c<=1968)||c==1994||(c>=1995&&c<=2035)||(c>=2037&&c<=2041)||c==2048||(c>=2049&&c<=2073)||c==2084||c==2088||c==2112||(c>=2113&&c<=2207)||c==2210||(c>=2211&&c<=2307)||(c>=2309&&c<=2364)||c==2384||c==2392||(c>=2393&&c<=2416)||(c>=2418&&c<=2424)||(c>=2426&&c<=2436)||(c>=2438&&c<=2446)||(c>=2448&&c<=2450)||(c>=2452&&c<=2473)||(c>=2475&&c<=2481)||c==2486||(c>=2487&&c<=2492)||c==2510||c==2524||(c>=2525&&c<=2526)||(c>=2528&&c<=2543)||(c>=2545&&c<=2564)||(c>=2566&&c<=2574)||(c>=2576&&c<=2578)||(c>=2580&&c<=2601)||(c>=2603&&c<=2609)||(c>=2611&&c<=2612)||(c>=2614&&c<=2615)||(c>=2617&&c<=2648)||(c>=2650&&c<=2653)||c==2674||(c>=2675&&c<=2692)||(c>=2694&&c<=2702)||(c>=2704&&c<=2706)||(c>=2708&&c<=2729)||(c>=2731&&c<=2737)||(c>=2739&&c<=2740)||(c>=2742&&c<=2748)||c==2768||c==2784||(c>=2785&&c<=2820)||(c>=2822&&c<=2830)||(c>=2832&&c<=2834)||(c>=2836&&c<=2857)||(c>=2859&&c<=2865)||(c>=2867&&c<=2868)||(c>=2870&&c<=2876)||c==2908||(c>=2909&&c<=2910)||(c>=2912&&c<=2928)||c==2947||c==2949||(c>=2950&&c<=2957)||(c>=2959&&c<=2961)||(c>=2963&&c<=2968)||(c>=2970&&c<=2971)||c==2974||(c>=2975&&c<=2978)||(c>=2980&&c<=2983)||(c>=2985&&c<=2989)||(c>=2991&&c<=3023)||c==3077||(c>=3078&&c<=3085)||(c>=3087&&c<=3089)||(c>=3091&&c<=3113)||(c>=3115&&c<=3124)||(c>=3126&&c<=3132)||c==3160||(c>=3161&&c<=3167)||(c>=3169&&c<=3204)||(c>=3206&&c<=3213)||(c>=3215&&c<=3217)||(c>=3219&&c<=3241)||(c>=3243&&c<=3252)||(c>=3254&&c<=3260)||c==3294||c==3296||(c>=3297&&c<=3312)||(c>=3314&&c<=3332)||(c>=3334&&c<=3341)||(c>=3343&&c<=3345)||(c>=3347&&c<=3388)||c==3406||c==3424||(c>=3425&&c<=3449)||(c>=3451&&c<=3460)||(c>=3462&&c<=3481)||(c>=3483&&c<=3506)||(c>=3508&&c<=3516)||c==3520||(c>=3521&&c<=3584)||(c>=3586&&c<=3633)||(c>=3635&&c<=3647)||(c>=3649&&c<=3712)||(c>=3714&&c<=3715)||c==3719||(c>=3720&&c<=3721)||c==3725||c==3732||(c>=3733&&c<=3736)||(c>=3738&&c<=3744)||(c>=3746&&c<=3748)||c==3751||c==3754||(c>=3755&&c<=3756)||(c>=3758&&c<=3761)||(c>=3763&&c<=3772)||c==3776||(c>=3777&&c<=3781)||c==3804||(c>=3805&&c<=3839)||c==3904||(c>=3905&&c<=3912)||(c>=3914&&c<=3975)||(c>=3977&&c<=4095)||(c>=4097&&c<=4158)||c==4176||(c>=4177&&c<=4185)||(c>=4187&&c<=4192)||c==4197||(c>=4198&&c<=4205)||(c>=4207&&c<=4212)||(c>=4214&&c<=4237)||c==4256||(c>=4257&&c<=4294)||c==4301||c==4304||(c>=4305&&c<=4347)||(c>=4349&&c<=4681)||(c>=4683&&c<=4687)||(c>=4689&&c<=4695)||c==4698||(c>=4699&&c<=4703)||(c>=4705&&c<=4745)||(c>=4747&&c<=4751)||(c>=4753&&c<=4785)||(c>=4787&&c<=4791)||(c>=4793&&c<=4799)||c==4802||(c>=4803&&c<=4807)||(c>=4809&&c<=4823)||(c>=4825&&c<=4881)||(c>=4883&&c<=4887)||(c>=4889&&c<=4991)||(c>=4993&&c<=5023)||(c>=5025&&c<=5120)||(c>=5122&&c<=5742)||(c>=5744&&c<=5760)||(c>=5762&&c<=5791)||(c>=5793&&c<=5869)||(c>=5871&&c<=5887)||(c>=5889&&c<=5901)||(c>=5903&&c<=5919)||(c>=5921&&c<=5951)||(c>=5953&&c<=5983)||(c>=5985&&c<=5997)||(c>=5999&&c<=6015)||(c>=6017&&c<=6102)||c==6108||c==6176||(c>=6177&&c<=6271)||(c>=6273&&c<=6313)||c==6320||(c>=6321&&c<=6399)||(c>=6401&&c<=6479)||(c>=6481&&c<=6511)||(c>=6513&&c<=6527)||(c>=6529&&c<=6592)||(c>=6594&&c<=6655)||(c>=6657&&c<=6687)||(c>=6689&&c<=6822)||c==6917||(c>=6918&&c<=6980)||(c>=6982&&c<=7042)||(c>=7044&&c<=7085)||(c>=7087&&c<=7097)||(c>=7099&&c<=7167)||(c>=7169&&c<=7244)||(c>=7246&&c<=7257)||(c>=7259&&c<=7400)||(c>=7402&&c<=7405)||(c>=7407&&c<=7412)||(c>=7414&&c<=7423)||(c>=7425&&c<=7679)||(c>=7681&&c<=7959)||(c>=7961&&c<=7967)||(c>=7969&&c<=8007)||(c>=8009&&c<=8015)||(c>=8017&&c<=8024)||c==8027||c==8029||c==8031||(c>=8032&&c<=8063)||(c>=8065&&c<=8117)||(c>=8119&&c<=8125)||c==8130||(c>=8131&&c<=8133)||(c>=8135&&c<=8143)||(c>=8145&&c<=8149)||(c>=8151&&c<=8159)||(c>=8161&&c<=8177)||(c>=8179&&c<=8181)||(c>=8183&&c<=8304)||c==8319||c==8336||(c>=8337&&c<=8449)||c==8455||c==8458||(c>=8459&&c<=8468)||c==8473||(c>=8474&&c<=8483)||c==8486||c==8488||c==8490||(c>=8491&&c<=8494)||(c>=8496&&c<=8507)||(c>=8509&&c<=8516)||(c>=8518&&c<=8525)||c==8544||(c>=8545&&c<=11263)||(c>=11265&&c<=11311)||(c>=11313&&c<=11359)||(c>=11361&&c<=11498)||(c>=11500&&c<=11505)||(c>=11507&&c<=11519)||(c>=11521&&c<=11558)||c==11565||c==11568||(c>=11569&&c<=11630)||c==11648||(c>=11649&&c<=11679)||(c>=11681&&c<=11687)||(c>=11689&&c<=11695)||(c>=11697&&c<=11703)||(c>=11705&&c<=11711)||(c>=11713&&c<=11719)||(c>=11721&&c<=11727)||(c>=11729&&c<=11735)||(c>=11737&&c<=11822)||c==12293||(c>=12294&&c<=12320)||(c>=12322&&c<=12336)||(c>=12338&&c<=12343)||(c>=12345&&c<=12352)||(c>=12354&&c<=12444)||(c>=12446&&c<=12448)||(c>=12450&&c<=12539)||(c>=12541&&c<=12548)||(c>=12550&&c<=12592)||(c>=12594&&c<=12703)||(c>=12705&&c<=12783)||(c>=12785&&c<=13311)||(c>=13313&&c<=19967)||(c>=19969&&c<=40959)||(c>=40961&&c<=42191)||(c>=42193&&c<=42239)||(c>=42241&&c<=42511)||(c>=42513&&c<=42537)||(c>=42539&&c<=42559)||(c>=42561&&c<=42622)||(c>=42624&&c<=42655)||(c>=42657&&c<=42774)||(c>=42776&&c<=42785)||(c>=42787&&c<=42890)||(c>=42892&&c<=42895)||(c>=42897&&c<=42911)||(c>=42913&&c<=42999)||(c>=43001&&c<=43010)||(c>=43012&&c<=43014)||(c>=43016&&c<=43019)||(c>=43021&&c<=43071)||(c>=43073&&c<=43137)||(c>=43139&&c<=43249)||(c>=43251&&c<=43258)||c==43274||(c>=43275&&c<=43311)||(c>=43313&&c<=43359)||(c>=43361&&c<=43395)||(c>=43397&&c<=43470)||c==43520||(c>=43521&&c<=43583)||(c>=43585&&c<=43587)||(c>=43589&&c<=43615)||(c>=43617&&c<=43641)||c==43648||(c>=43649&&c<=43696)||c==43701||(c>=43702&&c<=43704)||(c>=43706&&c<=43711)||c==43714||c==43739||(c>=43740&&c<=43743)||(c>=43745&&c<=43761)||(c>=43763&&c<=43776)||(c>=43778&&c<=43784)||(c>=43786&&c<=43792)||(c>=43794&&c<=43807)||(c>=43809&&c<=43815)||(c>=43817&&c<=43967)||(c>=43969&&c<=44031)||(c>=44033&&c<=55215)||(c>=55217&&c<=55242)||(c>=55244&&c<=63743)||(c>=63745&&c<=64111)||(c>=64113&&c<=64255)||(c>=64257&&c<=64274)||(c>=64276&&c<=64284)||c==64287||(c>=64288&&c<=64297)||(c>=64299&&c<=64311)||(c>=64313&&c<=64317)||c==64320||(c>=64321&&c<=64322)||(c>=64324&&c<=64325)||(c>=64327&&c<=64466)||(c>=64468&&c<=64847)||(c>=64849&&c<=64913)||(c>=64915&&c<=65007)||(c>=65009&&c<=65135)||(c>=65137&&c<=65141)||(c>=65143&&c<=65312)||(c>=65314&&c<=65344)||(c>=65346&&c<=65381)||(c>=65383&&c<=65473)||(c>=65475&&c<=65481)||(c>=65483&&c<=65489)||(c>=65491&&c<=65497)) {
				    			return true;
				    		} else {
				    			return false;
				    		}
				    	} else {
				    		return false;
				    	}
				    }
				    function isValidVariablePart(c) {
				    	if((c >= LOWER_A && c <= LOWER_Z) || (c >= DIGIT_0 && c <= DIGIT_9) || (c >= UPPER_A && c <= UPPER_Z) || c === UNDERSCORE || c === DOLLAR) {
				    		return true;
				    	} else if(c >= 0x80) {
				    		if(c==170||c==181||c==186||c==192||(c>=193&&c<=215)||(c>=217&&c<=247)||(c>=249&&c<=709)||(c>=711&&c<=735)||(c>=737&&c<=747)||c==750||c==768||(c>=769&&c<=885)||(c>=887&&c<=889)||(c>=891&&c<=901)||c==904||(c>=905&&c<=907)||c==910||(c>=911&&c<=930)||(c>=932&&c<=1014)||(c>=1016&&c<=1154)||(c>=1156&&c<=1161)||(c>=1163&&c<=1328)||(c>=1330&&c<=1368)||c==1377||(c>=1378&&c<=1424)||(c>=1426&&c<=1470)||c==1473||(c>=1474&&c<=1475)||(c>=1477&&c<=1478)||c==1488||(c>=1489&&c<=1519)||(c>=1521&&c<=1551)||(c>=1553&&c<=1567)||(c>=1569&&c<=1645)||(c>=1647&&c<=1748)||(c>=1750&&c<=1758)||(c>=1760&&c<=1769)||(c>=1771&&c<=1790)||c==1808||(c>=1809&&c<=1868)||(c>=1870&&c<=1983)||(c>=1985&&c<=2041)||c==2048||(c>=2049&&c<=2111)||(c>=2113&&c<=2207)||c==2210||(c>=2211&&c<=2275)||(c>=2277&&c<=2303)||(c>=2305&&c<=2405)||(c>=2407&&c<=2416)||(c>=2418&&c<=2424)||(c>=2426&&c<=2432)||(c>=2434&&c<=2436)||(c>=2438&&c<=2446)||(c>=2448&&c<=2450)||(c>=2452&&c<=2473)||(c>=2475&&c<=2481)||c==2486||(c>=2487&&c<=2491)||(c>=2493&&c<=2502)||(c>=2504&&c<=2506)||(c>=2508&&c<=2518)||c==2524||(c>=2525&&c<=2526)||(c>=2528&&c<=2533)||(c>=2535&&c<=2560)||(c>=2562&&c<=2564)||(c>=2566&&c<=2574)||(c>=2576&&c<=2578)||(c>=2580&&c<=2601)||(c>=2603&&c<=2609)||(c>=2611&&c<=2612)||(c>=2614&&c<=2615)||(c>=2617&&c<=2619)||c==2622||(c>=2623&&c<=2630)||(c>=2632&&c<=2634)||(c>=2636&&c<=2640)||c==2649||(c>=2650&&c<=2653)||c==2662||(c>=2663&&c<=2688)||(c>=2690&&c<=2692)||(c>=2694&&c<=2702)||(c>=2704&&c<=2706)||(c>=2708&&c<=2729)||(c>=2731&&c<=2737)||(c>=2739&&c<=2740)||(c>=2742&&c<=2747)||(c>=2749&&c<=2758)||(c>=2760&&c<=2762)||(c>=2764&&c<=2767)||c==2784||(c>=2785&&c<=2789)||(c>=2791&&c<=2816)||(c>=2818&&c<=2820)||(c>=2822&&c<=2830)||(c>=2832&&c<=2834)||(c>=2836&&c<=2857)||(c>=2859&&c<=2865)||(c>=2867&&c<=2868)||(c>=2870&&c<=2875)||(c>=2877&&c<=2886)||(c>=2888&&c<=2890)||(c>=2892&&c<=2901)||(c>=2903&&c<=2907)||(c>=2909&&c<=2910)||(c>=2912&&c<=2917)||(c>=2919&&c<=2928)||c==2946||(c>=2947&&c<=2948)||(c>=2950&&c<=2957)||(c>=2959&&c<=2961)||(c>=2963&&c<=2968)||(c>=2970&&c<=2971)||c==2974||(c>=2975&&c<=2978)||(c>=2980&&c<=2983)||(c>=2985&&c<=2989)||(c>=2991&&c<=3005)||(c>=3007&&c<=3013)||(c>=3015&&c<=3017)||(c>=3019&&c<=3023)||c==3031||c==3046||(c>=3047&&c<=3072)||(c>=3074&&c<=3076)||(c>=3078&&c<=3085)||(c>=3087&&c<=3089)||(c>=3091&&c<=3113)||(c>=3115&&c<=3124)||(c>=3126&&c<=3132)||(c>=3134&&c<=3141)||(c>=3143&&c<=3145)||(c>=3147&&c<=3156)||(c>=3158&&c<=3159)||(c>=3161&&c<=3167)||(c>=3169&&c<=3173)||(c>=3175&&c<=3201)||(c>=3203&&c<=3204)||(c>=3206&&c<=3213)||(c>=3215&&c<=3217)||(c>=3219&&c<=3241)||(c>=3243&&c<=3252)||(c>=3254&&c<=3259)||(c>=3261&&c<=3269)||(c>=3271&&c<=3273)||(c>=3275&&c<=3284)||(c>=3286&&c<=3293)||c==3296||(c>=3297&&c<=3301)||(c>=3303&&c<=3312)||(c>=3314&&c<=3329)||(c>=3331&&c<=3332)||(c>=3334&&c<=3341)||(c>=3343&&c<=3345)||(c>=3347&&c<=3388)||(c>=3390&&c<=3397)||(c>=3399&&c<=3401)||(c>=3403&&c<=3414)||c==3424||(c>=3425&&c<=3429)||(c>=3431&&c<=3449)||(c>=3451&&c<=3457)||(c>=3459&&c<=3460)||(c>=3462&&c<=3481)||(c>=3483&&c<=3506)||(c>=3508&&c<=3516)||c==3520||(c>=3521&&c<=3529)||c==3535||(c>=3536&&c<=3541)||c==3544||(c>=3545&&c<=3569)||(c>=3571&&c<=3584)||(c>=3586&&c<=3647)||(c>=3649&&c<=3663)||(c>=3665&&c<=3712)||(c>=3714&&c<=3715)||c==3719||(c>=3720&&c<=3721)||c==3725||c==3732||(c>=3733&&c<=3736)||(c>=3738&&c<=3744)||(c>=3746&&c<=3748)||c==3751||c==3754||(c>=3755&&c<=3756)||(c>=3758&&c<=3770)||(c>=3772&&c<=3775)||(c>=3777&&c<=3781)||c==3784||(c>=3785&&c<=3791)||(c>=3793&&c<=3803)||(c>=3805&&c<=3839)||c==3864||(c>=3865&&c<=3871)||(c>=3873&&c<=3892)||c==3895||c==3897||c==3902||(c>=3903&&c<=3912)||(c>=3914&&c<=3952)||(c>=3954&&c<=3973)||(c>=3975&&c<=3992)||(c>=3994&&c<=4037)||c==4096||(c>=4097&&c<=4175)||(c>=4177&&c<=4255)||(c>=4257&&c<=4294)||c==4301||c==4304||(c>=4305&&c<=4347)||(c>=4349&&c<=4681)||(c>=4683&&c<=4687)||(c>=4689&&c<=4695)||c==4698||(c>=4699&&c<=4703)||(c>=4705&&c<=4745)||(c>=4747&&c<=4751)||(c>=4753&&c<=4785)||(c>=4787&&c<=4791)||(c>=4793&&c<=4799)||c==4802||(c>=4803&&c<=4807)||(c>=4809&&c<=4823)||(c>=4825&&c<=4881)||(c>=4883&&c<=4887)||(c>=4889&&c<=4956)||(c>=4958&&c<=4991)||(c>=4993&&c<=5023)||(c>=5025&&c<=5120)||(c>=5122&&c<=5742)||(c>=5744&&c<=5760)||(c>=5762&&c<=5791)||(c>=5793&&c<=5869)||(c>=5871&&c<=5887)||(c>=5889&&c<=5901)||(c>=5903&&c<=5919)||(c>=5921&&c<=5951)||(c>=5953&&c<=5983)||(c>=5985&&c<=5997)||(c>=5999&&c<=6001)||(c>=6003&&c<=6015)||(c>=6017&&c<=6102)||c==6108||(c>=6109&&c<=6111)||(c>=6113&&c<=6154)||(c>=6156&&c<=6159)||(c>=6161&&c<=6175)||(c>=6177&&c<=6271)||(c>=6273&&c<=6319)||(c>=6321&&c<=6399)||(c>=6401&&c<=6431)||(c>=6433&&c<=6447)||(c>=6449&&c<=6469)||(c>=6471&&c<=6511)||(c>=6513&&c<=6527)||(c>=6529&&c<=6575)||(c>=6577&&c<=6607)||(c>=6609&&c<=6655)||(c>=6657&&c<=6687)||(c>=6689&&c<=6751)||(c>=6753&&c<=6782)||(c>=6784&&c<=6799)||(c>=6801&&c<=6822)||c==6912||(c>=6913&&c<=6991)||(c>=6993&&c<=7018)||(c>=7020&&c<=7039)||(c>=7041&&c<=7167)||(c>=7169&&c<=7231)||(c>=7233&&c<=7244)||(c>=7246&&c<=7375)||(c>=7377&&c<=7379)||(c>=7381&&c<=7423)||(c>=7425&&c<=7675)||(c>=7677&&c<=7959)||(c>=7961&&c<=7967)||(c>=7969&&c<=8007)||(c>=8009&&c<=8015)||(c>=8017&&c<=8024)||c==8027||c==8029||c==8031||(c>=8032&&c<=8063)||(c>=8065&&c<=8117)||(c>=8119&&c<=8125)||c==8130||(c>=8131&&c<=8133)||(c>=8135&&c<=8143)||(c>=8145&&c<=8149)||(c>=8151&&c<=8159)||(c>=8161&&c<=8177)||(c>=8179&&c<=8181)||(c>=8183&&c<=8203)||(c>=8205&&c<=8254)||(c>=8256&&c<=8275)||c==8305||c==8319||c==8336||(c>=8337&&c<=8399)||(c>=8401&&c<=8416)||c==8421||(c>=8422&&c<=8449)||c==8455||c==8458||(c>=8459&&c<=8468)||c==8473||(c>=8474&&c<=8483)||c==8486||c==8488||c==8490||(c>=8491&&c<=8494)||(c>=8496&&c<=8507)||(c>=8509&&c<=8516)||(c>=8518&&c<=8525)||c==8544||(c>=8545&&c<=11263)||(c>=11265&&c<=11311)||(c>=11313&&c<=11359)||(c>=11361&&c<=11498)||(c>=11500&&c<=11519)||(c>=11521&&c<=11558)||c==11565||c==11568||(c>=11569&&c<=11630)||c==11647||(c>=11648&&c<=11679)||(c>=11681&&c<=11687)||(c>=11689&&c<=11695)||(c>=11697&&c<=11703)||(c>=11705&&c<=11711)||(c>=11713&&c<=11719)||(c>=11721&&c<=11727)||(c>=11729&&c<=11735)||(c>=11737&&c<=11743)||(c>=11745&&c<=11822)||c==12293||(c>=12294&&c<=12320)||(c>=12322&&c<=12336)||(c>=12338&&c<=12343)||(c>=12345&&c<=12352)||(c>=12354&&c<=12440)||(c>=12442&&c<=12444)||(c>=12446&&c<=12448)||(c>=12450&&c<=12539)||(c>=12541&&c<=12548)||(c>=12550&&c<=12592)||(c>=12594&&c<=12703)||(c>=12705&&c<=12783)||(c>=12785&&c<=13311)||(c>=13313&&c<=19967)||(c>=19969&&c<=40959)||(c>=40961&&c<=42191)||(c>=42193&&c<=42239)||(c>=42241&&c<=42511)||(c>=42513&&c<=42559)||(c>=42561&&c<=42611)||(c>=42613&&c<=42622)||(c>=42624&&c<=42654)||(c>=42656&&c<=42774)||(c>=42776&&c<=42785)||(c>=42787&&c<=42890)||(c>=42892&&c<=42895)||(c>=42897&&c<=42911)||(c>=42913&&c<=42999)||(c>=43001&&c<=43071)||(c>=43073&&c<=43135)||(c>=43137&&c<=43215)||(c>=43217&&c<=43231)||(c>=43233&&c<=43258)||c==43264||(c>=43265&&c<=43311)||(c>=43313&&c<=43359)||(c>=43361&&c<=43391)||(c>=43393&&c<=43470)||(c>=43472&&c<=43519)||(c>=43521&&c<=43583)||(c>=43585&&c<=43599)||(c>=43601&&c<=43615)||(c>=43617&&c<=43641)||(c>=43643&&c<=43647)||(c>=43649&&c<=43738)||(c>=43740&&c<=43743)||(c>=43745&&c<=43761)||(c>=43763&&c<=43776)||(c>=43778&&c<=43784)||(c>=43786&&c<=43792)||(c>=43794&&c<=43807)||(c>=43809&&c<=43815)||(c>=43817&&c<=43967)||(c>=43969&&c<=44011)||(c>=44013&&c<=44015)||(c>=44017&&c<=44031)||(c>=44033&&c<=55215)||(c>=55217&&c<=55242)||(c>=55244&&c<=63743)||(c>=63745&&c<=64111)||(c>=64113&&c<=64255)||(c>=64257&&c<=64274)||(c>=64276&&c<=64284)||(c>=64286&&c<=64297)||(c>=64299&&c<=64311)||(c>=64313&&c<=64317)||c==64320||(c>=64321&&c<=64322)||(c>=64324&&c<=64325)||(c>=64327&&c<=64466)||(c>=64468&&c<=64847)||(c>=64849&&c<=64913)||(c>=64915&&c<=65007)||(c>=65009&&c<=65023)||(c>=65025&&c<=65055)||(c>=65057&&c<=65074)||(c>=65076&&c<=65100)||(c>=65102&&c<=65135)||(c>=65137&&c<=65141)||(c>=65143&&c<=65295)||(c>=65297&&c<=65312)||(c>=65314&&c<=65342)||c==65345||(c>=65346&&c<=65381)||(c>=65383&&c<=65473)||(c>=65475&&c<=65481)||(c>=65483&&c<=65489)||(c>=65491&&c<=65497)) {
				    			return true;
				    		} else {
				    			return false;
				    		}
				    	} else {
				    		return false;
				    	}
				    }	
					
					if(that.options.browserCheckSyntax) {
					   checkSyntax(code);
					}
									
					for(;;) {
						outputLine = '';					
						if(pos === length) {						
							break;
						}	
						state = 'Nothing';
						if(expected || expected2 || expected3 || expected4) {
							expect = 1;
						}									
						chr = code.charCodeAt(pos);
						next = code.charCodeAt(pos+1);
						if(chr === 0x20 || chr === 0x9 || chr === 0xb || chr === 0xc || chr === 0xa0 || chr === 0x1680 || chr === 0x180E || chr === 0x202F || chr === 0x205F || chr === 0x3000 || chr === 0xFEFF || (chr >= 0x2000 && chr <= 0x200A)) {
							pos++;
							continue;						
						} else if(chr === NEWLINE || chr === CARRIAGE_RETURN || chr === LINE_SEPARATOR || chr === PARAGRAPH_SEPARATOR) {						
							newLineFlag = 1;
							pos++;
							continue;												
						} else if((chr >= DIGIT_0 && chr <= DIGIT_9) || (!left && chr === PERIOD)) {																														
							if(rules.ObjectLiteralIdentifierNumber[lastState]) {
								state = 'ObjectLiteralIdentifierNumber';
								expected = 'ObjectLiteralColon';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;							
							} else if(rules.Number[lastState]) {
								left = 1;
				           	 	state = 'Number';
				          	} else {
				          		if(!rules['Number'][lastState] && newLineFlag) {                                                                                    
                                    outputLine = ';' + outputLine;
                                    lastState = 'EndStatement';
                                    left = 1;
                                    isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;
                                    state = 'Number';                                
                                }
				          	}
							
							states = {hex:0, len:0, dot: 0, e:0};                        
				            if(chr === DIGIT_0 && (next === UPPER_X || next === LOWER_X)) {
				                states.hex = 2;
				                outputLine = outputLine + '0x';
				                pos+=2;
				                states.len = 2;                
				            }                  
				            for(;;) {
				            	
				            	if(pos === length) {
				                    break;
				                }
				            	
				                chr = code.charCodeAt(pos);                
				                next = code.charCodeAt(pos+1);                
				                if(chr >= DIGIT_0 && chr <= DIGIT_9) {
				                	if(states.hex) {
				                		states.hex++;   
				                	}
				                } else if(states.hex && ((chr >= LOWER_A && chr <= LOWER_F) || (chr >= UPPER_A && chr <= UPPER_F))) {
				                	states.hex++;         	                                    
				                } else if((chr === LOWER_E || chr === UPPER_E) && next === PLUS && !states.e) {                                                                
				                    outputLine = outputLine + 'e+';
				                    states.e = 1;
				                    pos+=2;
				                } else if(!states.hex && chr === PERIOD && !states.dot) {                    
				                    if(states.e) {
				                    	break;
				                    }
				                    states.dot = 1;
				                } else if(!states.hex && chr === PERIOD && states.dot) {                	
				                	break;
				                } else if((chr === LOWER_E || chr === UPPER_E) && next === MINUS && !states.e && !states.hex) {
				                	outputLine = outputLine + 'e-';
				                	states.e = 1;
				                    pos+=2;
				                } else if((chr === LOWER_E || chr === UPPER_E) && (next >= DIGIT_0 && next <= DIGIT_9 || next === PLUS || next === MINUS) && states.e && states.len > 0) {                	
				                	break;
				                } else if((chr === LOWER_E || chr === UPPER_E) && next !== MINUS && next !== PLUS && (next >= DIGIT_0 && next <= DIGIT_9)) {
				                	states.e = 1;                                
				                } else if((chr === LOWER_E || chr === UPPER_E) && next !== MINUS && next !== PLUS && (!(next >= DIGIT_0 && next <= DIGIT_9))) {
				                	error("Missing exponent");                                                                                                                         
				                } else if(!states.hex && (!((chr >= DIGIT_0 && chr <= DIGIT_9) || chr === LOWER_E || chr === UPPER_E)) && states.len > 0) {                       	                     	                                  
				                    break;
				                } else if(!state.hex && (!((chr >= DIGIT_0 && chr <= DIGIT_9) || chr === PERIOD || chr === LOWER_E || chr === UPPER_E)) && states.len === 0) {
				                    error('Invalid number');                                                                     
				                } else {
				                	break;
				                }
				                                                           
				                outputLine = outputLine + code.charAt(pos);
				                pos++;
				                states.len++;                
				                if(states.complete) {
				                    break;
				                }                
				            }  
				            
				            if(chr === PERIOD && states.len === 1) {
				            	error("Syntax error expected number");
				            } else if(states.hex && states.len <= 2) {            	            	
				            	error("Expected hex digit");
				            }                                                                                                                                                                                     
						} else if((chr >= LOWER_A && chr <= LOWER_Z) || (chr >= UPPER_A && chr <= UPPER_Z) || (chr === BACKSLASH || isValidVariable(chr))) {
							
							next2 = code.charCodeAt(pos+2);
							next3 = code.charCodeAt(pos+3);
							next4 = code.charCodeAt(pos+4);
							next5 = code.charCodeAt(pos+5);
							next6 = code.charCodeAt(pos+6);
							next7 = code.charCodeAt(pos+7);
							next8 = code.charCodeAt(pos+8);
							next9 = code.charCodeAt(pos+9);
							next10 = code.charCodeAt(pos+10);	
							
							//function keyword
							if(chr === LOWER_F && next === LOWER_U && next2 === LOWER_N && next3 === LOWER_C && next4 === LOWER_T && next5 === LOWER_I && next6 === LOWER_O && next7 === LOWER_N && !isValidVariablePart(next8) && next8 !== BACKSLASH) {								
								if(rules.FunctionExpression[lastState]) {
									state = 'FunctionExpression';
									expected = 'FunctionExpressionIdentifier';
									expected2 = 'FunctionExpressionParenOpen';
									expected3 = 0;
									expected4 = 0;
									expect = 0;																
								} else if(rules.FunctionStatement[lastState]) {
									state = 'FunctionStatement';
									expected = 'FunctionIdentifier';
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									expect = 0;
								} else {								    
								    if(!rules['Identifier'][lastState] && newLineFlag) {                                                                                    
                                        outputLine = ';' + outputLine;
                                        lastState = 'EndStatement';
                                        left = 0;
                                        isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;
                                        state = 'FunctionStatement';
                                        expected = 'FunctionIdentifier';
                                        expected2 = 0;
                                        expected3 = 0;
                                        expected4 = 0;
                                        expect = 0;
                                    } else {
                                        error('Unexpected function. Cannot follow '+lastState+'.Output:'+output);
                                    }                                              
                                }
								left = 0;
								pos+=8;
								outputLine = outputLine + 'function';											
							//if keyword
							} else if(chr === LOWER_I && next === LOWER_F && !isValidVariablePart(next2) && next2 !== BACKSLASH) {
								state = 'IfStatement';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=2;
								if(lastState === 'Else') {
									outputLine = outputLine + ' ';
								}
								outputLine = outputLine + 'if';
								isIf[lookupSquare+''+lookupCurly+''+lookupParen] = 1;																			
							//var keyword
							} else if(chr === LOWER_V && next === LOWER_A && next2 === LOWER_R && !isValidVariablePart(next3) && next3 !== BACKSLASH) {																																
								if(!rules['Var'][lastState]) {                                                                                                                       
                                    outputLine = ';' + outputLine;
                                    lastState = 'EndStatement';
                                    left = 0;
                                    isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;                                              
                                }
								state = 'Var';
								expected = 'Identifier';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=3;	
								outputLine = outputLine + 'var ';
								isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 1;																																												
							//for keyword
							} else if(chr === LOWER_F && next === LOWER_O && next2 === LOWER_R && !isValidVariablePart(next3) && next3 !== BACKSLASH) {
								state = 'ForStatement';
								expected = 'ForStatementParenOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=3;	
								outputLine = outputLine + 'for';
								isFor[lookupSquare+''+lookupCurly+''+lookupParen] = 1;																			
							// else keyword
							} else if(chr === LOWER_E && next === LOWER_L && next2 === LOWER_S && next3 === LOWER_E && !isValidVariablePart(next4) && next4 !== BACKSLASH) {															
								if(!isIf[lookupSquare+''+lookupCurly+''+lookupParen]) {
									error("Syntax error unexpected else");
								}																																						
								state = 'Else';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=4;
								outputLine = outputLine + 'else ';								
							// while keyword
							} else if(chr === LOWER_W && next === LOWER_H && next2 === LOWER_I && next3 === LOWER_L && next4 === LOWER_E && !isValidVariablePart(next5) && next5 !== BACKSLASH) {
								state = 'WhileStatement';
								expected = 'WhileStatementParenOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=5;	
								outputLine = outputLine + 'while';							
							// switch keyword
							} else if(chr === LOWER_S && next === LOWER_W && next2 === LOWER_I && next3 === LOWER_T && next4 === LOWER_C && next5 === LOWER_H && !isValidVariablePart(next6) && next6 !== BACKSLASH) {
								state = 'SwitchStatement';
								expected = 'SwitchStatementParenOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=6;	
								outputLine = outputLine + 'switch';							
							// with keyword
							} else if(chr === LOWER_W && next === LOWER_I && next2 === LOWER_T && next3 === LOWER_H && !isValidVariablePart(next4) && next4 !== BACKSLASH) {
								state = 'WithStatement';
								expected = 'WithStatementParenOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=4;
								outputLine = outputLine + 'with';								
							// this keyword
							} else if(chr === LOWER_T && next === LOWER_H && next2 === LOWER_I && next3 === LOWER_S && !isValidVariablePart(next4) && next4 !== BACKSLASH) {
								state = 'This';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=4;
								outputLine = outputLine + 'this';								
							// true keyword
							} else if(chr === LOWER_T && next === LOWER_R && next2 === LOWER_U && next3 === LOWER_E && !isValidVariablePart(next4) && next4 !== BACKSLASH) {
								state = 'True';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=4;
								outputLine = outputLine + 'true';								
							// false keyword
							} else if(chr === LOWER_F && next === LOWER_A && next2 === LOWER_L && next3 === LOWER_S && next4 === LOWER_E && !isValidVariablePart(next5) && next5 !== BACKSLASH) {
								state = 'False';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=5;
								outputLine = outputLine + 'false';																						
							// NaN keyword
							} else if(chr === UPPER_N && next === LOWER_A && next2 === UPPER_N && !isValidVariablePart(next3) && next3 !== BACKSLASH) {
								state = 'NaN';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=3;
								outputLine = outputLine + 'NaN';								
							// null keyword
							} else if(chr === LOWER_N && next === LOWER_U && next2 === LOWER_L && next3 === LOWER_L && !isValidVariablePart(next4) && next4 !== BACKSLASH) {
								state = 'Null';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=4;
								outputLine = outputLine + 'null';								
							// undefined keyword
							} else if(lastState !== 'FunctionArgumentComma' && lastState !== 'FunctionExpressionArgumentComma' && chr === LOWER_U && next === LOWER_N && next2 === LOWER_D && next3 === LOWER_E && next4 === LOWER_F && next5 === LOWER_I && next6 === LOWER_N && next7 === LOWER_E && next8 === LOWER_D && !isValidVariablePart(next9) && next9 !== BACKSLASH) {
								state = 'Undefined';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=9;
								outputLine = outputLine + 'undefined';								
							// break keyword
							} else if(chr === LOWER_B && next === LOWER_R && next2 === LOWER_E && next3 === LOWER_A && next4 === LOWER_K && !isValidVariablePart(next5) && next5 !== BACKSLASH) {
								state = 'Break';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=5;
								outputLine = outputLine + 'break';								
							// case keyword
							} else if(chr === LOWER_C && next === LOWER_A && next2 === LOWER_S && next3 === LOWER_E && !isValidVariablePart(next4) && next4 !== BACKSLASH) {
								state = 'Case';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=4;							
								outputLine = outputLine + 'case ';
								isCase[lookupSquare+''+lookupCurly+''+lookupParen] = 1;
								caseCount++;																					
							// catch keyword			
							} else if(chr === LOWER_C && next === LOWER_A && next2 === LOWER_T && next3 === LOWER_C && next4 === LOWER_H && !isValidVariablePart(next5) && next5 !== BACKSLASH) {
								state = 'CatchStatement';
								expected = 'CatchStatementParenOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=5;
								outputLine = outputLine + 'catch';										
							// continue keyword			
							} else if(chr === LOWER_C && next === LOWER_O && next2 === LOWER_N && next3 === LOWER_T && next4 === LOWER_I && next5 === LOWER_N && next6 === LOWER_U && next7 === LOWER_E && !isValidVariablePart(next8) && next8 !== BACKSLASH) {
								state = 'Continue';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=8;
								outputLine = outputLine + 'continue';										
							// debugger keyword			
							} else if(chr === LOWER_D && next === LOWER_E && next2 === LOWER_B && next3 === LOWER_U && next4 === LOWER_G && next5 === LOWER_G && next6 === LOWER_E && next7 === LOWER_R && !isValidVariablePart(next8) && next8 !== BACKSLASH) {
								state = 'Debugger';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=8;
								outputLine = outputLine + 'debugger';										
							// default keyword			
							} else if(chr === LOWER_D && next === LOWER_E && next2 === LOWER_F && next3 === LOWER_A && next4 === LOWER_U && next5 === LOWER_L && next6 === LOWER_T && !isValidVariablePart(next7) && next7 !== BACKSLASH) {
								state = 'Default';
								expected = 'SwitchColon';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=7;
								outputLine = outputLine + 'default';										
							// delete keyword			
							} else if(chr === LOWER_D && next === LOWER_E && next2 === LOWER_L && next3 === LOWER_E && next4 === LOWER_T && next5 === LOWER_E && !isValidVariablePart(next6) && next6 !== BACKSLASH) {
								state = 'Delete';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=6;
								outputLine = outputLine + 'delete ';								
							// do keyword		
							} else if(chr === LOWER_D && next === LOWER_O && !isValidVariablePart(next2) && next2 !== BACKSLASH) {
								state = 'Do';
								expected = 'DoStatementCurlyOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=2;
								outputLine = outputLine + 'do ';								
							// finally keyword			
							} else if(chr === LOWER_F && next === LOWER_I && next2 === LOWER_N && next3 === LOWER_A && next4 === LOWER_L && next5 === LOWER_L && next6 === LOWER_Y && !isValidVariablePart(next7) && next7 !== BACKSLASH) {
								state = 'FinallyStatement';
								expected = 'FinallyStatementCurlyOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=7;
								outputLine = outputLine + 'finally';								
							// in keyword		
							} else if(chr === LOWER_I && next === LOWER_N && !isValidVariablePart(next2) && next2 !== BACKSLASH) {
								state = 'In';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=2;
								outputLine = outputLine + ' in ';
								if(isFor[lookupSquare+''+lookupCurly+''+lookupParen]) {
									isForIn[lookupSquare+''+lookupCurly+''+lookupParen] = 1;		
								}													
							// Infinity keyword		
							} else if(chr === UPPER_I && next === LOWER_N && next2 === LOWER_F && next3 === LOWER_I && next4 === LOWER_N && next5 === LOWER_I && next6 === LOWER_T && next7 === LOWER_Y && !isValidVariablePart(next8) && next8 !== BACKSLASH) {
								state = 'Infinity';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=8;
								outputLine = outputLine + 'Infinity';																							
							// instanceof keyword		
							} else if(chr === LOWER_I && next === LOWER_N && next2 === LOWER_S && next3 === LOWER_T && next4 === LOWER_A && next5 === LOWER_N && next6 === LOWER_C && next7 === LOWER_E && next8 === LOWER_O && next9 === LOWER_F && !isValidVariablePart(next10) && next10 !== BACKSLASH) {
								state = 'InstanceOf';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=10;
								outputLine = outputLine + ' instanceof ';								
							// new keyword
							} else if(chr === LOWER_N && next === LOWER_E && next2 === LOWER_W && !isValidVariablePart(next3) && next3 !== BACKSLASH) {
								state = 'New';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=3;
								outputLine = outputLine + 'new ';									
							// return keyword			
							} else if(chr === LOWER_R && next === LOWER_E && next2 === LOWER_T && next3 === LOWER_U && next4 === LOWER_R && next5 === LOWER_N && !isValidVariablePart(next6) && next6 !== BACKSLASH) {
								state = 'Return';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=6;
								outputLine = outputLine + 'return ';								
							// throw keyword			
							} else if(chr === LOWER_T && next === LOWER_H && next2 === LOWER_R && next3 === LOWER_O && next4 === LOWER_W && !isValidVariablePart(next5) && next5 !== BACKSLASH) {
								state = 'Throw';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=5;
								outputLine = outputLine + 'throw ';								
							// try keyword
							} else if(chr === LOWER_T && next === LOWER_R && next2 === LOWER_Y && !isValidVariablePart(next3) && next3 !== BACKSLASH) {
								state = 'TryStatement';
								expected = 'TryStatementCurlyOpen';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
								left = 0;	
								pos+=3;
								outputLine = outputLine + 'try';								
							// typeof keyword
							} else if(chr === LOWER_T && next === LOWER_Y && next2 === LOWER_P && next3 === LOWER_E && next4 === LOWER_O && next5 === LOWER_F && !isValidVariablePart(next6) && next6 !== BACKSLASH) {
								state = 'TypeOf';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=6;
								outputLine = outputLine + 'typeof ';																																																				
							// void keyword
							} else if(chr === LOWER_V && next === LOWER_O && next2 === LOWER_I && next3 === LOWER_D && !isValidVariablePart(next4) && next4 !== BACKSLASH) {
								state = 'Void';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;	
								pos+=4;
								outputLine = outputLine + 'void ';
							// prototype keyword
							} else if(lastState === 'IdentifierDot' && chr === LOWER_P && next === LOWER_R && next2 === LOWER_O && next3 === LOWER_T && next4 === LOWER_O && next5 === LOWER_T && next6 === LOWER_Y && next7 === LOWER_P && next8 === LOWER_E && !isValidVariablePart(next9) && next9 !== BACKSLASH) {																																																									
								state = 'Identifier';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=9;
								outputLine = outputLine + 'prototype';
							// length keyword
							} else if(lastState === 'IdentifierDot' && chr === LOWER_L && next === LOWER_E && next2 === LOWER_N && next3 === LOWER_G && next4 === LOWER_T && next5 === LOWER_H && !isValidVariablePart(next6) && next6 !== BACKSLASH) {																																																									
								state = 'Identifier';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;	
								pos+=6;
								outputLine = outputLine + 'length';
							} else {							    							   							    							
								// Identifiers																											
								if(rules.FunctionIdentifier[lastState]) {
									state = 'FunctionIdentifier';
									expected = 'FunctionParenOpen';
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									expect = 0;
									outputLine = outputLine + ' ';
								} else if(rules.CatchStatementIdentifier[lastState]) {
									state = 'CatchStatementIdentifier';
									expected = 'CatchStatementParenClose';
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									expect = 0;
								} else if(rules.ObjectLiteralIdentifier[lastState]) {
									state = 'ObjectLiteralIdentifier';
									expected = 'ObjectLiteralColon';
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									expect = 0;									
								} else if(rules.FunctionExpressionIdentifier[lastState]) {
									state = 'FunctionExpressionIdentifier';
									expected = 'FunctionExpressionParenOpen';
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									expect = 0;
									outputLine = outputLine + ' ';
								} else if(rules.FunctionArgumentIdentifier[lastState]) {
									state = 'FunctionArgumentIdentifier';
									expected = 'FunctionParenClose';
									expected2 = 'FunctionArgumentComma';
									expected3 = 0;
									expected4 = 0;
									expect = 0;				
								} else if(rules.FunctionExpressionArgumentIdentifier[lastState]) {
									state = 'FunctionExpressionArgumentIdentifier';
									expected = 'FunctionExpressionParenClose';
									expected2 = 'FunctionExpressionArgumentComma';
									expected3 = 0;
									expected4 = 0;
									expect = 0;
								} else if(rules.VarIdentifier[lastState]) {									
									state = 'VarIdentifier';
									expected = 0;
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									expect = 0;																													
								} else if(rules.Identifier[lastState]) {
									state = 'Identifier';
									expected = 0;
									expected2 = 0;
									expected3 = 0;
									expected4 = 0;
									left = 1;								
								} else {
									if(!rules['Identifier'][lastState] && newLineFlag) {                                                                                    
                                        outputLine = ';' + outputLine;
                                        lastState = 'EndStatement';
                                        left = 0;
                                        isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;                                              
                                    }
                                    state = 'Identifier';
                                    expected = 0;
                                    expected2 = 0;
                                    expected3 = 0;
                                    expected4 = 0;
                                    left = 1;
								}					
								states = {first:0};							
								outputLine = outputLine + scoping;
								for(;;) {
									
									if(pos === length) {
										break;
									}
									
									chr = code.charCodeAt(pos);
									if(chr === BACKSLASH) {
										next = code.charCodeAt(pos+1);
										next2 = code.charCodeAt(pos+2);
										next3 = code.charCodeAt(pos+3);
										next4 = code.charCodeAt(pos+4);
										next5 = code.charCodeAt(pos+5);
										unicodeChr1 = code.charAt(pos+2);
										unicodeChr2 = code.charAt(pos+3);
										unicodeChr3 = code.charAt(pos+4);
										unicodeChr4 = code.charAt(pos+5);																		
										if(next !== LOWER_U) {
											error('Invalid unicode escape sequence');
										}
										if(
											((next2 >= LOWER_A && next2 <= LOWER_F) || (next2 >= UPPER_A && next2 <= UPPER_F) || (next2 >= DIGIT_0 && next2 <= DIGIT_9))&&
											((next3 >= LOWER_A && next3 <= LOWER_F) || (next3 >= UPPER_A && next3 <= UPPER_F) || (next3 >= DIGIT_0 && next3 <= DIGIT_9))&&
											((next4 >= LOWER_A && next4 <= LOWER_F) || (next4 >= UPPER_A && next4 <= UPPER_F) || (next4 >= DIGIT_0 && next4 <= DIGIT_9))&&
											((next5 >= LOWER_A && next5 <= LOWER_F) || (next5 >= UPPER_A && next5 <= UPPER_F) || (next5 >= DIGIT_0 && next5 <= DIGIT_9))
										) {
											if(!states.first) {
												if(isValidVariable(parseInt(unicodeChr1+unicodeChr2+unicodeChr3+unicodeChr4,16))) {
													outputLine = outputLine + '\\u'+unicodeChr1+unicodeChr2+unicodeChr3+unicodeChr4;
													pos+=6;
													continue;
												} else {
													error("Invalid unicode escape sequence used as variable");		
												}
												states.first = 1;	
											} else {
												if(isValidVariablePart(parseInt(unicodeChr1+unicodeChr2+unicodeChr3+unicodeChr4,16))) {
													outputLine = outputLine + '\\u'+unicodeChr1+unicodeChr2+unicodeChr3+unicodeChr4;
													pos+=6;
													continue;
												} else {
													error("Invalid unicode escape sequence used as variable");		
												}
											}
										} else {
											error("Invalid hex digits in unicode escape");
										}																														
									} else if(!states.first) {
										states.first = 1;
										if(isValidVariable(chr)) {																
										} else {
											error('Unexpected character ' + code.charAt(pos) + '. Cannot follow '+lastState+'.Output:'+output);
										}	
									} else {
										if(isValidVariablePart(chr)) {										
										} else if(chr === BACKSLASH && !states.unicode) {
											states.unicode = 1;
										} else {
											break;
										}
									}															
									outputLine = outputLine + code.charAt(pos);													
									pos++;
								}
								outputLine = outputLine + scoping;													
							}
							
							if(!rules[state][lastState] && newLineFlag) {                                                                                    
                                outputLine = ';' + outputLine;
                                lastState = 'EndStatement';                                
                                isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;                                              
                            }																																																																			                                                                                                                                                                                                                                                                                     
						} else if(chr === FORWARD_SLASH) {
							if(!left && next !== ASTERIX && next !== FORWARD_SLASH) {																								
								states = {escaping: 0, complete: 0, open: 0, square: 0, flags: {}};       
				                state = 'RegExp';
				                left = 1;               
				                states.open = 1; 	                            
				                outputLine = outputLine + '/';		                        
				                pos++;                  
				                while(1) {
				                    chr = code.charCodeAt(pos);
				                    next = code.charCodeAt(pos+1);                            
				                    if(chr === FORWARD_SLASH && !states.escaping && !states.square) {
				                        states.open = 0;
				                        if(next !== LOWER_I && next !== LOWER_M && next !== LOWER_G) {
				                            states.complete = 1;
				                        }
				                    } else if(chr === FORWARD_SLASH && !states.escaping && states.square) {
				                        outputLine = outputLine + '\\';           
				                    } else if(chr === PAREN_OPEN && !states.escaping && states.square) {
				                    	 outputLine = outputLine + '\\';
									} else if(chr === PAREN_CLOSE && !states.escaping && states.square) {
				                    	outputLine = outputLine + '\\';                            	    
				                    } else if(chr === SQUARE_OPEN && !states.escaping && states.square) {                
				                        outputLine = outputLine + '\\';
				                    } else if(chr === SQUARE_OPEN && !states.escaping && !states.square) {
				                    	next2 = code.charCodeAt(pos+2); 
				                        if(next === SQUARE_CLOSE || (next === CARET && next2 === SQUARE_CLOSE)) {
				                            error("Empty character class not allowed.");
				                        }
				                        states.square = 1;               
				                    } else if(chr === BACKSLASH && !states.escaping) {
				                        states.escaping = 1;
				                    } else if(chr === BACKSLASH && states.escaping) {
				                        states.escaping = 0;
				                    } else if(chr === SQUARE_CLOSE && !states.escaping) {                
				                        states.square = 0;               
				                    } else if(chr === NEWLINE || chr === CARRIAGE_RETURN || chr === LINE_SEPARATOR || chr === PARAGRAPH_SEPARATOR) {
				                        error("Unterminated regex literal");                                
				                    } else if(states.escaping) {
				                        states.escaping = 0;
				                    } else if(!states.open && next !== LOWER_I && next !== LOWER_M && next !== LOWER_G) {
				                        if(!states.open && (chr === LOWER_I || chr === LOWER_M || chr === LOWER_G) && states.flags[chr]) {
				                            error("Duplicate regex flag");
				                        }               
				                        states.complete = 1;
				                    } else if(!states.open && (chr === LOWER_I || chr === LOWER_M || chr === LOWER_G) && !states.flags[chr]) {
				                        states.flags[chr] = 1;
				                    } 
				                    if(pos + 1 > length && states.open) {               
				                        error("Unterminated regex literal");
				                    }
				                    
				                    if(pos + 1 > length) { 
				                        break;
				                    }	                            
				                    outputLine = outputLine + code.charAt(pos);	                            
				                    pos++;
				                    if(states.complete) {	                                                  
				                        break;
				                    }
				                }   
							} else if(next === FORWARD_SLASH) {
								states = {};                        
				                pos+=2;                 
				                for(;;) {
				                	if(pos === length) {
										break;
									}
				                    chr = code.charCodeAt(pos);
				                    if(chr === NEWLINE || chr === CARRIAGE_RETURN || chr === LINE_SEPARATOR || chr === PARAGRAPH_SEPARATOR) {
				                        states.complete = 1;
				                    }
				                    if(pos + 1 > length) {
				                        break;
				                    }	                            
				                    pos++;
				                    if(states.complete) {
				                        break;
				                    }
				                }
				                continue;	                           
							} else if(next === ASTERIX) {							
				                pos += 2;                 
				                for(;;) {
				                	if(pos === length) {
										break;
									}
				                    chr = code.charCodeAt(pos);
				                    next = code.charCodeAt(pos+1);                          
				                    if(chr === ASTERIX && next === FORWARD_SLASH) {               	                                
				                        pos+=2;
				                        break;
				                    }           
				                    if(pos + 1 > length) {             
				                        error("Unterminated multiline comment");
				                    }	                            
				                    pos++;	                            
				                } 
				                continue;  
							} else if(left && next !== FORWARD_SLASH) {
								left = 0;
								if(next === EQUAL) {
									state = 'AssignmentDivide';
									pos+=2;
									last = EQUAL;
									outputLine = outputLine + '/=';	
								} else {
									state = 'DivideOperator';
									pos++;
									last = FORWARD_SLASH;
									outputLine = outputLine + '/';	
								}
							} else {
								error('Unexpected /. Cannot follow '+lastState+'.Output:'+output);
							}
						} else if(chr === SQUARE_OPEN) {			
							if(!left) {
								state = 'ArrayOpen';				
							} else {
								state = 'AccessorOpen';																									
							}			
							outputLine = outputLine + '[';
							if(state === 'AccessorOpen') {
								outputLine = outputLine + 'M.P(';
							}							
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = state;						
							left = 0;
							last = SQUARE_OPEN;
							pos++;
							lookupSquare++;
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = state;						
						} else if(chr === SQUARE_CLOSE) {
							lookupSquare--;			
							parentState = parentStates[lookupSquare+''+lookupCurly+''+lookupParen];									
							if(parentState === 'ArrayOpen') {
								state = 'ArrayClose';
								left = 1;
							} else if(parentState === 'AccessorOpen') {
								state = 'AccessorClose';
								left = 1;
								outputLine = outputLine + ')';
							} else {				
								error('Unexpected ]. Cannot follow '+lastState+'.Output:'+output);
							}													
							outputLine = outputLine + ']';
							left = 1;
							last = SQUARE_CLOSE;
							pos++;
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = '';							
						} else if(chr === PAREN_OPEN) {																																																																									
							if(lastState === 'FunctionIdentifier') {
								state = 'FunctionParenOpen';
								expect = 0;
								expected = 'FunctionArgumentIdentifier';
								expected2 = 'FunctionParenClose';
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'ForStatement') {
								state = 'ForStatementParenOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(rules.FunctionCallOpen[lastState]) {
								state = 'FunctionCallOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'IfStatement') {
								state = 'IfStatementParenOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;	
							} else if(lastState === 'CatchStatement') {
								state = 'CatchStatementParenOpen';
								expected = 'CatchStatementIdentifier';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;	
								expect = 0;			
							} else if(lastState === 'WhileStatement') {
								state = 'WhileStatementParenOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'SwitchStatement') {
								state = 'SwitchStatementParenOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'WithStatement') {
								state = 'WithStatementParenOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'FunctionExpressionIdentifier') {
								state = 'FunctionExpressionParenOpen';
								expect = 0;
								expected = 'FunctionExpressionArgumentIdentifier';
								expected2 = 'FunctionExpressionParenClose';
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'FunctionExpression') {
								state = 'FunctionExpressionParenOpen';
								expect = 0;
								expected = 'FunctionExpressionArgumentIdentifier';
								expected2 = 'FunctionExpressionParenClose';
								expected3 = 0;
								expected4 = 0;							
							} else if(rules.ParenExpressionOpen[lastState]) {							
								state = 'ParenExpressionOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else {							    
							    if(!rules['Identifier'][lastState] && newLineFlag) {                                                                                    
                                   outputLine = ';' + outputLine;
                                   lastState = 'EndStatement';
                                   left = 0;
                                   isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;
                                   state = 'ParenExpressionOpen';
                                   expected = 0;
                                   expected2 = 0;
                                   expected3 = 0;
                                   expected4 = 0;
                                } else {
							       error('Unexpected (. Cannot follow '+lastState+'.Output:'+output);
							    }															
							}												
							outputLine = outputLine + '(';
							last = PAREN_OPEN;
							pos++;
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = state;
							left = 0;
							lookupParen++;
						} else if(chr === PAREN_CLOSE) {
						    isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;				
							lookupParen--;						
							parentState = parentStates[lookupSquare+''+lookupCurly+''+lookupParen];																																																					
							if(rules.FunctionParenClose[lastState]) {
								state = 'FunctionParenClose';
								expect = 0;
								expected = "FunctionStatementCurlyOpen";
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(parentState === 'FunctionCallOpen') {
								state = 'FunctionCallClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;
							} else if(parentState === 'ForStatementParenOpen') {
								state = 'ForStatementParenClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
								isFor[lookupSquare+''+lookupCurly+''+lookupParen] = 0;		
								isForIn[lookupSquare+''+lookupCurly+''+lookupParen] = 0;		
							} else if(parentState === 'SwitchStatementParenOpen') {
								state = 'SwitchStatementParenClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'CatchStatementParenOpen') {
								state = 'CatchStatementParenClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'WhileStatementParenOpen') {
								state = 'WhileStatementParenClose';
								expected = "";
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'WithStatementParenOpen') {
								state = 'WithStatementParenClose';
								expected = "";
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'IfStatementParenOpen') {
								state = 'IfStatementParenClose';
								expected = "";
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(rules.FunctionExpressionParenClose[lastState]) {
								state = 'FunctionExpressionParenClose';
								expect = 0;
								expected = "FunctionExpressionCurlyOpen";
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(parentState === 'ParenExpressionOpen') {
								state = 'ParenExpressionClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;
							} else {																													
								error('Unexpected ). Cannot follow '+lastState+'.Output:'+output);							
							}											
							outputLine = outputLine + ')';
							pos++;
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = '';																		
						} else if(chr === CURLY_OPEN) {																																												
							if(lastState === 'FunctionParenClose') {
								state = 'FunctionStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'Do') {
								state = 'DoStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'Else') {
								state = 'ElseCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'WhileStatementParenClose') {
								state = 'WhileStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;	
							} else if(lastState === 'CatchStatementParenClose') {
								state = 'CatchStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'ForStatementParenClose') {
								state = 'ForStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'WithStatementParenClose') {
								state = 'WithStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;				
							} else if(lastState === 'TryStatement') {
								state = 'TryStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'SwitchStatementParenClose') {
								state = 'SwitchStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'IfStatementParenClose') {
								state = 'IfStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'FinallyStatement') {
								state = 'FinallyStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(lastState === 'FunctionExpressionParenClose') {
								state = 'FunctionExpressionCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(rules.ObjectLiteralCurlyOpen[lastState]) {				
								state = 'ObjectLiteralCurlyOpen';
								expected = 'ObjectLiteralIdentifier';
								expected2 = 'ObjectLiteralIdentifierString';
								expected3 = 'ObjectLiteralIdentifierNumber';
								expected4 = 'ObjectLiteralCurlyClose';
								expect = 0;
								parentStates[lookupSquare+''+(lookupCurly+1)+''+lookupParen] = state;
								outputLine = outputLine + 'M.O(';
							} else if(rules.BlockStatementCurlyOpen[lastState]) {
								state = 'BlockStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else {
							    if(!rules['Identifier'][lastState] && newLineFlag) {                                                                                    
                                   outputLine = ';' + outputLine;
                                   lastState = 'EndStatement';
                                   left = 0;
                                   isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;
                                   state = 'BlockStatementCurlyOpen';
                                   expected = 0;
                                   expected2 = 0;
                                   expected3 = 0;
                                   expected4 = 0;                                              
                                } else {												
								    error('Unexpected {. Cannot follow '+lastState+'.Output:'+output);
								}
							}										
							outputLine = outputLine + '{';
							if(state === 'FunctionStatementCurlyOpen' || state === 'FunctionExpressionCurlyOpen') {
								outputLine = outputLine + 'var $arguments$=M.A(arguments);';
							}
							last = CURLY_OPEN;
							pos++;
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = state;
							left = 0;
							lookupCurly++;
						} else if(chr === CURLY_CLOSE) {							
							isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;
							lookupCurly--;																															
							parentState = parentStates[lookupSquare+''+lookupCurly+''+lookupParen];																																									
							outputLine = outputLine + '}';																											
							if(parentState === 'FunctionStatementCurlyOpen') {
								state = 'FunctionStatementCurlyClose';								
								left = 0;
							} else if(parentState === 'ElseCurlyOpen') {
								state = 'ElseCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'ObjectLiteralCurlyOpen') {
								state = 'ObjectLiteralCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 1;
								isObjectLiteral[lookupSquare+''+(lookupCurly+1)+''+lookupParen] = 0;
								outputLine = outputLine + ')';
							} else if(parentState === 'ForStatementCurlyOpen') {
								state = 'ForStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;								
							} else if(parentState === 'WhileStatementCurlyOpen') {
								state = 'WhileStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;								
							} else if(parentState === 'CatchStatementCurlyOpen') {
								state = 'CatchStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'FinallyStatementCurlyOpen') {
								state = 'FinallyStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;												
							} else if(parentState === 'WithStatementCurlyOpen') {
								state = 'WithStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;								
							} else if(parentState === 'TryStatementCurlyOpen') {
								state = 'TryStatementCurlyClose';				
								expected = 'CatchStatement';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
							} else if(parentState === 'DoStatementCurlyOpen') {
								state = 'DoStatementCurlyClose';				
								expected = 'WhileStatement';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;
							} else if(parentState === 'SwitchStatementCurlyOpen') {
								state = 'SwitchStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;														
							} else if(parentState === 'DoStatement') {
								state = 'DoStatementCurlyOpen';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
								expect = 0;
							} else if(parentState === 'IfStatementCurlyOpen') {
								state = 'IfStatementCurlyClose';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								left = 0;
							} else if(parentState === 'FunctionExpressionCurlyOpen') {
								state = 'FunctionExpressionCurlyClose';
								left = 1;
							} else if(parentState === 'BlockStatementCurlyOpen') {
								state = 'BlockStatementCurlyClose';								
								left = 0;
							} else {																						
								error('Unexpected }. Cannot follow '+lastState+'.Output:'+output);
							}							
							parentStates[lookupSquare+''+lookupCurly+''+lookupParen] = '';										
							pos++;														
						} else if(chr === QUESTION_MARK) {
							state = 'TernaryQuestionMark';
							outputLine = outputLine + '?';
							last = QUESTION_MARK;
							left = 0;
							pos++;
							if(isTernary[lookupSquare+''+lookupCurly+''+lookupParen]) {
							  isTernary[lookupSquare+''+lookupCurly+''+lookupParen]++;
							} else {
							  isTernary[lookupSquare+''+lookupCurly+''+lookupParen] = 1;
							}
							ternaryCount++;													
						} else if(chr === COMMA) {			
							parentState = parentStates[lookupSquare+''+lookupCurly+''+lookupParen];																																																																																																
							if(lastState === 'FunctionArgumentIdentifier') {
								state = 'FunctionArgumentComma';
								expect = 0;
								expected = 'FunctionArgumentIdentifier';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(parentState === 'ArrayOpen' || lastState === 'ArrayOpen') {
								state = 'ArrayComma';															
							} else if(lastState === 'FunctionExpressionArgumentIdentifier') {
								state = 'FunctionExpressionArgumentComma';
								expect = 0;
								expected = 'FunctionExpressionArgumentIdentifier';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;		
							} else if(parentState === 'ParenExpressionOpen') {
								state = 'ParenExpressionComma';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(isObjectLiteral[lookupSquare+''+lookupCurly+''+lookupParen]) {
								state = 'ObjectLiteralComma';
								expect = 0;
								expected = 'ObjectLiteralIdentifier';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							} else if(isVar[lookupSquare+''+lookupCurly+''+lookupParen]) {
								state = 'VarComma';
								expected = 'Identifier';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;	
							} else if(isTernary[lookupSquare+''+lookupCurly+''+lookupParen]) {
								error("Syntax error expected :");				
							} else {
								state = 'Comma';
								expected = 0;
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
							}
							outputLine = outputLine + ',';
							pos++;
							left = 0;
							last = COMMA;
						} else if(chr === PERIOD) {
							if(left) {							
								state = 'IdentifierDot';								
							} else {
								error('Unexpected . Cannot follow '+lastState+'.Output:'+output);
							}
							expected = 'Identifier';
							expected2 = 0;
							expected3 = 0;
							expected4 = 0;
							expect = 0;
							outputLine = outputLine + '.';
							pos++;
							left = 0;
						} else if(chr === COLON) {
							parentState = parentStates[lookupSquare+''+lookupCurly+''+lookupParen];								
							if(isTernary[lookupSquare+''+lookupCurly+''+lookupParen]) {
								state = 'TernaryColon';
								isTernary[lookupSquare+''+lookupCurly+''+lookupParen]--;
								ternaryCount--;
							} else if(rules.ObjectLiteralColon[lastState]) {
								state = 'ObjectLiteralColon';
								expected = 0;
								expected1 = '';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;																								
								isObjectLiteral[lookupSquare+''+lookupCurly+''+lookupParen] = 1;				
							} else if(isCase[lookupSquare+''+lookupCurly+''+lookupParen] || lastState === 'Default') {
								state = 'SwitchColon';
								if(lastState === 'Case') {
									error("Syntax error");
								}
								expected = 0;
								expected1 = '';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								if(lastState !== 'Default') {
									isCase[lookupSquare+''+lookupCurly+''+lookupParen] = 0;
									caseCount--;	
								}						
							} else if(!parentState) {
								state = 'LabelColon';
							} else {
								error('Unexpected : Cannot follow '+lastState+'.Output:'+output);
							}
							outputLine = outputLine + ':';
							pos++;
							left = 0;
							last = COLON;												
						} else if(chr === SEMI_COLON) {				
							parentState = parentStates[lookupSquare+''+lookupCurly+''+lookupParen];									
							if(isFor[lookupSquare+''+lookupCurly+''+(lookupParen-1)] && !isForIn[lookupSquare+''+lookupCurly+''+(lookupParen-1)]) {
								state = 'ForSemi';
								outputLine = outputLine + ';';
								if(isFor[lookupSquare+''+lookupCurly+''+(lookupParen-1)] > 2) {
									error("Syntax error unexpected for semi ;");
								}
								isFor[lookupSquare+''+lookupCurly+''+(lookupParen-1)]++;
								isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;																						
							} else {								
								state = 'EndStatement';
								if(lastState !== 'EndStatement') {
									outputLine = outputLine + ';';	
								}
								isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;					
							}						
							pos++;
							left = 0;
							last = SEMI_COLON;
						} else if(chr === EXCLAMATION_MARK) {
							next2 = code.charCodeAt(pos+2);						
							if(chr === EXCLAMATION_MARK && next !== EQUAL && !left) {
								state = 'Not';
								outputLine = outputLine + '!';
								pos++;
							} else if(chr === EXCLAMATION_MARK && next === EQUAL && next2 !== EQUAL) {
								state = 'NotEqual';
								outputLine = outputLine + '!=';
								pos+=2;
							} else if(chr === EXCLAMATION_MARK && next === EQUAL && next2 === EQUAL) {
								state = 'StrictNotEqual';
								outputLine = outputLine + '!==';
								pos+=3;							
							} else {
								error('Unexpected !. Cannot follow '+lastState+'.Output:'+output);
							}			
							left = 0;				
						} else if(chr === TILDE) {
							if(chr === TILDE && !left) {
								state = 'BitwiseNot';
								outputLine = outputLine + '~';
								pos++;												
							} else {
								error('Unexpected ~ Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;	
						} else if(chr === PLUS) {
							if(chr === PLUS && next === PLUS && left) {
								state = 'PostfixIncrement';
								outputLine = outputLine + '++';
								pos+=2;
							} else if(chr === PLUS && next === PLUS && !left) {
								state = 'PrefixIncrement';
								outputLine = outputLine + '++';
								pos+=2;						
							} else if(chr === PLUS && next === EQUAL) {
								state = 'AdditionAssignment';
								outputLine = outputLine + '+=';
								pos+=2;
							} else if(chr === PLUS && next !== EQUAL && next !== PLUS && left) {
								state = 'Addition';
								outputLine = outputLine + '+';
								pos++;
							} else if(chr === PLUS && next !== EQUAL && next !== PLUS && !left) {
								state = 'UnaryPlus';
								outputLine = outputLine + '+';
								pos++;																	
							} else {
								error('Unexpected + Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;
						} else if(chr === PIPE) {
							if(chr === PIPE && next === PIPE) {
								state = 'LogicalOr';
								outputLine = outputLine + '||';
								pos+=2;
							} else if(chr === PIPE && next === EQUAL) {
								state = 'OrAssignment';
								outputLine = outputLine + '|=';
								pos+=2;
							} else if(chr === PIPE && next !== PIPE && next !== EQUAL) {
								state = 'BitwiseOr';
								outputLine = outputLine + '|';
								pos++;						
							} else {
								error('Unexpected | Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;
						} else if(chr === CARET) {	
							if(chr === CARET && next === EQUAL) {
								state = 'XorAssignment';
								outputLine = outputLine + '^=';
								pos+=2;
							} else if(chr === CARET && next !== EQUAL) {
								state = 'Xor';
								outputLine = outputLine + '^';
								pos++;						
							} else {
								error('Unexpected ^. Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;
						} else if(chr === PERCENT) {
							if(chr === PERCENT && next === EQUAL) {
								state = 'ModulusAssignment';
								outputLine = outputLine + '%=';
								pos+=2;
							} else if(chr === PERCENT && next !== EQUAL) {
								state = 'Modulus';
								outputLine = outputLine + '%';
								pos++;						
							} else {
								error('Unexpected % Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;								
						} else if(chr === AMPERSAND) {
							if(chr === AMPERSAND && next === AMPERSAND) {
								state = 'LogicalAnd';
								outputLine = outputLine + '&&';
								pos+=2;
							} else if(chr === AMPERSAND && next === EQUAL) {
								state = 'AndAssignment';
								outputLine = outputLine + '&=';
								pos+=2;
							} else if(chr === AMPERSAND && next !== AMPERSAND && next !== EQUAL) {
								state = 'BitwiseAnd';
								outputLine = outputLine + '&';
								pos++;						
							} else {
								error('Unexpected & Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;	
						} else if(chr === EQUAL) {
							next2 = code.charCodeAt(pos+2);						
							if(chr === EQUAL && next !== EQUAL) {
								state = 'EqualAssignment';
								outputLine = outputLine + '=';
								pos++;
							} else if(chr === EQUAL && next === EQUAL && next2 !== EQUAL) {
								state = 'Equal';
								outputLine = outputLine + '==';
								pos+=2;
							} else if(chr === EQUAL && next === EQUAL && next2 === EQUAL) {
								state = 'StrictEqual';
								outputLine = outputLine + '===';
								pos+=3;
							} else {
								error('Unexpected = Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;																											
						} else if(chr === GREATER_THAN) {
							next2 = code.charCodeAt(pos+2);
							next3 = code.charCodeAt(pos+3);
							if(chr === GREATER_THAN && next == GREATER_THAN && next2 == GREATER_THAN && next3 === EQUAL) {
								state = 'ZeroRightShiftAssignment';
								outputLine = outputLine + '>>>=';
								pos+=4;												
							} else if(chr === GREATER_THAN && next == GREATER_THAN && next2 == GREATER_THAN) {
								state = 'ZeroRightShift';
								outputLine = outputLine + '>>>';
								pos+=3;	
							} else if(chr === GREATER_THAN && next == GREATER_THAN && next2 == EQUAL) {
								state = 'RightShiftAssignment';
								outputLine = outputLine + '>>=';
								pos+=3;												
							} else if(chr === GREATER_THAN && next == GREATER_THAN) {
								state = 'RightShift';
								outputLine = outputLine + '>>';
								pos+=2;
							} else if(chr === GREATER_THAN && next !== EQUAL) {
								state = 'GreaterThan';
								outputLine = outputLine + '>';
								pos++;
							} else if(chr === GREATER_THAN && next === EQUAL) {
								state = 'GreaterThanEqual';
								outputLine = outputLine + '>=';
								pos+=2;						
							} else {
								error('Unexpected > Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;		
						} else if(chr === LESS_THAN) {
							next2 = code.charCodeAt(pos+2);	
							if(chr === LESS_THAN && next === LESS_THAN && next2 === EQUAL) {
								state = 'LeftShiftAssignment';
								outputLine = outputLine + '<<=';
								pos+=3;
							}else if(chr === LESS_THAN && next === LESS_THAN) {
								state = 'LeftShift';
								outputLine = outputLine + '<<';
								pos+=2;
							} else if(chr === LESS_THAN && next !== EQUAL) {
								state = 'LessThan';
								outputLine = outputLine + '<';
								pos++;
							} else if(chr === LESS_THAN && next === EQUAL) {
								state = 'LessThanEqual';
								outputLine = outputLine + '<=';
								pos+=2;						
							} else {
								error('Unexpected < Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;
						} else if(chr === ASTERIX) {											
							if(chr === ASTERIX && next !== EQUAL) {
								state = 'Multiply';
								outputLine = outputLine + '*';
								pos++;
							} else if(chr === ASTERIX && next === EQUAL) {
								state = 'MultiplyAssignment';
								outputLine = outputLine + '*=';
								pos+=2;						
							} else {
								error('Unexpected * Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;																						
						} else if(chr === MINUS) {
							if(chr === MINUS && next === MINUS && left) {
								state = 'PostfixDeincrement';
								outputLine = outputLine + '--';
								pos+=2;
							} else if(chr === MINUS && next === MINUS && !left) {
								state = 'PrefixDeincrement';
								outputLine = outputLine + '--';
								pos+=2;						
							} else if(chr === MINUS && next === EQUAL) {
								state = 'MinusAssignment';
								outputLine = outputLine + '-=';
								pos+=2;
							} else if(chr === MINUS && next !== EQUAL && next !== MINUS && left) {
								state = 'Minus';
								outputLine = outputLine + '-';
								pos++;
							} else if(chr === MINUS && next !== EQUAL && next !== MINUS && !left) {
								state = 'UnaryMinus';
								outputLine = outputLine + '-';
								pos++;																	
							} else {					
								error('Unexpected - Cannot follow '+lastState+'.Output:'+output);
							}
							left = 0;																			
						} else if(chr === SINGLE_QUOTE || chr === DOUBLE_QUOTE) {											
							if(lastState === 'ObjectLiteralCurlyOpen' || lastState === 'ObjectLiteralComma') {
								state = 'ObjectLiteralIdentifierString';
								left = 0;
								expected = 'ObjectLiteralColon';
								expected2 = 0;
								expected3 = 0;
								expected4 = 0;
								expect = 0;	
							} else {
								state = 'String';
								left = 1;
							}							
							states = {escaping: 0, complete: 0};
							states[chr] = 1;						
							outputLine = outputLine + code.charAt(pos);
							pos++;
							if(state === 'ObjectLiteralIdentifierString') {
								outputLine = outputLine + scoping;	
							}
							for(;;) {
								if(pos === length) {
										break;
									}
								chr = code.charCodeAt(pos);							
								if(chr === SINGLE_QUOTE && !states.escaping && states[SINGLE_QUOTE]) {
				                    states.complete = 1;                 
				                } else if(chr === DOUBLE_QUOTE && !states.escaping && states[DOUBLE_QUOTE]) {
				                    states.complete = 1;                                                
				                } else if(chr === BACKSLASH && !states.escaping) {
				                    states.escaping = 1;
				                } else if(chr === BACKSLASH && states.escaping) {
				                    states.escaping = 0;
				                } else if((chr === NEWLINE || chr === CARRIAGE_RETURN || chr === LINE_SEPARATOR || chr === PARAGRAPH_SEPARATOR) && !states.escaping) {
				                    error("Unterminated string literal");
				                } else if(states.escaping) {
				                    states.escaping = 0;
				                }                            
				                if(pos + 1 > length) {
				                    error("Unterminated string literal");
				                }
				                if(states.complete && state === 'ObjectLiteralIdentifierString') {
								outputLine = outputLine + scoping;	
								}                                                                       
				                outputLine = outputLine + code.charAt(pos);
								pos++;
				                if(states.complete) {                            	                            	
				                    break;
				                }							
							}																		
						} else {						
							error("Unable to parse "+ String.fromCharCode(chr));
						}															
						
						if(state === 'Nothing') {						    
							error("No state defined for char:" +String.fromCharCode(chr));
						}
						
						if(!rules[state]) {
							error("State does not exist in the rules:" +state);
						}												                       
						
						if(!rules[state][lastState] && newLineFlag) {						    						    						    
							outputLine = ';' + outputLine;
							lastState = 'EndStatement';
							left = 0;
							isVar[lookupSquare+''+lookupCurly+''+lookupParen] = 0;												
						}
						
						output = output + '' + outputLine;
						 
						if(!rules[state][lastState]) {																							
							error("Unexpected " + state + '. Cannot follow '+lastState+'.Output:'+output);
						} else if(((expected && expected !== state) || (expected2 && expected2 !== state) || (expected3 && expected3 !== state) || (expected4 && expected4 !== state)) && expect === 1) {
							msg = "Expected " + expected;
							if(expected2) {
								msg = msg + ' or ' + expected2;
							}
							if(expected3) {
								msg = msg + ' or ' + expected3;
							}
							if(expected4) {
								msg = msg + ' or ' + expected4;
							}
							msg = msg + '. But got '+state + ' with last state:'+lastState+', output:'+output;
							error(msg);
						}
						
						if(parseTree){							
							parseTreeOutput = parseTreeOutput + '<'+state+'>' + outputLine + '</'+state+'>';
						}
						lastState = state;																				
						newLineFlag = 0;																									
					}	
					if(((expected && expected !== state) || (expected2 && expected2 !== state) || (expected3 && expected3 !== state) || (expected4 && expected4 !== state))) {
						msg = "Expected " + expected;
						if(expected2) {
							msg = msg + ' or ' + expected2;
						}
						if(expected3) {
							msg = msg + ' or ' + expected3;
						}
						if(expected4) {
							msg = msg + ' or ' + expected4;
						}
						msg = msg + '. But got '+state + ' with last state:'+lastState + ', output:'+output;
						error(msg);
					}
									
					if(lastState === 'IfStatementParenClose') {
						error("Syntax error");	
					}
					
					if(lookupSquare) {
						error("Syntax error unmatched [");
					} else if(lookupCurly) {
						error("Syntax error unmatched {");
					} else if(lookupParen) {
						error("Syntax error unmatched (");
					} else if(caseCount) {
						error("Syntax error unmatched case");
					}
					
					if(that.parseTree) {						
                    	that.parseTree(parseTreeOutput);
                    }
					if(that.complete) {
                    	that.complete();
                    }
                    if(that.converted) {                    
                    	that.converted(output);
                    }
                    if(that.options.browserCheckSyntax) {      
                        checkSyntax(output);                 
                    }                      													
					return output;
				};	
                
                this.options = {eval:true, stealth: true, browserCheckSyntax: true};
                
                if(typeof obj === 'string') {
                    return execute(sandbox(obj));
                }
                if(typeof obj.global != 'undefined') {
                    this.global = obj.global;
                } else {
                    this.global = true;
                }
                if(obj.thisObject) {
                    this.thisObject = obj.thisObject;
                } else {
                    this.thisObject = {};
                }
                if(obj.options) {
                    this.options = obj.options;
                }
                if(obj.converted) {
                    this.converted = obj.converted;
                }
                if(obj.result) {
                    this.result = obj.result;
                }
                if(obj.complete) {
                    this.complete = obj.complete;
                }
                if(obj.evalCode) {
                    this.evalCode = obj.evalCode;
                }           
                if(obj.functionCode) {
                    this.functionCode = obj.functionCode;
                }   
                if(obj.parseTree) {
                    this.parseTree = obj.parseTree;
                }                                           
                converted = sandbox(obj.code);                                           
                if(this.options.eval) {
                    return execute.call(this.thisObject,converted);
                } else {
                    return converted;
                }
            };                  
        };
        return new Mental;
    };
})(typeof exports === "undefined" ? (window.MentalJS = {}) : exports);
