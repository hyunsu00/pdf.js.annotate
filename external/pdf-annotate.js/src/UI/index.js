import { setSelectNode, getSelectNode, getSelectNodeID, getSelectPageID} from './selector';
import { addEventListener, removeEventListener, fireEvent } from './event';
import { disableEdit, enableEdit, deleteAnnotation } from './edit';
import { disablePen, enablePen, setPen } from './pen';
import { disableArrow, enableArrow, setArrow } from './arrow';
import { disableEraser, enableEraser } from './eraser';
import { disablePoint, enablePoint } from './point';
import { disableRect, enableRect, saveRect } from './rect';
import { disableCircle, enableCircle, setCircle, addCircle } from './circle';
import { disableText, enableText, setTextSize, setTextColor, setTextBold, setTextItalic, setTextUnderline, setTextStrikethrough } from './text';
import { createPage, renderPage } from './page';
import { disableLine, enableLine, setLine } from './line';
import { addFormNode, addChildFormNode, modifyFormNode, removeFormNode } from './utils';

export default {
  setSelectNode,
  getSelectNode,
  getSelectNodeID,
  getSelectPageID,

  addEventListener,
  removeEventListener,
  fireEvent,

  disableEdit,
  enableEdit,
  deleteAnnotation,

  disablePen,
  enablePen,
  setPen,

  disablePoint,
  enablePoint,

  disableRect,
  enableRect,
  saveRect,

  disableCircle,
  enableCircle,
  setCircle,
  addCircle,

  disableArrow,
  enableArrow,
  setArrow,

  disableEraser,
  enableEraser,

  disableText,
  enableText,
  setTextSize,
  setTextColor,
  setTextBold,
  setTextItalic,
  setTextUnderline,
  setTextStrikethrough,

  createPage,
  renderPage,

  disableLine,
  enableLine,
  setLine,

  addFormNode, 
  addChildFormNode, 
  modifyFormNode,
  removeFormNode
};
