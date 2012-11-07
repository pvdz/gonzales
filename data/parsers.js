(function(Gonzales){

var root = '../data/parsers/';
Gonzales.parsers = [
  {
    name:'ZeParser2',
    files: [
      root+'zeparser2/tok.js',
      root+'zeparser2/par.js',
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: 'http://github.com/qfox/zeparser2/',
    defaultOn: true,
    getParser: function(exports){
      return function(str){
        var par = new exports.Par(str);
        return par.run();
      };
    },
  },{
    name:'Acorn',
    files: [
      root+'acorn/acorn.js'
    ],
    optimized: false,
    author: 'Marijn Haverbeke',
    link: 'https://github.com/marijnh/acorn/',
    defaultOn: true,
    getParser: function(exports){
      return function(x){ console.log(exports.acorn.parse(x)); };
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
    name:'UglifyJS',
    files: [
      root+'uglifyjs/parse.js'
    ],
    optimized: false,
    author: 'Mihai Bazon',
    link: 'https://github.com/mishoo/UglifyJS',
    defaultOn: true,
    getParser: function(exports){
      return exports.uglifyjs;
    }
  },{
    name:'mentaljs',
    files: [
        root+'mentaljs/mental.js',
    ],
    optimized: false,
    author: 'Gareth Heyes',
    link: 'https://code.google.com/p/mentaljs/',
    defaultOn: true,
    getParser: function(exports){
        return function(str){
		exports.MentalJS.MentalJS().parse({code:str,options:{eval:false, browserCheckSyntax:false}});
        };
    }
  },{
    name: 'ZeParser',
    files: [
      root+'zeparser/Tokenizer.js',
    ],
    optimized: false,
    author: 'Peter van der Zee',
    link: 'http://github.com/qfox/ZeParser',
    defaultOn: false,
    getParser: function(exports){
      return function(str){
        return exports.ZeParser.parse(str, true);
      }
    },
  },{
    name:'Narcissus',
    files: [
      root+'narcissus/jsdefs.js',
    ],
    optimized: false,
    author: 'Brendan Eich',
    link: 'https://github.com/mozilla/narcissus',
      defaultOn: false,
    getParser: function(exports){
      return exports.Narcissus.parser.parse;
    }
  },{
    name:'Jison',
    files: [
        root+'jison/parser.js',
    ],
    optimized: false,
    author: 'Zach Carter',
    link: 'http://zaach.github.com/jison/',
    defaultOn: false,
    getParser: function(exports){
        return function(str){
            return exports.Jison.parser.parse(str);
        };
    }
  },{
    name:'Languagejs',
    files: [
        root+'languagejs/JavaScript.js'
    ],
    optimized: false,
    author: 'Francisco Ryan Tolmasky',
    link: 'http://languagejs.com/',
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
    author: 'David Majda',
    link: 'http://pegjs.majda.cz/',
    defaultOn: false,
    getParser: function(exports){
        return function(str){
            return new exports.PEGjs.parse(str);
        };
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
}];


})(typeof window != 'undefined' ? window.Gonzales : require('../src/gonzales').Gonzales);
