'use strict';

var Q = require('q'),
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    csvConfig = {
      escape: "\r",
      separator: ","
    },
    Stream = require('stream'),
    base = process.cwd();

var ls = Q.denodeify(fs.readdir),
    write = Q.denodeify(fs.writeFile),
    open = Q.denodeify(fs.open);

var featurePattern = /.feature?/,
    csvPattern = /.csv?/;

ls('./features').then(
  function resolve(files) {
    _(files).forEach(function(fileName) {
      if(!featurePattern.exec(fileName))
        return;

      getFile('/features/' + fileName).then(
        function resolve(fileString) {
          
          var lines = fileString.split('\n'),
              i = 0;

          async.whilst(function() {
            if(i < lines.length) {
              return true;
            } else {
              var newFile = lines.join("\n");
              write(base + '/features/copy-' + fileName, newFile);
              return false;
            }
          }, function(next) {
            
            if( lines[i].trim() === 'Example File:' && (i + 1 < lines.length) ) {
            
              var inFile = lines[i + 1].trim();
              if(!csvPattern.exec(inFile)) {
                console.log("Error: file " + inFile + " is not a csv file!");
                i += 2;
                // Will eventually add in error
                next();
              }

              readCsv(fs, inFile).then(
                function _resolve(pipeTable) {
                  lines.splice(i,1, 'Examples:');
                  lines.splice(i + 1, 1, pipeTable);
                  i ++;
                  next();
                }, function _reject(reason) {
                  console.log('reason: ' + reason);
                }
              );

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

function readCsv(fs, inFile) {
  function getPipeRow(csvLine) {
    var csvCols = csvLine.split(csvConfig.separator);
    var row = '|';
    for(var j = 0; j < csvCols.length; j ++) {
      row += ' ' + csvCols[j] + ' |';
    }
    return row + "\n";
  }

  return Q.Promise(function(resolve, reject, notify) {

    if(fs.existsSync(inFile)) {
      getFile('/' + inFile).then(
        function _resolve(fileString) {
          var csvLines = fileString.split(csvConfig.escape);
          var examples = getPipeRow(csvLines[0]);
          for(var i = 1; i < csvLines.length; i ++) {
            examples += getPipeRow(csvLines[i]);
          }
          resolve(examples);
        },
        function _reject(reason) {
          reject(reason);
        }
      );

    } else {
      reject(new Error('File does not exist!'));
    }

  });
}

function getFile(file) {
  // Reads in the file and resolves a fileString
  return open(base + file,'r').then(
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