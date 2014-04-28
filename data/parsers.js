(function(Gonzales){

var root = '../data/parsers/';
Gonzales.parsers = [
  {
    name:'ZeParser2',
    files: [
      root+'zeparser2-2012-09-03/tok.js',
      root+'zeparser2-2012-09-03/par.js',
    ],
    optimized: true,
    author: 'Peter van der Zee',
    link: 'http://github.com/qfox/zeparser2/',
    age: '2012-09-03',
    defaultOn: true,
    getParser: function(exports, win){
      return function(str){
        var par = new win.Par(str);
        return par.run();
      };
    },
  },{
    name:'Overture-tokenizer',
    files: [
      root+'overture-tokenizer/overture-tokenizer.js'
    ],
    optimized: true,
    author: 'Alistair Braidwood',
    link: 'https://github.com/abraidwood/overture',
    defaultOn: false,
    age: '2013-04-02',
    desc: 'Gonzales optimization of Overture',
    getParser: function(exports, win){
      return function(x){
        exports.parse(x);
      };
    }
  },{
    name:'Overture (2013-03-13)',
    files: [
      root+'overture-2013-03-13/overture.js'
    ],
    optimized: false,
    author: 'Marijn Haverbeke',
    link: 'https://github.com/abraidwood/overture',
    defaultOn: false,
    age: '2013-03-13',
    desc: 'Optimized version of Acorn',
    getParser: function(exports, win){
      return function(x){
        exports.parse(x);
      };
    }
  },{
    name:'Overture (2013-05-08)',
    files: [
      root+'overture-2013-05-08/overture.js'
    ],
    optimized: false,
    author: 'Marijn Haverbeke',
    link: 'https://github.com/abraidwood/overture',
    defaultOn: false,
    age: '2013-05-08',
    desc: 'Optimized version of Acorn',
    getParser: function(exports, win){
      return function(x){
        exports.parse(x);
      };
    }
  },{
    name:'Acorn (2012-10-03)',
    files: [
      root+'acorn-2012-10-03/acorn.js'
    ],
    optimized: false,
    author: 'Marijn Haverbeke',
    link: 'https://github.com/marijnh/acorn/',
    defaultOn: false,
    age: '2012-10-03',
    getParser: function(exports, win){
      return function(x){
        exports.parse(x);
      };
    }
  },{
    name:'Acorn (2013-07-25)',
    files: [
      root+'acorn-2013-07-25/acorn.js'
    ],
    optimized: false,
    author: 'Marijn Haverbeke',
    link: 'https://github.com/marijnh/acorn/',
    defaultOn: false,
    age: '2013-07-25',
    getParser: function(exports, win){
      return function(x){
        exports.parse(x);
      };
    }
  },{
    name:'Esprima (2013-08-09)',
    files: [
      root+'esprima-2013-08-09/esprima.js'
    ],
    optimized: false,
    author: 'Ariya Hidayat',
    link: 'http://esprima.org/',
    defaultOn: false,
    age: '2013-08-09',
    getParser: function(exports, win){
      return exports.parse;
    }
  },{
    name:'Esprima (2012-07-03)',
    files: [
      root+'esprima-2012-07-03/esprima.js'
    ],
    optimized: false,
    author: 'Ariya Hidayat',
    link: 'http://esprima.org/',
    defaultOn: false,
    age: '2012-07-03',
    getParser: function(exports, win){
      return exports.esprima.parse;
    }
  },{
    // cant upgrade mentaljs anymore. newer versions are impossible to integrate
    name:'mentaljs (2012-11-07)',
    files: [
      root+'mentaljs-2012-11-07/mental.js',
    ],
    optimized: false,
    author: 'Gareth Heyes',
    link: 'https://code.google.com/p/mentaljs/',
    defaultOn: false,
    age: '2012-11-07',
    getParser: function(exports, win){
      return function(str){
        exports.MentalJS().parse({code:str,options:{eval:false, browserCheckSyntax:false}});
      };
    }
  },{
    name:'UglifyJS2',
    files: [
      root+'uglifyjs2-2013-08-18/uglifyjs2.js'
    ],
    optimized: false,
    author: 'Mihai Bazon',
    link: 'https://github.com/mishoo/UglifyJS2',
    defaultOn: false,
    age: 'retrieved from http://lisperator.net/uglifyjs/#demo on 2013-08-18 (or send me a proper build)',
    getParser: function(exports, win){
      return function(str){
        win.UglifyJS.parse(str);
      };
    }
  },{
    name:'UglifyJS',
    files: [
      root+'uglifyjs/parse.js'
    ],
    optimized: false,
    author: 'Mihai Bazon',
    link: 'https://github.com/mishoo/UglifyJS',
    defaultOn: false,
    age: '? (old)',
    getParser: function(exports){
      return exports.uglifyjs;
    }
  },{
    name: 'ZeParser',
    files: [
      root+'zeparser-2012-07-03/Tokenizer.js',
    ],
    optimized: false,
    author: 'Peter van der Zee',
    link: 'http://github.com/qfox/ZeParser',
    defaultOn: false,
    age: '2012-07-03',
    getParser: function(exports, win){
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
