import { PixelsPerInch } from "pdfjs-lib";
import { PDFViewerApplication } from './external/pdf.js/web/app.js';
import { DEFAULT_SCALE } from "./external/pdf.js/web/ui_utils.js";
import("./external/pdf.js/web/viewer.js").then(() => {
  PDFViewerApplicationOptions.set("disablePreferences", true);
  PDFViewerApplicationOptions.set("defaultUrl", "/external/pdf.js/web/compressed.tracemonkey-pldi-09.pdf");
  PDFViewerApplicationOptions.set("imageResourcesPath", "/external/pdf.js/web/images/");
  PDFViewerApplicationOptions.set("cMapUrl", "/external/pdf.js/external/bcmaps/");
  PDFViewerApplicationOptions.set("standardFontDataUrl", "/external/pdf.js/external/standard_fonts/");
  PDFViewerApplicationOptions.set("workerSrc", "/external/pdf.js/src/worker_loader.js");
  PDFViewerApplicationOptions.set("sandboxBundleSrc", "/external/pdf.js/src/pdf.sandbox.js");
  PDFViewerApplicationOptions.set("pdf-annotate-render", webViewerAnnotateRender);
});
import "./lib/pdf-annotate-render.js";
import "./lib/pdf-annotate-writer.js";
import { undoRedo } from "./undo-redo.js";

let AnnotateRender = PDFAnnotateRender["default"];
const UI = AnnotateRender.UI;
AnnotateRender.setStoreAdapter(new AnnotateRender.LocalStoreAdapter());

function webViewerAnnotateRender({ parentNode, canvasWrapper, id, pdfPage, scale }) {
  let temp_div = document.createElement('div');
  temp_div.innerHTML = "<svg class=\"annotationLayer\"></svg>";
  let svg = temp_div.firstChild;
  parentNode.appendChild(svg);

  // svg 렌더링
  // == function scalePage(pageNumber, viewport, context)
  const viewport = pdfPage.getViewport({scale: scale});
  svg.setAttribute('width', viewport.width);
  svg.setAttribute('height', viewport.height);
  svg.style.width = canvasWrapper.style.width;
  svg.style.height = canvasWrapper.style.height;

  // == export default function render(svg, viewport, data)
  const docId = PDFViewerApplication.baseUrl;
  let AnnotateRender = PDFAnnotateRender["default"];
  AnnotateRender.getAnnotations(docId, id).then(function (annotations) {
    AnnotateRender.render(svg, viewport, annotations)
  });
}

let toolType = undefined;
function setActiveToolbarItem(type) {
  switch (toolType) {
    case "cursor":
      UI.disableEdit();
      break;
    case "eraser":
      UI.disableEraser();
      break;
    case "draw":
      UI.disablePen();
      break;
    case "arrow":
      UI.disableArrow();
      break;
    case "text":
      UI.disableText();
      break;
    case "point":
      UI.disablePoint();
      break;
    case "area":
    case "highlight":
    case "strikeout":
      UI.disableRect();
      break;
    case "circle":
    case "emptycircle":
    case "fillcircle":
      UI.disableCircle();
      break;
  }

  switch (type) {
    case "cursor":
      UI.enableEdit();
      break;
    case "eraser":
      UI.enableEraser();
      break;
    case "draw":
      UI.enablePen();
      break;
    case "arrow":
      UI.enableArrow();
      break;
    case "text":
      UI.enableText();
      break;
    case "point":
      UI.enablePoint();
      break;
    case "area":
    case "highlight":
    case "strikeout":
      UI.enableRect(type);
      break;
    case "circle":
    case "emptycircle":
    case "fillcircle":
      UI.enableCircle(type);
      break;
  }

  toolType = type;
}

function handleAnnotationClick(target) {
  console.log("click handleAnnotationClick");
}

function handleAnnotationBlur(target) {
  console.log("click handleAnnotationBlur");
}

UI.addEventListener("annotation:click", handleAnnotationClick);
UI.addEventListener("annotation:blur", handleAnnotationBlur);

// 선택
document.getElementById("cursor").addEventListener("click", (e) => {
  console.log("click cursor");
  setActiveToolbarItem("cursor");
});

// 직사각형 그리기
document.getElementById("area").addEventListener("click", (e) => {
  console.log("click area");
  UI.disableRect();
  setActiveToolbarItem("area");
});

// 강조
document.getElementById("highlight").addEventListener("click", (e) => {
  console.log("click highlight");
  UI.disableRect();
  setActiveToolbarItem("highlight");
});

// 자유형 그리기
document.getElementById("draw").addEventListener("click", (e) => {
  console.log("click draw");
  UI.disableRect();
  setActiveToolbarItem("draw");

  let penSize = 10;
  let penColor = "#E71F63";
  UI.setPen(penSize, penColor);
});

// 취소선
document.getElementById("strikeout").addEventListener("click", (e) => {
  console.log("click strikeout");
  setActiveToolbarItem("strikeout");
});

// 스티커 노트
document.getElementById("point").addEventListener("click", (e) => {
  console.log("click point");
  setActiveToolbarItem("point");
});

// 텍스트
document.getElementById("text").addEventListener("click", (e) => {
  console.log("click text");
  setActiveToolbarItem("text");

  let textSize = 48;
  let textColor = "#E71F63";
  UI.setText(textSize, textColor);
});

//
//
//
// 주석표시
document.getElementById("visible").addEventListener("click", (e) => {
  alert("주석표시 기능 구현이 되어있지 않음");

  console.log("click visible");
});
// 선 그리기
document.getElementById("line").addEventListener("click", (e) => {
  alert("선 그리기 기능 구현이 되어있지 않음");

  console.log("click line");
});
// 화살표 그리기
document.getElementById("arrow").addEventListener("click", (e) => {
  alert("화살표 그리기는 그려지지 않는 버그가 있음");

  console.log("click arrow");
  setActiveToolbarItem("arrow");
  let arrowSize = 10;
  let arrowColor = "#E71F63";
  UI.setArrow(arrowSize, arrowColor);
});
// 타원 그리기
document.getElementById("circle").addEventListener("click", (e) => {
  alert("타원 그리기는 사이즈 변경이 안됨");

  console.log("click circle");
  setActiveToolbarItem("circle");
});
// 밑줄
document.getElementById("underline").addEventListener("click", (e) => {
  alert("밑줄 기능 구현이 되어있지 않음");

  console.log("click underline");
});

//
//
//
// 다운로드
document.getElementById("download").addEventListener("click", (e) => {
  console.log("click download");
  writeAnnotation(PDFViewerApplication.baseUrl, PDFViewerApplication.pdfDocument)
    .then(writer => writer.download());
});

async function writeAnnotation(docId, pdfDocument) {
  // low data를 얻어온다.
  let data = await pdfDocument.getData();

  let writer = new PDFAnnotateWriter.AnnotationFactory(data);
  const pagesCount = PDFViewerApplication.pagesCount;
  for (let i = 1; i <= pagesCount; i++) {
    // page를 얻어온다.
    let page = await pdfDocument.getPage(i);
    // 주석을 얻어온다.
    let annotations = await AnnotateRender.getAnnotations(docId, page._pageIndex + 1);
    const viewport = page.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS});
    const width = page.view[2];
    const height = page.view[3];
    const scaleX = width / viewport.width;
    const scaleY = height / viewport.height;
    for (let j = 0; j < annotations.annotations.length; j++) {
      let annotation = annotations.annotations[j];
      let pageIndex = annotations.pageNumber - 1;
      if (annotation.type == "area") {
        const left = annotation.x * scaleX;
        const top = height - (annotation.y * scaleY);
        const right = left + (annotation.width * scaleX);
        const bottom = top - (annotation.height * scaleY);
        const value = {
          page: pageIndex,
          rect: [left, top, right, bottom],
          color: {r:255, g:0, b:0}
        };
        writer.createSquareAnnotation(value);
      } else if (annotation.type == "highlight") {
        for (let k = 0; k < annotation.rectangles.length; k++) {
          const rect = annotation.rectangles[k];
          const left = rect.x * scaleX;
          const top = height - (rect.y * scaleY);
          const right = left + (rect.width * scaleX);
          const bottom = top - (rect.height * scaleY);
          const value = {
            page: pageIndex,
            rect: [left, top, right, bottom],
            color: {r:1, g:1, b:0}
          };
          writer.createHighlightAnnotation(value);
        }
      } else if (annotation.type == "drawing") {
        let points = [];
        for (let k = 0; k < annotation.lines.length; k++) {
          let line = annotation.lines[k];
          let x = Number(line[0]), y = Number(line[1]);
          points.push(x * scaleX);
          points.push(height - (y * scaleY));
        }
        const value = {
          page: pageIndex,
          rect: [0, 0, width, height],
          inkList: points,
          color: {r:255, g:0, b:0}
        };
        writer.createInkAnnotation(value);
      } else if (annotation.type == "strikeout") {
        for (let k = 0; k < annotation.rectangles.length; k++) {
          const rect = annotation.rectangles[k];
          const left = rect.x * scaleX;
          const top = height - ((rect.y - (rect.height / 2)) * scaleY);
          const right = left + (rect.width * scaleX);
          const bottom = top - (rect.height * scaleY);
          const value = {
            page: pageIndex,
            rect: [left, top, right, bottom],
            color: {r:255, g:0, b:0}
          };
          writer.createStrikeOutAnnotation(value);
        }
      } else if (annotation.type == "point") {
        let comments = await AnnotateRender.getStoreAdapter().getComments(docId, annotation.uuid);
        const comment = comments[0];
        const iconSize = 25;
        const left = annotation.x * scaleX;
        const bottom = height - (annotation.y * scaleY);
        const right = left + (iconSize * scaleX);
        const top = bottom - (iconSize * scaleY);
        const value = {
          page: pageIndex,
          rect: [left, top, right, bottom],
          contents: comment.content,
          open: false,
          icon: 0, // == AnnotationIcon.Comment,
        };
        writer.createTextAnnotation(value);
      } else if (annotation.type == "textbox") {    
        const magicWidth = 2;
        const fontSize = annotation.size;
        const textSize = measureText(annotation.content, fontSize);
        const contents = annotation.content;
        const textColor = hexToRgb(annotation.color);
        const left = Math.floor(annotation.x * scaleX);
        const top = height - Math.floor(annotation.y * scaleY);
        const right = left + Math.floor(textSize.width * scaleX) + magicWidth; 
        const bottom = top + Math.floor(textSize.height * scaleY) + Math.floor((textSize.height - fontSize) / 2 * scaleY);
        let ta = writer.createFreeTextAnnotation({
          page: pageIndex,
          rect: [left, top, right, bottom],
          contents: contents,
          color: {r: 1, g: 1, b: 0},
          textColor: textColor,
          font: "Helvetica",
          fontSize: Math.floor(fontSize * scaleY),
          opacity: 0.5
        });
        ta.createDefaultAppearanceStream();  
      } 
    }
  }

  return writer;
}

function measureText(pText, pFontSize, pStyle) {
  var lDiv = document.createElement('div');

  document.body.appendChild(lDiv);

  if (pStyle != null) {
      lDiv.style = pStyle;
  }
  lDiv.style.fontSize = "" + pFontSize + "px";
  lDiv.style.position = "absolute";
  lDiv.style.left = -1000;
  lDiv.style.top = -1000;

  lDiv.textContent = pText;

  var lResult = {
      width: lDiv.clientWidth,
      height: lDiv.clientHeight
  };

  document.body.removeChild(lDiv);
  lDiv = null;

  return lResult;
}

function hexToRgb(color) {
  let hex = color.replace('#', '');
  let value = hex.match(/[a-f\d]/gi);
  if (value.length == 3) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
  value = hex.match(/[a-f\d]{2}/gi);
  let r = parseInt(value[0], 16);
  let g = parseInt(value[1], 16);
  let b = parseInt(value[2], 16);
  let rgb = {
      r: r,
      g: g,
      b: b
  }
  return rgb;
}

//
//
//
// Undo / Redo
document.getElementById("undo").addEventListener("click", (e) => {
  console.log("click undo");
  
  localStorage.clear();
  {
    let _object_to_save_or_restore = {};
    let myUndoRedo = undoRedo(10, _object_to_save_or_restore);
    myUndoRedo.save();
    _object_to_save_or_restore.x = [1, 2];
    myUndoRedo.save();
    _object_to_save_or_restore.x = [1, 2, 3];
    myUndoRedo.save();
    _object_to_save_or_restore.y = [4, 5, 6];
    myUndoRedo.save();

    myUndoRedo.undo();
    DeepAssign(_object_to_save_or_restore, JSON.parse(localStorage.lastSav));
    myUndoRedo.undo();
    DeepAssign(_object_to_save_or_restore, JSON.parse(localStorage.lastSav));
    myUndoRedo.undo();
    DeepAssign(_object_to_save_or_restore, JSON.parse(localStorage.lastSav));
    myUndoRedo.undo();
    DeepAssign(_object_to_save_or_restore, JSON.parse(localStorage.lastSav));
  }
});

document.getElementById("redo").addEventListener("click", (e) => {
  console.log("click redo");

  // console.log(localStorage.lastSav);
  // myUndoRedo.redo();
  // console.log(localStorage.stRedo);
  // console.log(localStorage.lastSav);
  // Object.assign(_object_to_save_or_restore, JSON.parse(localStorage.lastSav));
});

function DeepAssign(target, source) {
  // target === {} 로 만든다.
  for (var prop in target) {
    if (target.hasOwnProperty(prop)){
        delete target[prop];
    }
  }

  for (var prop in source) {
    target[prop] = source[prop];
  }
}
