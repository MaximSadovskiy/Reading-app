const fs = require('fs');
const path = require('path');

function findAppSubfolder(directoryPath, callback) {
 fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return
    }

    files.forEach(file => {
      const fullPath = path.join(directoryPath, file);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          return
        }

        if (stats.isDirectory()) {
          if (file === 'booksStorage') {
            console.log('Found "booksStorage" subfolder at:', fullPath);
            callback(null, fullPath);
          } else {
            findAppSubfolder(fullPath, callback);
          }
        }
      });
    });
 });
}

// Example usage
findAppSubfolder('/..', (err, path) => {
});
