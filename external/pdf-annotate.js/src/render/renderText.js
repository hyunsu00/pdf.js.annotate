import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';

/**
 * Create SVGTextElement from an annotation definition.
 * This is used for anntations of type `textbox`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGTextElement} A text to be rendered
 */
export default function renderText(a) {
  // Text should be rendered at 0 degrees relative to
  // document rotation
  let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  let decoration;
  if (a.textDecoration.underline && a.textDecoration.linethrough) {
    decoration = 'underline line-through';
  } else if (a.textDecoration.underline) {
    decoration = 'underline';
  } else if (a.textDecoration.linethrough) {
    decoration = 'line-through';
  } else {
    decoration = 'none';
  }

  setAttributes(text, {
    x: a.x,
    y: a.y,
    fill: normalizeColor(a.fontColor),
    fontFamily: a.fontFamily,
    fontSize: a.fontSize * a.scale,
    fontStyle: a.fontStyle,
    fontWeight: a.fontWeight,
    textDecoration: decoration,
    transform: `rotate(${a.rotation})`,
    style: 'white-space: pre'
  });
  text.innerHTML = a.content;

  let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.appendChild(text);

  return g;
}
