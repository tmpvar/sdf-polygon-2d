var polygon = require('polygon');
var vec2 = require('vec2');
var createClassifier = require('point-in-big-polygon');
module.exports = createSDF;

var min = Math.min;
var max = Math.max;

function createSDF(polygons) {

  var polys = polygons.map(function(points) {
    return polygon(points);
  });

  polys.sort(function(a, b) {
    return a.area() - b.area();
  });

  var l = polys.length;
  var holes = Array(l);
  holes[0] = false;

  for (var ci = 1; ci<l; ci++) {
    var pi = ci-1;
    holes[ci] = polys[ci].contains(polys[pi]);
  }

  var scratch = vec2();

  var classify = createClassifier(polygons);
  var s = [0, 0];

  return function evaluate(x, y) {
    scratch.x = x;
    scratch.y = y;
    s[0] = x;
    s[1] = y;

    var d = Infinity;

    for (var i=0; i<l; i++) {
      var cd = polys[i].closestPointTo(scratch).distance(scratch);
      if (holes[i] && d < cd) {
        d = -d;
      }
      d = min(cd, d);
    }

    return classify(s) > 0 ? -d : d;
  }
}
