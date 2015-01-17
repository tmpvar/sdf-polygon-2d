var polygon = require('polygon');
var vec2 = require('vec2');
var createClassifier = require('point-in-big-polygon');
module.exports = createSDF;

var min = Math.min;
var max = Math.max;
var abs = Math.abs;

function createSDF(polygons) {

  var polys = polygons.map(function(points) {
    return polygon(points);
  });

  polys.sort(function(a, b) {
    return  b.area() - a.area();
  });

  var l = polys.length;
  var holes = Array(l);
  var classifiers = Array(l);
  holes[0] = false;
  classifiers[0] = createClassifier([polygons[0]]);

  for (var ci = 1; ci<l; ci++) {
    var pi = ci-1;
    var contained;

    // find container
    while (pi > -1) {
      contained = polys[pi].containsPolygon(polys[ci])
      if (contained) {
        break;
      }
      pi--;
    }

    holes[ci] = contained ? !holes[pi] : false;

    classifiers[ci] = createClassifier([polygons[ci]]);
  }

  var scratch = vec2();
  var s = [0, 0];

  return function evaluate(x, y) {
    scratch.x = x;
    scratch.y = y;
    s[0] = x;
    s[1] = y;

    var d = Infinity;
    var closest = null;
    for (var i=0; i<l; i++) {
      var cd = polys[i].closestPointTo(scratch).distance(scratch);
      if (cd < d) {
        closest = i;
      }

      d = min(cd, d);
    }

    var inside = classifiers[closest](s) > 0;
    return (holes[closest] !== inside) ? -d : d;
  }
}
