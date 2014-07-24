var fs = require('fs');
var fileReadStream = fs.createReadStream('testData.csv');

fileReadStream.pipe(process.stdout);

// fileReadStream.on('data', function(data) {
//   process.stdout.write(data.toString());
// }).on('end', function() {
//   process.stdout.write("\nfinished\n");
// });