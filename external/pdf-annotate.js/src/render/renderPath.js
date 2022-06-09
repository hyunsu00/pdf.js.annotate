import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';
import { ToSmoothLines, smoothing } from '../utils/smoothLines';

/**
 * Create SVGPathElement from an annotation definition.
 * This is used for anntations of type `drawing`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGPathElement} The path to be rendered
 */
export default function renderPath(a) {
  let d = [];
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  const lines = ToSmoothLines(a.lines, smoothing.SmoothCurves);

  if (lines.length > 0) {
    d.push(`M${lines[0][0]} ${lines[0][1]}`);
    for (let i = 1, l = lines.length; i < l; i++) {
      let p1 = lines[i];
      let p2 = lines[i + 1];
      if (p2) {
        d.push(`L${p1[0]} ${p1[1]}`);
      }
    }
  }

  setAttributes(path, {
    d: `${d.join(' ')}`, // `${d.join(' ')}Z`,
    stroke: normalizeColor(a.strokeColor),
    strokeWidth: a.strokeWidth,
    strokeOpacity: a.strokeOpacity,
    strokeLinecap: 'round', /* butt(디폴트) | round | square */
    strokeLinejoin: 'round', 	/* arcs | bevel | miter(디폴트) | miter-clip | round */
    strokeDasharray: 'none',
    fill: 'none',
    fillOpacity: a.fillOpacity,
  });

  return path;
}
