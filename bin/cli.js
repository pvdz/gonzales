#!/usr/bin/env node

var Gonzales = require('../src/gonzales').Gonzales;
require('../data/parsers.js');
require('../data/sources.js');

Gonzales.gatherTests(Gonzales.nodeBench, {order:'parser'});
Gonzales.nodeLoadSources();
Gonzales.nodeLoadParsers();
Gonzales.nodeDrain();
