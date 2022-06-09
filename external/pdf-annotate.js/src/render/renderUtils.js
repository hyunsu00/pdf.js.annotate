import setAttributes from '../utils/setAttributes';

export function calcUnionRect(rectangles)
{
  let left, top,right,bottom;
  rectangles.forEach((r) => {
    left = (left !== null && left !== undefined) ? Math.min(left, r.x) : r.x;
    right = (right !== null && right !== undefined) ? Math.max(right, r.x + r.width) : r.x + r.width;
    top = (top !== null && top !== undefined) ? Math.min(top, r.y) : r.y;
    bottom = (bottom !== null && bottom !== undefined) ? Math.max(bottom, r.y + r.height) : r.y + r.height;
  });

  return { 
    x: left, 
    y: top, 
    width: right - left, 
    height: bottom - top
  };
}

export function createRect(r) {
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  setAttributes(rect, {
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height
  });

  return rect;
}

export function createTransparentRect(r) {
  let rect = createRect(r);

  setAttributes(rect, {
    fillOpacity: 0,
    strokeOpacity: 0,
  });

  return rect;
}
