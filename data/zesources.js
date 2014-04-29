(function(Gonzales){

  var root = '../data/sources/';

  Gonzales.sources = [{
    name: '16mb',
    url: root+'16mb-benchmark.js',
    defaultUsed: true,
    loaded: false
  },{
    name: '8mb',
    url: root+'8mb-benchmark.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'jquery',
    url: root+'jquery-1-6-1.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'pegjs',
    url: root+'../parsers/pegjs/JavaScript.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'mootools',
    url: root+'mootools.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'prototype',
    url: root+'prototype.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'dojo',
    url: root+'dojo.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'emscripten kate',
    url: root+'kate.js.jo.35mb.js',
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
  },{
    name: 'canjs',
    url: root+'can.dojo-2.0.4.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'philoGL',
    url: root+'PhiloGL-1.5.2.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'GLGE',
    url: root+'glge-compiled-0.9.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'Enchant',
    url: root+'enchant-0.8.0.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'Box2dweb',
    url: root+'box2dweb-2.1.a.3.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'fabricjs',
    url: root+'fabric-2013-01-04.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'jquery1.10',
    url: root+'jquery-1-10-2.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'crafty',
    url: root+'crafty.0.6.0.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'phaser',
    url: root+'phaser-1-1-3.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'threejs',
    url: root+'three-r64.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'pixi',
    url: root+'pixi-1.4.2.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'createjs',
    url: root+'createjs.min.2013-12-12.js',
    defaultUsed: false,
    loaded: false
  },{
    name: 'typescript',
    url: root+'typescript-2013-08-21.js',
    defaultUsed: false,
    loaded: false
  }];

})(typeof window != 'undefined' ? window.Gonzales : require('../src/gonzales').Gonzales);
