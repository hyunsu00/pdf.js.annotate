import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';
import {calcUnionRect, createTransparentRect} from './renderUtils';

function createUnderline(r) {
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

  setAttributes(line, {
    x1: r.x,
    y1: r.y + r.height,
    x2: r.x + r.width,
    y2: r.y + r.height
  });

  return line;
}

/**
 * Create SVGLineElements from an annotation definition.
 * This is used for anntations of type `underline`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGGElement} A group of all lines to be rendered
 */
export default function renderUnderline(a) {
  let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  setAttributes(group, {
    stroke: normalizeColor(a.strokeColor),
    strokeWidth: a.strokeWidth
  });

  group.appendChild(createTransparentRect(calcUnionRect(a.rectangles)));
  a.rectangles.forEach((r) => {
    group.appendChild(createUnderline(r));
  });

  return group;
}
