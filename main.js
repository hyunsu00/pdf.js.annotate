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
  saveAnnotation(PDFViewerApplication.baseUrl, PDFViewerApplication.pdfDocument)
    .then(pdfAnnotateWriter => pdfAnnotateWriter.download());
});

async function saveAnnotation(docId, pdfDocument) {
  // low data를 얻어온다.
  let data = await pdfDocument.getData();
  
  let pdfAnnotateWriter = new PDFAnnotateWriter.AnnotationFactory(data);
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
        let x_y = [annotation.x * scaleX, height - annotation.y * scaleY];
        let coordinates = [x_y[0], x_y[1], x_y[0] + annotation.width * scaleX, x_y[1] - annotation.height * scaleY];
        pdfAnnotateWriter.createSquareAnnotation(pageIndex, coordinates.slice(), null, null);
      } else if (annotation.type == "highlight") {
        for (let k = 0; k < annotation.rectangles.length; k++) {
          let annotationX = annotation.rectangles[k].x;
          let annotationY = annotation.rectangles[k].y;
          let annotationWidth = annotation.rectangles[k].width;
          let annotationHeight = annotation.rectangles[k].height;
          let x_y = [annotationX * scaleX, height - annotationY * scaleY];
          let coordinates = [x_y[0], x_y[1], x_y[0] + annotationWidth * scaleX, x_y[1] - annotationHeight * scaleY];
          pdfAnnotateWriter.createHighlightAnnotation(pageIndex, coordinates.slice(), null, null);
        }
      } else if (annotation.type == "drawing") {
        let coordinates = [];
        for (let k = 0; k < annotation.lines.length; k++) {
          coordinates.push(Number(annotation.lines[k][0]) * scaleX);
          coordinates.push(height - Number(annotation.lines[k][1]) * scaleY);
        }
        pdfAnnotateWriter.createPolyLineAnnotation(
          pageIndex, coordinates.slice(0, 4), null, null, coordinates.slice(4, coordinates.length), {
          r: 0,
          g: 0,
          b: 0,
        });
      } else if (annotation.type == "strikeout") {
        for (let k = 0; k < annotation.rectangles.length; k++) {
          let annotationX = annotation.rectangles[k].x;
          let annotationY = annotation.rectangles[k].y - (annotation.rectangles[k].height / 2);
          let annotationWidth = annotation.rectangles[k].width;
          let annotationHeight = annotation.rectangles[k].height;
          let x_y = [annotationX * scaleX, height - annotationY * scaleY];
          let coordinates = [x_y[0], x_y[1], x_y[0] + annotationWidth * scaleX, x_y[1] - annotationHeight * scaleY];
          pdfAnnotateWriter.createStrikeOutAnnotation(pageIndex, coordinates, null, null, { r: 255, g: 0, b: 0 });
        }
      } else if (annotation.type == "textbox") {
        // !!! 텍스트의 rect 영역을 구해야만 정확한 저장을 완료할수 있다.
        let x_y = [annotation.x * scaleX, height - annotation.y * scaleY];
        const textWidth = 500;
        const textHeight = 80;
        let ta = pdfAnnotateWriter.createFreeTextAnnotation({
          page: pageIndex,
          rect: [x_y[0], x_y[1], x_y[0] + textWidth * scaleX, x_y[1] + (textHeight * scaleY)],
          contents: annotation.content,
          color: {r: 255, g: 255, b: 255},
          textColor: {r: 128, g: 128, b: 128},
          fontSize: annotation.size
        });
        ta.createDefaultAppearanceStream();
      } else if (annotation.type == "point") {
        let x_y = [annotation.x * scaleX, height - annotation.y * scaleY];
        const iconSize = 25;
        let comment = await AnnotateRender.getStoreAdapter().getComments(docId, annotation.uuid);
        pdfAnnotateWriter.createTextAnnotation({
          page: pageIndex,
          rect: [x_y[0], x_y[1] - (iconSize * scaleY), x_y[0] + iconSize * scaleX, x_y[1]],
          contents: comment[0].content,
          open: false,
          icon: 0, // == AnnotationIcon.Comment,
        });
      }
    }
  }

  return pdfAnnotateWriter;
}