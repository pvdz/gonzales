(function(Gonzales){

var root = '../data/sources/';

Gonzales.sources = [{
    name: 'jquery',
    url: root+'jquery.js',
    defaultUsed: true,
    loaded: false
},{
    name: 'mootools',
    url: root+'mootools.js',
    defaultUsed: true,
    loaded: false
},{
    name: 'prototype',
    url: root+'prototype.js',
    defaultUsed: true,
    loaded: false
},{
    name: 'dojo',
    url: root+'dojo.js',
    defaultUsed: true,
    loaded: false
},{
    name: 'pegjs',
    url: root+'../parsers/pegjs/JavaScript.js',
    defaultUsed: true,
    loaded: false
},{
    name: '8mb',
    url: root+'8mb-benchmark.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'ballgame',
    url: root+'ballgame.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'extjs-min',
    url: root+'extjs-min.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'jsgb',
    url: root+'jsgb.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'mochiscript',
    url: root+'mochiscript.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'objectivej',
    url: root+'objectivej.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'sunspider',
    url: root+'sunspider.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'swfobject',
    url: root+'swfobject.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'tetris',
    url: root+'tetris.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'twitch',
    url: root+'twitch.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'twitter',
    url: root+'twitter.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'v8bench',
    url: root+'v8bench.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'yui',
    url: root+'yui.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'zimbra',
    url: root+'zimbra.js',
    defaultUsed: false,
    loaded: false
},{
    name: 'bonsai',
    url: root+'bonsai.iframe-0.3.1.min.js',
    defaultUsed: false,
    loaded: false
}];


})(typeof window != 'undefined' ? window.Gonzales : require('../src/gonzales').Gonzales);
