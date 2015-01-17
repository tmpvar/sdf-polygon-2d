var test = require('tape')
var createSDF = require('./sdf-polygon-2d');

test('square', function(t) {

  var points = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var sdf = createSDF([points]);

  t.equal(sdf(0, 0), -10)
  t.equal(sdf(10, 0), 0)
  t.equal(sdf(20, 0), 10)
  t.end();
});

test('square with hole', function(t) {

  var hull = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var hole = [
    [-5, -5],
    [-5,  5],
    [ 5,  5],
    [ 5, -5]
  ];

  var sdf = createSDF([hull, hole]);

  t.equal(sdf(0, 0), 5)
  t.equal(sdf(-7.5, 0), -2.5)
  t.equal(sdf(-5, 0), 0)
  t.equal(sdf(20, 0), 10)
  t.end();
});
