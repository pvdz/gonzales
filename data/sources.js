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
}];


})(typeof window != 'undefined' ? window.Gonzales : require('../src/gonzales').Gonzales);
