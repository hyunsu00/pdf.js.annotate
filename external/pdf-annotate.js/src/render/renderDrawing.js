import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';
import { ToSmoothLines, smoothing } from '../utils/smoothLines';

function renderPath(lines) {
	const _lines = ToSmoothLines(lines, smoothing.SmoothCurves);
	let d = [];
	if (_lines.length > 0) {
		d.push(`M${_lines[0][0]} ${_lines[0][1]}`);
		for (let i = 1, l = _lines.length; i < l; i++) {
			let p1 = _lines[i];
			let p2 = _lines[i + 1];
			if (p2) {
				d.push(`L${p1[0]} ${p1[1]}`);
			}
		}
	}

	let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	setAttributes(path, {
		d: `${d.join(' ')}`
	});

	return path;
}

/**
 * Create SVGPathElement from an annotation definition.
 * This is used for anntations of type `drawing`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGPathElement} The path to be rendered
 */
 export default function renderDrawing(a) {
	let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

	a.paths.forEach((lines) => {
		let path = renderPath(lines);
		group.appendChild(path);
	});

	setAttributes(group, {
    stroke: normalizeColor(a.strokeColor),
    strokeWidth: a.strokeWidth,
    strokeOpacity: a.strokeOpacity,
    strokeLinecap: 'round', /* butt(디폴트) | round | square */
    strokeLinejoin: 'round', 	/* arcs | bevel | miter(디폴트) | miter-clip | round */
    strokeDasharray: 'none',
    fill: 'none',
    fillOpacity: a.fillOpacity
  });

	return group;
}
