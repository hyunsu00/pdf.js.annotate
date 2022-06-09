import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';

/**
 * Create SVGLineElements from an annotation definition.
 * This is used for anntations of type `strikeout`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGGElement} A group of all lines to be rendered
 */
export default function renderLine(a) {
  let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  setAttributes(group, {
    stroke: normalizeColor(a.strokeColor),
    strokeOpacity: a.strokeOpacity,
    strokeWidth: a.strokeWidth,
    strokeDasharray: a.strokeDasharray
  });

  if (a.lines.length === 2) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    let p1 = a.lines[0];
    let p2 = a.lines[a.lines.length - 1];
    setAttributes(line, {
      x1: p1[0],
      y1: p1[1],
      x2: p2[0],
      y2: p2[1]
    });

    group.appendChild(line);
  }

  return group;
}
