#!/usr/bin/env node

var Gonzales = require('../src/gonzales').Gonzales;
require('../data/parsers.js');
require('../data/sources.js');

Gonzales.gatherTests(Gonzales.nodeBench, {order:'parser'});
console.log('Fetching resources:');
Gonzales.nodeLoadSources();
Gonzales.nodeLoadParsers();
console.log('\nDraining queue');
Gonzales.nodeDrain();
