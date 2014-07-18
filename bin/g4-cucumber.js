'use strict';

var Q = require('q'),
    _ = require('lodash'),
    fs = require('fs'),
    async = require('async'),
    base = process.cwd();

var ls = Q.denodeify(fs.readdir),
    open = Q.denodeify(fs.open);

ls('./features').then(
  function resolve(files) {
    _(files).forEach(function(file) {
      getFile(file).then(
        function resolve(file) {
          file.then(
          function resolve(fileString) {
            console.log('******************************');
            console.log(fileString);
            console.log('******************************');
          }
        );
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