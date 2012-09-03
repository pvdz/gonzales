(function(exports){

var Gonzales = exports.Gonzales = {
  parsers: [],
  sources: [],

  init: function(parsers, sources){
    Gonzales.createSourceTds();
    Gonzales.createParserTds();

    var allSourceToggle = false;
    document.getElementById('top-left').onclick = function(){
      allSourceToggle = !allSourceToggle;
      Array.prototype.slice.call(document.querySelectorAll('.check-source'),0).forEach(function(e){
        e.checked = allSourceToggle;
      });
    };
  },
  createSourceTds: function(){
    Gonzales.sources.forEach(Gonzales.createSourceTd);
  },
  createSourceTd: function(source){
    // var e = <tr><td><input type="checkbox"/></td><td>{source.name}</td></tr>
    // if (source.defaultUsed) e{input}.checked = true; // ugly :(
    // ${.sources}.appendChild(e);

    var e = document.createElement('tr');
    var f = document.createElement('td');
    f.innerHTML = '<input type="checkbox"'+(source.defaultUsed?' checked':'')+' class="check-source"/>';
    e.appendChild(f);
    var f = document.createElement('td');
    f.innerHTML = source.name+'<br/>';
    e.appendChild(f);
    var tbody = document.querySelector('.sources');
    tbody.appendChild(e);
    source.tr = e;
  },
  createParserTds: function(){
    Gonzales.parsers.forEach(Gonzales.createParserTd);
  },
  createParserTd: function(parser){
    if (parser.special) return;
    parser.tds = {};

    Gonzales.createParserTh(parser);

    Gonzales.sources.forEach(Gonzales.createParserSourceTd.bind(this, parser));
  },
  createParserSourceTd: function(parser, source){
    // var e = <td/>;

    var e = document.createElement('td');
    source.tr.appendChild(e);
    parser.tds[source.name] = e;
  },
  createParserTh: function(parser){
    var e = document.createElement('th');
    e.innerHTML =
      parser.name+'<br/>' +
      (parser.optimized?'<small><i>optimized</i></small><br/>':'')+
      '<a href="'+parser.link+'" target="_blank">link</a><br/>'+
      '<input type="checkbox" '+(parser.defaultOn?'checked':'')+'/>';
    e.title = 'By '+parser.author;
    document.querySelector('.row-runner').appendChild(e);
    parser.tds.head = e;
  },
  GET: function(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        try { xhr.status; // status is a getter, this checks for exception
        } catch (e) {
          callback(new Error("Warning: Unknown error with server request (timeout?)."));
        }

        if (xhr.status == 200) callback(null, xhr.responseText);
        else callback(new Error("File request problem (code: "+xhr.status+")!"));
      }
    };
    xhr.open("GET", url+'?'+Math.random());
    xhr.send(null);
  },

  sourcesToLoad: [],
  parsersToLoad: [],
  profile: false,
  testQueue: [],
  run: function(profile){
    Gonzales.profile = profile === true;
    Gonzales.sourcesToLoad = [];
    Gonzales.parsersToLoad = [];
    Gonzales.testQueue = [];

    Gonzales.gatherTests(Gonzales.bench);

    if (Gonzales.testQueue.length == 0) {
        return console.log("Either no sources or no parsers selected, or neither.");
    }

    Gonzales.nextSource();

    Gonzales.nextParser();
  },
  gatherTests: function(bench, options){
    options = options || {};
    var queue = {};
    var byRandom = exports.document ? document.getElementById('by-random').checked : options.order == 'random';
    var bySource = exports.document ? document.getElementById('by-source').checked : options.order == 'source';
    var byParser = exports.document ? document.getElementById('by-parser').checked : options.order == 'parser';
    if (byRandom) queue = [];

    Gonzales.sources.forEach(function(source){
      if (source.tr ? source.tr.querySelector('input').checked : source.defaultUsed) {
        if (!source.loaded) Gonzales.sourcesToLoad.push(source);

        Gonzales.parsers.forEach(function(parser){
          if ((parser.tds ? parser.tds.head.querySelector('input').checked : parser.defaultOn) && !parser.special) {
            if (!parser.loaded && Gonzales.parsersToLoad.indexOf(parser) < 0) Gonzales.parsersToLoad.push(parser);
            if (parser.tds) parser.tds[source.name].style.backgroundColor = 'yellow';

            // this is the actual test to run
            var test = function(){ bench(parser, source); };

            if (byRandom) {
              queue.push(test);
            } else if (bySource) {
              if (!queue[source.name]) queue[source.name] = [];
              queue[source.name].push(test);
            } else if (byParser) {
              if (!queue[parser.name]) queue[parser.name] = [];
              queue[parser.name].push(test);
            }
          }
        });
      }
    });

    if (byRandom) {
      while (queue.length) {
        Gonzales.testQueue.push(queue.splice(Math.floor(Math.random()*queue.length), 1)[0]);
      }
    } else if (bySource) {
      var sources = Object.keys(queue);
      Gonzales.testQueue = [].concat.apply(Gonzales.testQueue, sources.map(function(s){ return queue[s]; }));
    } else if (byParser) {
      var parsers = Object.keys(queue);
      Gonzales.testQueue = [].concat.apply(Gonzales.testQueue, parsers.map(function(p){ return queue[p]; }));
    }

    if (!Gonzales.testQueue.length) console.log("No tests selected or no order selected");
  },
  nextSource: function again(){
    if (Gonzales.sourcesToLoad.length == 0) Gonzales.finishedLoading();
    else {
      var source = Gonzales.sourcesToLoad.pop();
      Gonzales.GET(source.url, function(err, str){
        if (err) {
          console.log("Load failed...", source, err);
        } else {
          source.loaded = str;
          source.tr.children[1].innerHTML += Math.round(str.length/1024)+'k';
          again();
        }
      });
    }
  },
  nextParser: function again(files){
    if (Gonzales.parsersToLoad.length == 0) Gonzales.finishedLoading();
    else {
      // queue is false if first call or last call was last for one parser
      if (!files) {
        var source = Gonzales.parsersToLoad[Gonzales.parsersToLoad.length-1];
        files = source.files.slice(0);
      }
      var url = files.shift();
      Gonzales.GET(url, function(err, str){
        if (err) {
          console.log("Load failed...", url, err);
        } else {
          var e = document.createElement('script');
          e.appendChild(document.createTextNode(str));
          document.body.appendChild(e);

          if (files.length) again(files);
          else {
            var parser = Gonzales.parsersToLoad.pop();
            parser.loaded = true;

            again();
          }
        }
      });
    }
  },
  finishedLoading: function(toLoad){
    if (Gonzales.sourcesToLoad.length || Gonzales.parsersToLoad.length) return; // not yet finished loading

    document.getElementById('total').innerHTML = '/ '+Gonzales.testQueue.length;

    if (Gonzales.profile) console.profile();

    Gonzales.drainQueue();
  },
  drainQueue: function again(){
    document.getElementById('progress').innerHTML = Gonzales.testQueue.length;
    if (Gonzales.testQueue.length) {
      var f = Gonzales.testQueue.shift();
//            var f = Gonzales.testQueue.splice(Math.floor(Math.random()*Gonzales.testQueue.length), 1)[0];
      setTimeout(function(){
        f();
        again();
      }, 100);
    } else {
      document.getElementById('progress').innerHTML = 'done';
      if (Gonzales.profile) {
        console.profileEnd();
        console.log("Check out Profile tab! :)");
      }
    }
  },
  bench: function(parser, source){
    // so we have the benchmark in benchmarkFile and `parser` has a function to use the parser...
    var parse = parser.getParser(window);
    var total = 0;
    var min = Infinity;
    var max = -Infinity;
    var failed = false;
    // we'll repeat this step 10x, no pause
    for (var i=0; i<10 && !failed; ++i) {
      try {
        var start = Date.now();
        parse(source.loaded);
        var done = Date.now();
        var time = done-start;
        total += time;
        min = Math.min(min, time);
        max = Math.max(max, time);
      } catch (e) {
        failed = true;
        console.error(parser.name+' crashed:', e);
      }
    }

    var td = parser.tds[source.name];
    if (failed) {
      td.innerHTML = 'crash';
      td.style.backgroundColor = 'orange';
    } else {
      td.innerHTML = (total/10)+'ms<br/>'+min+' ~ '+max;
      td.style.backgroundColor = 'transparent';
    }
  },


  // node stuff


  nodeLoadSources: function(){
    var fs = require('fs');
    Gonzales.sourcesToLoad.forEach(function(source){
      var path = require('path');
      console.log("reading", path.resolve('gonzales/'+source.url))
      source.loaded = fs.readFileSync(path.resolve('gonzales/'+source.url)).toString('utf-8');
    });
  },
  nodeLoadParsers: function(){
    Gonzales.parsersToLoad.forEach(function(parser){
      if (parser.files.length > 1) {
        // hack for zeparser during development... and maybe something i should use generically

        var s = '';
        var fs = require('fs');
        parser.files.forEach(function(file){
          s += '\n// ### '+file+' ###\n';
          console.log('Reading: '+__dirname+'/'+file)
          s += fs.readFileSync(__dirname+'/'+file);
        });

        s += ';\n\nmodule.exports = {Par:Par};';
        fs.writeFileSync(__dirname+'/../build/'+parser.name+'.js', s);

        parser.loaded = require(__dirname+'/../build/'+parser.name+'.js');
      } else {
        parser.loaded = require(parser.files[0]);
      }
    });
  },
  nodeDrain: function again(){
    if (Gonzales.testQueue.length) {
      setTimeout(function(){
        Gonzales.testQueue.shift()();
        again();
      }, 100);
    } else {
      console.log('Done!');
    }
  },
  nodeBench: function(parser, source){
    console.log("Running "+parser.name+'('+source.name+')...');
    // so we have the benchmark in benchmarkFile and `parser` has a function to use the parser...

    var parse = parser.getParser(parser.loaded);
    var total = 0;
    var min = Infinity;
    var max = -Infinity;
    var failed = false;
    // we'll repeat this step 10x, no pause
    for (var i=0; i<10 && !failed; ++i) {
      try {
        var start = Date.now();
        parse(source.loaded);
        var done = Date.now();
        var time = done-start;
        total += time;
        min = Math.min(min, time);
        max = Math.max(max, time);
      } catch (e) {
        failed = true;
        console.log("Crashed");
        console.log(e.message);
      }
    }

    if (!failed) {
      console.log(((total-(min+max))/8)+'ms: '+min+' ~ '+max);
    }
  },
};


})(this);
