(function(exports){

var Gonzales = exports.Gonzales = {
  parsers: [],
  sources: [],
  stats: {},

  sourcesToLoad: [],
  parsersToLoad: [],
  sourcesLoaded: false,
  parsersLoaded: false,

  profile: false,
  testQueue: [],
  benchCount: 10,
  keepGoing: false,
  lastTd: null,
  allowWarmup: false,

  stop: true,

  init: function(parsers, sources){
    Gonzales.createSourceTds();
    Gonzales.createParserTds();

    var allSourceToggle = false;
    var allParserToggle = false;
    document.getElementById('top-left').onclick = function(){
      allSourceToggle = !allSourceToggle;
      Array.prototype.slice.call(document.querySelectorAll('.check-source'),0).forEach(function(e){
        e.checked = allSourceToggle;
        Gonzales.toggleRow(e);
      });
    };
    document.getElementById('top-left-right').onclick = function(){
      allParserToggle = !allParserToggle;
      Array.prototype.slice.call(document.querySelectorAll('.row-runner>th>input'),0).forEach(function(e){
        if (e.checked === allParserToggle) e.click({target:e});
      });
    };
  },
  createSourceTds: function(){
    Gonzales.sources.forEach(Gonzales.createSourceTd);
  },
  createSourceTd: function(source){
    var tr = document.createElement('tr');
    tr.className = source.defaultUsed ? 'on' : 'off';
    source.tr = tr;

    var tdInput = document.createElement('td');
    tdInput.innerHTML = '<input type="checkbox"'+(source.defaultUsed?' checked':'')+' class="check-source"/>';

    var input = tdInput.firstElementChild;
    input.onclick = function(e){ Gonzales.toggleRow(e.target); };
    tr.appendChild(tdInput);

    var tdName = document.createElement('td');
    tdName.innerHTML = source.name+'<br/>';
    tr.appendChild(tdName);

    document.querySelector('.sources').appendChild(tr);
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
    e.className = parser.defaultOn ? 'on' : 'off';
    source.tr.appendChild(e);
    parser.tds[source.name] = e;
  },
  createParserTh: function(parser){
    var th = document.createElement('th');
    th.setAttribute('data-path', parser.files[0]);
    th.setAttribute('data-title', parser.name);
    th.innerHTML =
      parser.name+'<br/>' +
      (parser.optimized?'<small><i>optimized</i></small><br/>':'')+
      '<a href="'+parser.link+'" target="_blank">link</a><br/>'+
      '<input type="checkbox" '+(parser.defaultOn?'checked':'')+'/>';
    th.title = 'By '+parser.author;
    th.onclick = function(e){
      if (e.target.tagName === 'A') return;

      var input = th.querySelector('input');
      if (e.target !== input) input.checked = !input.checked;

      var value = input.checked ? 'on' : 'off';
      var tds = parser.tds;

      for (var key in tds) {
        tds[key].className = value;
      }
    };
    document.querySelector('.row-runner').appendChild(th);
    parser.tds.head = th;
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

  toggleRow: function(e){
    var p = e.parentNode.parentNode;
    p.className = e.checked ? 'on' : 'off';
  },

  /**
   * Run the benchmark
   *
   * @param {boolean} [profile=false] Call console.profile() and console.profileEnd()
   * @param {number} [count=10] Number of runs per parser
   */
  run: function(profile, count, keepGoing, allowWarmup){
    Gonzales.stop = false;
    Gonzales.profile = profile === true;
    Gonzales.sourcesToLoad = [];
    Gonzales.parsersToLoad = [];
    Gonzales.testQueue = [];
    Gonzales.benchCount = count || 10;
    Gonzales.keepGoing = keepGoing;
    Gonzales.sourcesLoaded = false;
    Gonzales.parsersLoaded = false;
    Gonzales.allowWarmup = allowWarmup;
    Gonzales.lastTd = null;
    Gonzales.gatherTests(Gonzales.bench);
    Gonzales.stats = {};

    if (Gonzales.testQueue.length == 0) {
        return console.log("Either no sources or no parsers selected, or neither.");
    }

    Gonzales.nextSource();
    Gonzales.nextParser(false);
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
    if (Gonzales.sourcesToLoad.length == 0) {
      Gonzales.sourcesLoaded = true;
      Gonzales.finishedLoading();
    } else {
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
    if (Gonzales.parsersToLoad.length == 0) {
      Gonzales.parsersLoaded = true;
      Gonzales.finishedLoading();
    } else {
      // queue is false if first call or last call was last for one parser
      if (!files) {
        var next = Gonzales.parsersToLoad[Gonzales.parsersToLoad.length-1];
        files = next.files.slice(0);
        next.exports = window.exports = {_exportsFor:next.name};
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
  finishedLoading: function(){
    if (!Gonzales.sourcesLoaded || !Gonzales.parsersLoaded) return; // not yet finished loading

    document.getElementById('total').innerHTML = '/ '+Gonzales.testQueue.length;

    if (Gonzales.profile) console.profile();

    Gonzales.drainQueue();
  },
  drainQueue: function again(benchCount){
    if (Gonzales.stop) return;
    document.getElementById('progress').innerHTML = Gonzales.testQueue.length;
    if (Gonzales.testQueue.length) {
      var f = Gonzales.testQueue.shift();
      if (Gonzales.keepGoing) Gonzales.testQueue.push(f);
      setTimeout(function(){
        f();
        again(benchCount);
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
    var parse = parser.getParser(parser.exports, window);

    var key = parser.name + ' > ' + source.name;
    if (!Gonzales.stats[key]) Gonzales.stats[key] = {count:0};
    var stats = Gonzales.stats[key];

    parser.min = Infinity;
    parser.max = -Infinity;
    parser.results = [];

    var total = stats.total || 0;
    var min = stats.min || Infinity;
    var max = stats.max || -Infinity;
    var failed = false;

    // we'll repeat this step x times, no pause
    for (var i = 0, count = Gonzales.benchCount; i<count && !failed && !Gonzales.stop; ++i) {
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
        console.error(parser.name+' crashed:', e.toString());
      }
    }

    if (Gonzales.allowWarmup && !stats.warmedUp) {
      stats.warmedUp = true;
    } else {
      stats.min = min;
      stats.max = max;
      stats.total = total;
      stats.count += i;
    }

    var td = parser.tds[source.name];
    if (failed) {
      td.innerHTML = 'crash';
      td.style.backgroundColor = 'orange';
    } else {
      var a = (total/stats.count) + '';
      if (a.indexOf('.') >= 0) a = a.slice(0, a.indexOf('.')+3);
      td.innerHTML = a+'ms<br/>'+min+' ~ '+max+' ('+stats.count+'x)';

      if (Gonzales.keepGoing) {
        if (Gonzales.allowWarmup && !stats.count) {
          td.innerHTML = 'warmup<br>('+min+' ~ '+max+')';
        }
        if (Gonzales.lastTd) Gonzales.lastTd.removeAttribute('style');
        Gonzales.lastTd = td;
        if (!Gonzales.stop) td.style.backgroundColor = 'yellow';
      } else {
        td.removeAttribute('style');
      }
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

        if (parser.name === 'ZeParser2') s += ';\n\nmodule.exports = {Par:Par};';
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
      console.log('\nDone!');
    }
  },
  nodeBench: function(parser, source){
    console.log("Running "+parser.name+' => ('+source.name+') ...');
    // so we have the benchmark in benchmarkFile and `parser` has a function to use the parser...

    var parse = parser.getParser(parser.loaded, parser.loaded);
    var total = 0;
    var min = parser.min || Infinity;
    var max = parser.max || -Infinity;
    var failed = false;

    // we'll repeat this step n times, no pause
    for (var i=0; i<Gonzales.benchCount && !failed; ++i) {
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

    parser.min = min;
    parser.max = max;
    parser.count += i;

    if (!failed) {
      console.log(((total-(min+max))/8)+'ms: '+min+' ~ '+max);
    }
  },
};


})(this);
