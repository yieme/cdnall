'use strict';

function setupDefaultCdnPaths(db) {
  if (!db.available) db.available = {}
  var available = {
    cdnjs: "https://cdnjs.cloudflare.com/ajax/libs/{package}/{version}/{file}",
    jsdelivr: "https://cdn.jsdelivr.net/{package}/{version}/{file}",
  }
  db.available = available
  return db
}

module.exports = setupDefaultCdnPaths
