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
  // 모든 페이지 주석 저장 및 다운로드
  const docId = PDFViewerApplication.baseUrl;
  let pdfDocument = PDFViewerApplication.pdfDocument;
  let pagePromises = [];
  pdfDocument.getData().then((data) => {
    let pdfAnnotateWriter = new PDFAnnotateWriter.AnnotationFactory(data);
    const pagesCount = PDFViewerApplication.pagesCount;
    for (let i = 1; i <= pagesCount; i++) {
      pagePromises.push(pdfDocument.getPage(i));
    }

    let annotationsPromises = [];
    Promise.all(pagePromises).then(function (allPages) {
      allPages.forEach((page) => {
        annotationsPromises.push(AnnotateRender.getAnnotations(docId, page._pageIndex + 1));
      });

      Promise.all(annotationsPromises).then(function (allAnnotations) {
        allAnnotations.forEach((annotations) => {
          let annotationPage = undefined;
          for (const page of allPages) {
            if (page._pageIndex + 1 === annotations.pageNumber) {  
              annotationPage = page;
              break;
            }
          }
          
          if (annotationPage) {
            const viewport = annotationPage.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS});
            const width = annotationPage.view[2];
            const height = annotationPage.view[3];
            const scaleX = width / viewport.width;
            const scaleY = height / viewport.height;
            for (let i = 0; i < annotations.annotations.length; i++) {
              let annotation = annotations.annotations[i];
              let x_y = [annotation.x * scaleX, height - annotation.y * scaleY];
              let coordinates = [x_y[0], x_y[1], x_y[0] + annotation.width * scaleY, x_y[1] - annotation.height * scaleY];
              if (annotation.type === "area") {
                pdfAnnotateWriter.createSquareAnnotation(annotations.pageNumber - 1, coordinates.slice(), null, null);
              }
            }
          }
        });
        pdfAnnotateWriter.download();
      });
    });
  });
});
