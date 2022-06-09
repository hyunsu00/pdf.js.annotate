import PDFJSAnnotate from '../PDFJSAnnotate';
import { appendChild } from '../render/appendChild';
import {
  disableUserSelect,
  enableUserSelect,
  findSVGAtPoint,
  getMetadata,
  convertToSvgPoint,
  addFormNode,
  addChildFormNode
} from './utils';
import { fireEvent } from './event';
import { setSelectNode } from './selector';

let _enabled = false;
let _candraw = false;
let _penSize;
let _penColor;
let _annotationId = null;
let _pageId = null;

let path;
let lines = [];


/**
 * Handle document.touchdown or document.pointerdown event
 * @param {PointerEvent} e The DOM event to be handled
 */
function handleDocumentPointerdown(e) {
  path = null;
  lines = [];
  _candraw = true;
  /* if (!e.srcElement.classList.contains('annotationLayer')) {
    return;
  } */
  e.preventDefault();
}

/**
 * Handle document.pointerup event
 *
 * @param {PointerEvent} e The DOM event to be handled
 */
function handleDocumentPointerup(e) {
  saveToStorage(e.clientX, e.clientY);
}

function saveToStorage(x, y) {
  _candraw = false;

  if (lines.length <= 1) {
    return;
  }
  let svg = findSVGAtPoint(x, y);
  if (!svg) {
    return;
  }

  let { documentId, pageNumber } = getMetadata(svg);
  let storeAdapter = PDFJSAnnotate.getStoreAdapter();

  if (!_annotationId) {
    storeAdapter.addAnnotation(documentId, pageNumber, {
      type: 'drawing',
      strokeWidth: _penSize,
      strokeColor: _penColor,
      strokeOpacity: 1,
      strokeDasharray: 'none',
      paths: [lines, ]
    }).then((annotation) => {
      _annotationId = annotation.uuid;
      _pageId = annotation.page;
      if (path) {
        path.parentNode.removeChild(path);
      }
      addFormNode(documentId, pageNumber, annotation, svg);
    });
  } else {
    let target = svg.querySelector('[data-pdf-annotate-id="' + _annotationId + '"]');
    if (target) {
      {
        // 부모노드(svg)로 부터 제거
        path.parentNode.removeChild(path);
        // 패스의 그리기 좌표 제외한 모든 속성 삭제
        {
          let drawnValue = path.getAttribute('d');
          while(path.attributes.length > 0) {
            path.removeAttribute(path.attributes[0].name);
          }
          path.setAttribute('d', drawnValue);    
        }
        // 부모노드(g)에 패스 추가
        target.appendChild(path);
      }
    }

    storeAdapter.getAnnotation(documentId, _annotationId).then((annotation) => {
      const targetId = annotation.uuid;
      const undoStr = JSON.stringify(annotation);
      {
        annotation.paths.push(lines);
        storeAdapter.editAnnotation(documentId, _annotationId, annotation);  
      }
      const redoStr = JSON.stringify(annotation);

      addChildFormNode(documentId, pageNumber, targetId, {undo : {str : undoStr}, redo : {str : redoStr}});
    });
  }
  
}

/**
 * Handle document.mousemove event
 *
 * @param {PointerEvent} e The DOM event to be handled
 */
function handleDocumentPointermove(e) {
  if (_candraw) {
    savePoint(e.clientX, e.clientY);
  }
}

/**
 * Handle document.keyup event
 *
 * @param {KeyboardEvent} e The DOM event to be handled
 * } e The DOM event to be handled
 */
function handleDocumentKeyup(e) {
  // Cancel rect if Esc is pressed
  if (e.keyCode === 27) {
    lines = null;
    path.parentNode.removeChild(path);
    document.removeEventListener('pointermove', handleDocumentPointermove);
    document.removeEventListener('pointerup', handleDocumentPointerup);
  }
}

/**
 * Save a point to the line being drawn.
 *
 * @param {Number} x The x coordinate of the point
 * @param {Number} y The y coordinate of the point
 */
function savePoint(x, y) {
  let svg = findSVGAtPoint(x, y);
  if (!svg) {
    return;
  }

  let rect = svg.getBoundingClientRect();
  let point = convertToSvgPoint([
    x - rect.left,
    y - rect.top
  ], svg);
  point[0] = point[0].toFixed(2);
  point[1] = point[1].toFixed(2);
  lines.push(point);

  if (lines.length <= 1) {
    return;
  }

  if (path) {
    path.parentNode.removeChild(path);
  }

  path = appendChild(svg, {
    type: 'path',
    strokeColor: _penColor,
    strokeOpacity: 1,
    strokeWidth: _penSize,
    strokeDasharray: 'none',
    lines
  });
}

/**
 * Set the attributes of the pen.
 *
 * @param {Number} penSize The size of the lines drawn by the pen, rounded to 2 decimal places
 * @param {String} penColor The color of the lines drawn by the pen
 */
export function setPen(penSize = 1, penColor = '000000') {
  _penSize = Math.round(parseFloat(penSize) * 1e2) / 1e2;
  _penColor = penColor;
}

/**
 * Return pen attributes of the pen
 *
 * @return {Object} Object with size and color
 */
export function getPen() {
  return {
    strokeWidth: _penSize,
    strokeColor: _penColor
  };
}

/**
 * Enable the pen behavior
 */
export function enablePen() {
  if (_enabled) {
    return;
  }

  _enabled = true;
  
  // Chrome and Firefox has different behaviors with how pen works, so we need different events.
  document.addEventListener('pointerdown', handleDocumentPointerdown);
  document.addEventListener('pointermove', handleDocumentPointermove);
  document.addEventListener('pointerup', handleDocumentPointerup);

  document.addEventListener('keyup', handleDocumentKeyup);
  disableUserSelect();
}

/**
 * Disable the pen behavior
 */
export function disablePen() {
  if (!_enabled) {
    return;
  }

  // 펜종료시 그려진 펜을 선택한다.
  if (_pageId && _annotationId) {
    const svg = document.querySelector(`svg[data-pdf-annotate-page="${_pageId}"]`);
    if (svg) {
      setSelectNode(svg.querySelector('[data-pdf-annotate-id="' + _annotationId + '"]'));
    }
  }

  _enabled = false;
  _annotationId = null;
  _pageId = null;

  document.removeEventListener('pointerdown', handleDocumentPointerdown);
  document.removeEventListener('pointermove', handleDocumentPointermove);
  document.removeEventListener('pointerup', handleDocumentPointerup);

  document.removeEventListener('keyup', handleDocumentKeyup);
  enableUserSelect();
}
