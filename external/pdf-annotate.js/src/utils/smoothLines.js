export const smoothing = {
  NoSmoothing : 1,
  SharpCurves : 4,
  SmoothCurves : 8,
  VerySmoothCurves : 12,
  SuperSmoothCurves : 16,
  HyperSmoothCurves : 20
};
Object.freeze(smoothing);

export const ToSmoothPoints = function(points, smoothingSize = smoothing.SmoothCurves) {

  if (smoothingSize === smoothing.NoSmoothing) {
    return points;
  }

  let _buffer = [];
  const appendToBuffer = function (point) {
    _buffer.push(point);
    while (_buffer.length > smoothingSize) {
      _buffer.shift();
    }
  };

  const getAveragePoint = function (offset) {
    let len = _buffer.length;
    if (len % 2 === 1 || len >= smoothingSize) {
      let totalX = 0;
      let totalY = 0;
      let count = 0;
      for (let i = offset; i < len; i++) {
        count++;
        let point = _buffer[i];
        totalX += point.x;
        totalY += point.y;
      }
      return {
          x: totalX / count,
          y: totalY / count
      }
    }

    return null;
  };

  let _points = [];
  _points.push(points[0]);

  for (let i = 1; i < points.length; i++) {
    appendToBuffer(points[i]);

    let point = getAveragePoint(0);
    if (point) {
      _points.push(point);

      if (i + 1 === points.length) {
        for (let offset = 2; offset < _buffer.length; offset += 2) {
          point = getAveragePoint(offset);
          if (point) {
            _points.push(point);
          }
        }
      }
    }
  }

  return _points;
}

export const ToSmoothLines = function(lines, smoothingSize = smoothing.SmoothCurves) {

  if (smoothingSize === smoothing.NoSmoothing) {
    return lines;
  }

  // 스트링 좌표를 숫자형 좌표로 변환
  let points = [];
  for (let i = 0; i < lines.length; i++) {
    points.push({x: Number(lines[i][0]), y: Number(lines[i][1])});
  }

  // 부드러운 좌표로 변환
  points = ToSmoothPoints(points, smoothingSize);

  // 숫자형 좌표를 스트링 좌표로 변환
  let _lines = [];
  for (let i = 0; i < points.length; i++) {
    _lines.push([points[i].x.toFixed(2), points[i].y.toFixed(2)]);
  }

  return _lines;
};

export default {
	smoothing,
	ToSmoothPoints,
	ToSmoothLines
}
