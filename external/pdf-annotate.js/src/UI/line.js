import PDFJSAnnotate from '../PDFJSAnnotate';
import config from '../config';
import { appendChild } from '../render/appendChild';
import {
  disableUserSelect,
  enableUserSelect,
  findSVGAtPoint,
  convertToSvgPoint,
  getMetadata
} from './utils';
import { fireEvent } from './event';

let _enabled = false;
let _lineWidth;
let _lineColor;
let path;
let lines;

/**
 * Handle document.mousedown event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousedown(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!svg) {
    return;
  }

  path = null;
  lines = [];
  lines.push(_ToSvgPoint(svg, e.clientX, e.clientY));

  document.addEventListener('mousemove', handleDocumentMousemove);
  disableUserSelect();
}

/**
 * Handle document.mousemove event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousemove(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!svg || !lines || !lines.length) {
    return;
  }

  lines[1] = _ToSvgPoint(svg, e.clientX, e.clientY); // update end point

  if (path) {
    svg.removeChild(path);
  }
  let annotation = {
    type: 'line',
    color: _lineColor,
    width: _lineWidth,
    lines
  };
  path = appendChild(svg, annotation);
}

/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMouseup(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!svg || !lines || !lines.length) {
    return;
  }

  lines[1] = _ToSvgPoint(svg, e.clientX, e.clientY); // update end point
  let annotation = {
    type: 'line',
    color: _lineColor,
    width: _lineWidth,
    lines
  };
  let { documentId, pageNumber } = getMetadata(svg);
  PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
  .then((annotation) => {
    if (path) {
      svg.removeChild(path);
    }
    
    let child = appendChild(svg, annotation);
    fireEvent('annotation:appendChild', child, {undo : {value: null, str : null }, redo : {value : child, str : JSON.stringify(annotation)}});
  });

  document.removeEventListener('mousemove', handleDocumentMousemove);
  enableUserSelect();
}

/**
 * Handle document.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentKeyup(e) {
  // Cancel rect if Esc is pressed
  if (e.keyCode === 27) {
    lines = null;
    path.parentNode.removeChild(path);

    document.removeEventListener('mousemove', handleDocumentMousemove);
  }
}

function _ToSvgPoint(svg, clientX, clientY) {
  if (!svg) {
    return null;
  }

  let rect = svg.getBoundingClientRect();
  let point = convertToSvgPoint([
    clientX - rect.left,
    clientY - rect.top
  ], svg);

  return point;
}

/**
 * Set the attributes of the pen.
 *
 * @param {Number} penSize The size of the lines drawn by the pen, rounded to 2 decimal places
 * @param {String} penColor The color of the lines drawn by the pen
 */
export function setLine(lineWidth = 1, lineColor = '000000') {
  _lineWidth = Math.round(parseFloat(lineWidth) * 1e2) / 1e2;
  _lineColor = lineColor;
}

/**
 * Enable line behavior
 */
export function enableLine() {
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener('mouseup', handleDocumentMouseup);
  document.addEventListener('mousedown', handleDocumentMousedown);
  document.addEventListener('keyup', handleDocumentKeyup);
}

/**
 * Disable line behavior
 */
export function disableLine() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener('mouseup', handleDocumentMouseup);
  document.removeEventListener('mousedown', handleDocumentMousedown);
  document.removeEventListener('keyup', handleDocumentKeyup);
}

