import PDFJSAnnotate from '../PDFJSAnnotate';
import { appendChild } from '../render/appendChild';
import {
  BORDER_COLOR,
  findSVGAtPoint,
  getMetadata,
  convertToSvgPoint,
  addFormNode
} from './utils';
import { fireEvent } from './event';
import { setSelectNode } from "./selector";

let _enabled = false;
let input;
let _textSize;
let _textColor;
let _textBold;
let _textItalic;
let _textUnderline;
let _textStrikethrough;
/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMouseup(e) {
  if (input || !findSVGAtPoint(e.clientX, e.clientY)) {
    return;
  }

	// stylebar disable
  fireEvent('annotation:setStyleBarDisableState', true);

  input = document.createElement('input');
  input.setAttribute('id', 'pdf-annotate-text-input');
  input.setAttribute('placeholder', 'Enter text');
  input.style.border = `3px solid ${BORDER_COLOR}`;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = `${e.clientY}px`;
  input.style.left = `${e.clientX}px`;
  input.style.fontSize = `${_textSize}px`;
  input.style.zIndex = '41';
  input.addEventListener('blur', handleInputBlur);
  input.addEventListener('keyup', handleInputKeyup);

  document.body.appendChild(input);
  input.focus();
}

/**
 * Handle input.blur event
 */
function handleInputBlur() {
  saveText();
}

/**
 * Handle input.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleInputKeyup(e) {
  if (e.keyCode === 27) {
    closeInput();
  }
  else if (e.keyCode === 13) {
    saveText();
  }
}

/**
 * Save a text annotation from input
 */
function saveText() {
  let value = (input.value) ? input.value.replace(/ +$/, '') : '';
  if (value.length > 0) {
    let clientX = parseInt(input.style.left, 10);
    let clientY = parseInt(input.style.top, 10);
    let svg = findSVGAtPoint(clientX, clientY);
    if (!svg) {
      return;
    }
    let height = _textSize;
    let { documentId, pageNumber, viewport } = getMetadata(svg);
    let scale = 1 / viewport.scale;
    let rect = svg.getBoundingClientRect();
    let pt = convertToSvgPoint([
      clientX - rect.left,
      clientY - rect.top + height], svg, viewport);
    let annotation = {
      type: 'textbox',
      fontFamily: 'Helvetica',
      fontSize: _textSize,
      scale: scale,
      fontColor: _textColor,
      fontStyle: _textItalic,
      fontWeight: _textBold,
      textDecoration: {underline : _textUnderline, linethrough: _textStrikethrough},
      content: value,
      x: pt[0],
      y: pt[1],
      rotation: -viewport.rotation
    };
  
    PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
      .then((annotation) => {
        // true 상태 일경우 다음 click 이벤트가 호출되어도 셀렉션이 해제되지 않도록 한다. 디폴트는 false
        setSelectNode(addFormNode(documentId, pageNumber, annotation, svg), true);
      });
  }

  closeInput();
}

/**
 * Close the input
 */
function closeInput() {
  if (input) {
    input.removeEventListener('blur', handleInputBlur);
    input.removeEventListener('keyup', handleInputKeyup);
    document.body.removeChild(input);
    input = null;
  }
}

/**
 * Set the text attributes
 *
 * @param {Number} textSize The size of the text
 */
 export function setTextSize(textSize) {
  _textSize = parseInt(textSize, 10);
}

/**
 * Set the text attributes
 *
 * @param {String} textColor The color of the text
 */
 export function setTextColor(textColor) {
  _textColor = textColor;
}

/**
 * Set the text attributes
 *
 * @param {String} textBold The bold of the text
 */
 export function setTextBold(textBold) {
  _textBold = textBold;
}

/**
 * Set the text attributes
 *
 * @param {String} textItalic The italic of the text
 */
 export function setTextItalic(textItalic) {
  _textItalic = textItalic;
}

/**
 * Set the text attributes
 *
 * @param {String} textUnderline The underline of the text
 */
 export function setTextUnderline(textUnderline) {
  _textUnderline = textUnderline;
}

/**
 * Set the text attributes
 *
 * @param {String} textStrikethrough The strikethrough of the text
 */
 export function setTextStrikethrough(textStrikethrough) {
  _textStrikethrough = textStrikethrough;
}

/**
 * Enable text behavior
 */
export function enableText() {
  if (_enabled) {
    return;
  }

  _enabled = true;
  document.addEventListener('mouseup', handleDocumentMouseup);
}

/**
 * Disable text behavior
 */
export function disableText() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener('mouseup', handleDocumentMouseup);
}

