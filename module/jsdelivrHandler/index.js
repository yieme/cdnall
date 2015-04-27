'use strict';

var semver = require('semver')
/*
"PACKAGE_NAME": {
  "cdn": "PRIMARY_CDN",
  "files": ["FILENAME,LIST"],
  "mains": ["FILENAME"]
  "latest": "VERSION",
  "VERSION": {
    "CDN": {
      "file": FILES_INDEX
      "main": MAINS_INDEX
    }
  }
} */


String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function guessMainFile(packname, files) {
  if (packname.endsWith('.js')) packname = packname.substr(0, -3) // drop .js from package name
  var guesses = []
  guesses.push(packname + '.min.js')
  guesses.push(packname + '.js')
  guesses.push(packname + '.min.css')
  guesses.push(packname + '.css')
  guesses.push('.min.js')
  guesses.push('.js')
  guesses.push('.min.css')
  guesses.push('.css')
  for (var i = 0; i < guesses.length; i++) {
    var guess = guesses[i]
    for (var j = 0; j < files.length; j++) {
      if (files[j].endsWith(guess)) return files[j]
    }
  }
  return files[0]
}

function sortedFilenameArray(files) {
  var result = []
  for (var i=0; i<files.length; i++) {
    var file = files[i]
    var filename = (typeof file === 'string') ? file : file.name
    result.push(filename)
  }
  result.sort()
  return result
}

function jsdelivrHandler(db, pack, cdnName) {
  cdnName  = cdnName || 'jsdelivr'
  if (!pack.name || !pack.lastversion || pack.lastversion.indexOf('.js') > 0) {
      if (!db.unusable) db.unusable = []
      db.unusable.push(pack)
      return db
  }

  var dbPack = db.packages[pack.name] || {
    cdn: cdnName,
    latest: "",
    files: [],
    mains: []
  }

  var bothValid  = semver.valid(pack.lastversion) && semver.valid(dbPack.latest)
  if (dbPack.latest === "" || (bothValid && semver.gt(pack.lastversion, dbPack.latest)) || (!bothValid && pack.lastversion < dbPack.latest)) {
    dbPack.latest = pack.lastversion
  }
  var mainfile
  for (var i=0; i < pack.assets.length; i++) {
    var asset      = pack.assets[i]
    var version    = asset.version
    if (!version.endsWith('.md')) { // omit invalid version, todo: consider only including semver.valid()
      var files      = sortedFilenameArray(asset.files)
      mainfile       = pack.mainfile || guessMainFile(pack.name, files)
      var mainsIndex = dbPack.mains.indexOf(mainfile)
      if (mainsIndex < 0) {
        dbPack.mains.push(mainfile)
        mainsIndex   = dbPack.mains.indexOf(mainfile)
      }
      var assetFiles = files.join(',')
      var filesIndex = dbPack.files.indexOf(assetFiles)
      if (filesIndex < 0) {
        dbPack.files.push(assetFiles)
        filesIndex = dbPack.files.indexOf(assetFiles)
      }
      var versionPart = dbPack[asset.version] || {}
      if (mainsIndex === 0) {
        versionPart[cdnName] = filesIndex // file index only
      } else {
        versionPart[cdnName] = {
          file: filesIndex,
          main: mainsIndex
        }
      }
      dbPack[asset.version] = versionPart
    }
  }

  db.packages[pack.name] = dbPack
  return db
}


module.exports = jsdelivrHandler
