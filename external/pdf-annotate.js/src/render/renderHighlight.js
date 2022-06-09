import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';
import {createRect} from './renderUtils';

/**
 * Create SVGRectElements from an annotation definition.
 * This is used for anntations of type `area` and `highlight`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGGElement|SVGRectElement} A group of all rects to be rendered
 */
export default function renderHighlight(a) {
	let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	setAttributes(group, {
		fill: normalizeColor(a.fillColor),
		fillOpacity: 0.2
	});

	a.rectangles.forEach((r) => {
		group.appendChild(createRect(r));
	});

	return group;
}
