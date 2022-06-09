// selector.js
import { fireEvent } from './event';
import {
  findSVGContainer
} from './utils';
import {
  createEditOverlay,
  destroyEditOverlay
} from './overlay';

let _pageID;
let _targetID;
let _selectState;

export function setSelectNode(target, unSelected = false) {
  let targetID, pageID;
  if (!target) {
    targetID = null, pageID = null;
  } else {
    targetID = target.getAttribute('data-pdf-annotate-id');
    pageID = target.parentNode.getAttribute('data-pdf-annotate-page');
  }

  const selectNodeID = getSelectNodeID();
  if (selectNodeID && selectNodeID != targetID) {
		// text, point 클릭시에는 해제되지 않도록 체크 추가
		if (!unSelected && !_selectState) {
    	const selectNode = getSelectNode();
    	_unSelectNode(selectNode);
		} else {
			_selectState = true
		}
  } 

  if (target) {
    _selectNode(target);
  }

	_selectState = unSelected;
}

export function getSelectNode() {
  let selectNode = null;
  if (_pageID && _targetID) {
    const svg = document.querySelector(`svg[data-pdf-annotate-page="${_pageID}"]`);
    selectNode = svg.querySelector('[data-pdf-annotate-id="' + _targetID + '"]')
  }
  
  return selectNode;
}

export function getSelectPageID() {
  return _pageID;
}

export function getSelectNodeID() {
  return _targetID;
}

function _unSelectNode(targetEl) {
  console.log('call selctor::_unSelectNode(targetEl = ', targetEl, ')');
  // let parentNode = findSVGContainer(targetEl).parentNode;
  // let annotationId = targetEl.getAttribute('data-pdf-annotate-id');
  // let annotationLayer = parentNode.querySelectorAll(".annotationLayer");
  // for(var i = 0; i< annotationLayer.length; i++) {
  //   let targetId = annotationLayer[i].getAttribute('data-target-id');
  //   annotationLayer[i].style.border = `none`;
  //   if(annotationId == targetId) {
  //     annotationLayer[i].style.border = `none`;
  //     break;
  //   }
  // }
  destroyEditOverlay();

  _pageID = null;
  _targetID = null;
  fireEvent('annotation:unSelected', targetEl);
}

function _selectNode(targetEl) {
  console.log('call selctor::_selectNode(targetEl = ', targetEl, ')');
  let rect = createEditOverlay(targetEl);

  _targetID = targetEl.getAttribute('data-pdf-annotate-id');
  _pageID = targetEl.parentNode.getAttribute('data-pdf-annotate-page');
  fireEvent('annotation:selected', targetEl, rect);
}
