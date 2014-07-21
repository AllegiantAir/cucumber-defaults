'use strict';

var Q = require('q'),
    _ = require('lodash'),
    fs = require('fs'),
    csv = require('ya-csv'),
    async = require('async'),
    config = require('node-yaml-config'),
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
              console.log('ok');
              if(!csvPattern.exec(inFile)) {
                console.log("Error: file " + inFile + " is not a csv file!");
                i += 2;
                // Will eventually add in error
                next();
              }
              console.log(inFile);
              if(fs.existsSync(inFile)) {
                // Open up the file and parse the csv into
                // A 2-D array
                console.log('building reader');
                var reader = csv.createCsvStreamReader(inFile, {
                  'separator': config.separator,
                  'quote': config.quote,
                  'escape': config.escape,
                  'comment': config.comment
                }).addListener('data', function(data) {
                  console.log(data);
                  i ++;
                  next();
                });
              } else {
                console.log("Error: file " + inFile + " does not exist!");
                i ++;
                next();
              }
            } else {
              i ++;
              next();
            }
          }, function(err) {

          });
          for(var i = 0; ; i ++) {
            
          }
        }
      );
    });
  },
  function reject(reason) {}
);

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