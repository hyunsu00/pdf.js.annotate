import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';

/**
 * Create SVGRectElements from an annotation definition.
 * This is used for anntations of type `area`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGGElement|SVGRectElement} A group of all rects to be rendered
 */
export default function renderRect(a) {
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  setAttributes(rect, {
    x: a.x,
    y: a.y,
    width: a.width,
    height: a.height
  });

  setAttributes(rect, {
    fill: normalizeColor(a.fillColor),
    fillOpacity: a.fillOpacity,
    stroke: normalizeColor(a.strokeColor),
    strokeOpacity: a.strokeOpacity,
    strokeWidth: a.strokeWidth,
    strokeDasharray: a.strokeDasharray
  });

  return rect;
}
