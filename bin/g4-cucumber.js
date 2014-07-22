'use strict';

var Q = require('q'),
    _ = require('lodash'),
    fs = require('fs'),
    csv = require('csv'),
    async = require('async'),
    config = require('node-yaml-config'),
    Stream = require('stream'),
    base = process.cwd();

var ls = Q.denodeify(fs.readdir),
    open = Q.denodeify(fs.open);

var featurePattern = /.feature?/,
    csvPattern = /.csv?/;

config = config.load(base + "/config/csv-config.yaml","csv");
ls('./features').then(
  function resolve(files) {
    _(files).forEach(function(fileName) {
      if(!featurePattern.exec(fileName))
        return;

      getFile(fileName).then(
        function resolve(fileString) {
          var lines = fileString.split('\n'),
              i = 0;
          async.whilst(function() {
            return i < lines.length;
          }, function(next) {
            if( lines[i].trim() === 'Example File:' && (i + 1 < lines.length) ) {
              var inFile = lines[i + 1].trim();
              if(!csvPattern.exec(inFile)) {
                console.log("Error: file " + inFile + " is not a csv file!");
                i += 2;
                // Will eventually add in error
                next();
              }
              try {
                readCsv(fs, inFile, i, next);
              } catch(err) {
                console.log(err);
                i ++;
                next();
              }
            } else {
              i ++;
              next();
            }
          }, function(err) {

          });
        }
      );
    });
  },
  function reject(reason) {}
);

function readCsv(fs, inFile, i, next) {
  var pipeTable = '';

  if(fs.existsSync(inFile)) {
    var fileReadStream = fs.createReadStream(inFile, {
      flags: 'r',
      encoding: 'utf8',
      fd: null,
      autoClose: true
    });

    var readStream = new Stream();
    readStream.on('data', function(data) {
      console.log('some data: ' + data);
      return 'data';
    });

    readStream.write = function(data) {
      return 'hello';
    };

    readStream.end = function(data) {
      console.log('end: ' + data);
      return 'hello';
    };



    var transformStream = csv.transform(function(record) {
      var pipeRecord = '';
      for(var j = 0; j < record.length; j ++) {
        if(j = 0)
          pipeRecord = '| ' + record[j] + ' |';
        else
          pipeRecord += ' ' + record[j] + ' |';
      }
      pipeRecord += "\n";
      pipeTable += pipeRecord;
      return pipeRecord; 
    });

    transformStream.on('finish', function() {
      console.log('hi' + pipeTable);
      return pipeTable;
    });

    transformStream.on('end', function() {
      console.log('end emmited');
    });

    transformStream.on('readable', function() {
      console.log('can read');
    });

    var transform = fileReadStream.
    pipe(
      csv.parse()
    ).pipe(
      readStream
    ).pipe(process.stdout);
    
    transform.on('finished', function() {
      console.log('end');
      next();
    });
  } else {
    console.log("Error: file " + inFile + " does not exist!");
    i ++;
    next();
  }
}

function getFile(file) {
  // Reads in the file and resolves a fileString
  return open(base + '/features/' + file,'r').then(
    function resolve(fd) {
      var position = 0,
          defer = Q.defer(),
          fileString = '';

      (function readMore(fileString) {
        fs.read(fd, new Buffer(100), 0, 100, position, function(err, bytesRead, inBuff) {
          function writeBuffer() {
            fileString += inBuff.slice(0,bytesRead).toString();
            position += bytesRead;
          }
          if(bytesRead < 100) {
            position += bytesRead;
            writeBuffer();
            defer.resolve(fileString);
          } else {
            writeBuffer();
            readMore(fileString);
          };
        });
      })(fileString);
      return defer.promise;
    },
    function reject(err) {
      console.log(err);
    }
  );
};