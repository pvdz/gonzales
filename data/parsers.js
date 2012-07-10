(function(Gonzales){

var root = '../data/parsers/';
Gonzales.parsers = [{
    name: 'ZeParser',
    files: [
        root+'zeparser/Tokenizer.js',
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: 'http://github.com/qfox/ZeParser',
    defaultOn: true,
    getParser: function(exports){
        return function(str){
            return exports.ZeParser.parse(str, true);
        }
    },
},{
    name:'Jison',
    files: [
        root+'jison/parser.js',
    ],
    optimized: false,
    author: '??',
    link: '??',
//    defaultOn: false,
    getParser: function(exports){
        return function(str){
            return exports.Jison.parser.parse(str);
        };
    }
},{
    name:'Narcissus',
    files: [
        root+'narcissus/jsdefs.js',
    ],
    optimized: false,
    author: 'Brendan Eich',
    link: '??',
    defaultOn: true,
    getParser: function(exports){
        return exports.Narcissus.parser.parse;
    }
},{
    name:'Languagejs',
    files: [
        root+'languagejs/JavaScript.js'
    ],
    optimized: false,
    author: '??',
    link: '??',
    defaultOn: false,
    getParser: function(exports){
        return function(str){
            return new exports.Languagejs().parse(str);
        };
    }
},{
    name:'PEGjs',
    files: [
        root+'pegjs/JavaScript.js'
    ],
    optimized: false,
    author: '??',
    link: '??',
    defaultOn: false,
    getParser: function(exports){
        return function(str){
            return new exports.PEGjs.parse(str);
        };
    }
},{
    name:'UglifyJS',
    files: [
        root+'uglifyjs/parse.js'
    ],
    optimized: false,
    author: 'Mihai Bazon',
    link: '??',
    defaultOn: true,
    getParser: function(exports){
        return exports.uglifyjs;
    }
},{
    name:'Esprima',
    files: [
        root+'esprima/esprima.js'
    ],
    optimized: false,
    author: 'Ariya Hidayat',
    link: 'http://esprima.org/',
    defaultOn: true,
    getParser: function(exports){
        return exports.esprima.parse;
    }
},{
    name:'es5parser',
    files: [
        root+'ometajs/es5parser.js',
    ],
    optimized: false,
    author: '??',
    link: 'http://es-lab.googlecode.com/svn/trunk/site/esparser/index.html',
    defaultOn: false,
    getParser: function(exports){
        return function(str){
            exports.ES5Parser.generatePositionInfo = false;
            exports.ES5Parser.matchAll(str, 'Program', []);
        };
    }

// the next are just a few speed run tests for an intermittent build of my parser
// they test the prototypal way of developing js, the revealing pattern, a
// combination of both (the tokenizer is revealing, the parser is prototypal) and
// a version that just uses globals. you should try it ;)

},{
    name:'ZP prototypal pattern test',
    files: [
        root+'zeparser2/prototypal.js'
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: '??',
    defaultOn: true,
    getParser: function(exports){
        return function(str){
            return new exports.Par(str).run();
        };
    },
    special: true
},{
    name:'ZP revealing pattern test',
    files: [
        root+'zeparser2/revealing.js'
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: '??',
    defaultOn: true,
    getParser: function(exports){
        return function(str){
            return new exports.ParAlter(str).run();
        };
    },
    special: true
},{
    name:'ZP hybrid patterns test',
    files: [
        root+'zeparser2/prototypal-and-revealing.js'
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: '??',
    defaultOn: true,
    getParser: function(exports){
        return function(str){
            return new exports.ParAlt(str).run();
        };
    },
    special: true
},{
    name:'ZP globals pattern test',
    files: [
        root+'zeparser2/globals.js'
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: '??',
    defaultOn: true,
    getParser: function(exports){
        return function(str){
            return new exports.ParSolo(str).run();
        };
    },
    special: true
}];


})(typeof window != 'undefined' ? window.Gonzales : require('../src/gonzales').Gonzales);
