// _loads.js
'use strict';

var should = require('should')

describe('package', function() {
  var test

  it('loads', function() {
      test = require('../server.js')
      test.should.be.ok
  })

})
