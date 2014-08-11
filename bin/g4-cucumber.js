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
    sys = require('sys'),
    spawn = require('child_process').spawn,
    base = process.cwd();

var ls = Q.denodeify(fs.readdir),
    write = Q.denodeify(fs.writeFile),
    open = Q.denodeify(fs.open),
    rename = Q.denodeify(fs.rename);

var featurePattern = /.feature?/,
    csvPattern = /.csv?/;

// Used for rolling back files when there
// is an issue. We do not run our suite
// if not everything is successful.
var promiseArray = [];

ls('./features').then(
  function resolve(files) {
    _(files).forEach(function(fileName) {
      if(!featurePattern.exec(fileName))
        return;

      var defer = Q.defer();

      (function(fileName,defer) {
        getFile('/features/' + fileName).then(
          function resolve(fileString) {
            buildFiles(fileName, fileString, defer);
          }, function(reason) {
            // If getfile doesn't work
            defer.reject({
              reason: reason
            })
          }
        );
        promiseArray.push(defer.promise);
      })(fileName,defer);
    });
    Q.allSettled(promiseArray).then(function(results) {
      resultHandler(results);
    });
  },
  function reject(reason) {
    // I'm not sure what the error is going to be
    // but I don't think we have to do anything at
    // this point
  }
);

function rollback(results) {
  // We need to cover all of
  _.forEach(results, function(result) {
    var revert = result.state === 'fulfilled' ? result.value : result.reason;
    try {
    fs.unlinkSync(revert.run);
    fs.renameSync(revert.backup, revert.revert);
    } catch(err) {}
  });
};

function resultHandler(results) {
  if(_.contains(results.state, 'rejected')) {
    rollback(results);
    return;
  }

  var cucumber = spawn('./node_modules/.bin/cucumber.js',process.argv.slice(2));

  cucumber.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  cucumber.stderr.on('data', function(data) {
    console.log(data.toString());
  });

  cucumber.on('close', function(code) {
    rollback(results);
    process.exit(code);
  });
};

function buildFiles(fileName, fileString, cucumberDefer) {

  var lines = fileString.split('\n'),
              i = 0;

  async.whilst(function() {
    if(i < lines.length) {
      return true;
    } else {
      var newFile = lines.join("\n");

      // Write file with replaced test data
      write(base + '/features/run-' + fileName, newFile).then(
        function() {
          // We have our file name which we want to change
          // so that we don't double run our test suite
          rename(base + '/features/' + fileName, base + '/features/' + fileName + '-backup').then(
            function() {
              // I'm not sure what to do once we finish renaming our files.
              // We might want to then resolve our defer. If all defers
              // are successful then we run our test suite.
              cucumberDefer.resolve({
                backup: base + '/features/' + fileName + '-backup',
                run: base + '/features/run-' + fileName,
                revert: base + '/features/' + fileName,
                fileName: fileName
              });
            },
            function(reason) {
              // If we fail in this state, then we need to remove
              // our feature/run
              cucumberDefer.reject({
                reason: reason,
                backup: base + '/features/' + fileName,
                run: base + '/features/run-' + fileName,
                revert: base + '/features/' + fileName,
                fileName: fileName
              });
            }
          );
        },
        function(reason) {
          // I'm not sure what we should do if writting the file
          // doesn't work. We could probably abort whatever happens
          // here and we wouldn't have to worry about rolling back.
          cucumberDefer.reject(reason);
        }
      );

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