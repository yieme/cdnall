'use strict';

function setupDefaultCdnPaths(db) {
  if (!db.available) db.available = {}
  var available = {
    cdnjs:     "https://cdnjs.cloudflare.com/ajax/libs/{package}/{version}/{file}",
    jsdelivr:  "https://cdn.jsdelivr.net/{package}/{version}/{file}",
    google:    "https://ajax.googleapis.com/ajax/libs/{package}/{version}/{file}",
    bootstrap: "https://maxcdn.bootstrapcdn.com/{package}/{version}/{file}"
  }
  db.available = available
  return db
}

module.exports = setupDefaultCdnPaths
