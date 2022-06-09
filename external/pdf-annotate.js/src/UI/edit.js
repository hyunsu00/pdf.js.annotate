import PDFJSAnnotate from '../PDFJSAnnotate';
import config from '../config';
import {
  findAnnotationAtPoint,
  findSVGAtPoint,
  getMetadata,
  removeFormNode
} from './utils';
import { fireEvent } from './event';
import { getOverlay } from './overlay';
import { getSelectNode, setSelectNode } from './selector';

let _enabled = false;

function handleDocumentClick(e) {
  console.log('call edit::handleDocumentClick(e = ', e, ')');
  if (!findSVGAtPoint(e.clientX, e.clientY)) {
    return;
  }

  let target = findAnnotationAtPoint(e.clientX, e.clientY);
  setSelectNode(target);
}

/**
 * Handle document.selectstart event
 *
 * @param {Event} e The DOM event that needs to be handled
 */
function handleDocumentSelectStart(e) {
  // 선택된 개체가 있을경우
  // preventDefault()는 현재 이벤트(selectstart)의 기본 동작을 중단한다.
  if (getSelectNode()) {
    e.preventDefault();
  }
}

/**
 * Delete currently selected annotation
 */
 export function deleteAnnotation() {
  const overlay = getOverlay();
  if (!overlay) {
    return;
  }

  let annotationId = overlay.getAttribute('data-target-id');
  let svg = overlay.parentNode.querySelector(config.annotationSvgQuery());
  let { documentId } = getMetadata(svg);

  // 오버레이 선택 삭제
  setSelectNode(null);

  // 주석 개체 삭제
  let storeAdapter = PDFJSAnnotate.getStoreAdapter();
  storeAdapter.getAnnotation(documentId, annotationId).then((annotation) => {

    let insertIndex = ((annotationId) => {
      let annotations = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];
      for (let i = 0, l = annotations.length; i < l; i++) {
        if (annotations[i].uuid === annotationId) {
          return i;
        }
      }
      return undefined;
    })(annotationId);

    storeAdapter.deleteAnnotation(documentId, annotationId).then(() => {
      let target = svg.querySelector(`[data-pdf-annotate-id="${annotationId}"]`);
      
      const targetId = annotation.uuid;
      let undoStr = JSON.stringify(annotation);
      let nextId = target.nextSibling ? target.nextSibling.getAttribute('data-pdf-annotate-id') : null;
      let redoStr = null;
      target.parentNode.removeChild(target);

      removeFormNode(documentId, annotation.page, targetId, {
        undo : {str : undoStr, nextId}, 
        redo : {str : redoStr}
      });
    });
  });

  fireEvent('annotation:setAnnotationSidebarEnable', false);
  fireEvent('annotation:setStyleBarDisableState', true);
}

/**
 * Enable edit mode behavior.
 */
export function enableEdit() {
  if (_enabled) {
    return;
  }

  _enabled = true;
  
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('selectstart', handleDocumentSelectStart);
};

/**
 * Disable edit mode behavior.
 */
export function disableEdit() {
  if (!_enabled) {
    return;
  }

  _enabled = false;

  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('selectstart', handleDocumentSelectStart);
  setSelectNode(null);
};
