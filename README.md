# pdf.js.annotate

## 1. 패키지 인스톨 및 빌드
```bash
# pdf.js 관련 패키지 설치
cd ./external/pdf.js && npm install
# pdf.js 빌드
gulp generic
# 빌드에 필요한 패키지 설치
cd ../../ && npm install
# 빌드
npm run build
```
## 2. 디버깅

```bash
# 2.1. 웹팩 watch 모드 실행
npm run watch
# 2.2. vscode 라이브 서버 실행
# 2.3. index.html 디버그 실행
```

// text.js
import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';
 
{
let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
setAttributes(text, {
x: pt[0],
y: pt[1],
fill: normalizeColor(_textColor || '#000'),
fontSize: _textSize * scale,
transform: `rotate(${-viewport.rotation})`,
style: 'white-space: pre'
});
text.innerHTML = value;
let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
g.appendChild(text);
svg.appendChild(g);

annotation.width = text.getBBox().width * viewport.scale;
annotation.height = text.getBBox().height * viewport.scale;

svg.removeChild(g);
}

// main.js
else if (annotation.type == "textbox") {       
	// !!! 텍스트의 rect 영역을 구해야만 정확한 저장을 완료할수 있다.
	const contents = annotation.content;
	const fontSize = annotation.size * scaleX;
	const textColor = annotation.color;
	const left = annotation.x * scaleX;
	const top = height - (annotation.y * scaleY);
	const right = left + (annotation.width);
	const bottom = top + (annotation.height);
	let ta = writer.createFreeTextAnnotation({
	  page: pageIndex,
	  rect: [left, top, right, bottom],
	  contents: contents,
	  color: {r: 255, g: 255, b: 255},
	  textColor: {r:255, g:0, b:0},
	  fontSize: fontSize
	});
	ta.createDefaultAppearanceStream(); 
}

// function getSVGTextSize(page, annotation) {
//   let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//   text.setAttribute('x', annotation.x);
//   text.setAttribute('y', annotation.y);
//   text.setAttribute('fill', annotation.color);
//   text.setAttribute('fontSize', annotation.size);
//   text.setAttribute('transform', `rotate(${annotation.rotation})`);
//   text.setAttribute('style', 'white-space: pre');
//   text.innerHTML = annotation.content;
//   let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//   g.setAttribute('transform', 'scale(1) rotate(0) translate(0, 0)');
//   g.appendChild(text);

//   let viewport = page.getViewport({scale: DEFAULT_SCALE});
//   let styleViewport = page.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS});
//   let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//   svg.setAttribute('width', viewport.width);
//   svg.setAttribute('height', viewport.height);
//   svg.style.width = `${styleViewport.width}px`;
//   svg.style.height = `${styleViewport.height}px`;
//   svg.appendChild(g);

//   document.body.appendChild(svg);

//   let size = {width: text.getBBox().width, height: text.getBBox().height };

//   document.body.removeChild(svg);

//   return size;
// }

let bbox = undefined;
  {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 0);
    text.setAttribute('y', 1056);
    text.setAttribute('fill', '#E71F63');
    text.setAttribute('fontSize', 18);
    text.setAttribute('transform', 'rotate(0)');
    text.setAttribute('style', 'white-space: pre');
    text.innerHTML = "Test123";

    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'scale(1) rotate(0) translate(0, 0)');
    g.appendChild(text);

    let temp_div = document.createElement('div');
    temp_div.innerHTML = "<svg></svg>";
    let svg = temp_div.firstChild;
    svg.appendChild(g);

    svg.setAttribute('width', page.getViewport({scale: DEFAULT_SCALE}).width);
    svg.setAttribute('height', page.getViewport({scale: DEFAULT_SCALE}).height);
    svg.style.width = `${page.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS}).width}px`;
    svg.style.height = `${page.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS}).height}px`;

    document.body.appendChild(svg);

    bbox = text.getBBox();

    document.body.removeChild(svg);
  }

  let bbox1 = undefined;
  {
    let temp_div = document.createElement('div');
    temp_div.innerHTML = 
    `<svg width="612" height="792" style="width: 816px; height: 1056px;"><g transform="scale(1) rotate(0) translate(0, 0)"><text x="0" y="1056" fill="#E71F63" font-size="18" transform="rotate(0)" style="white-space: pre">Test123</text></g></svg>`;
    let svg = temp_div.firstChild;
    let g = svg.firstChild;
    let text = g.firstChild;

    document.body.appendChild(svg);

    bbox1 = text.getBBox();

    document.body.removeChild(svg);
  }

  let bbox2 = undefined;
  {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 0);
    text.setAttribute('y', 1056);
    text.setAttribute('fill', '#E71F63');
    text.setAttribute('fontSize', 18);
    text.setAttribute('transform', 'rotate(0)');
    text.setAttribute('style', 'white-space: pre');
    text.innerHTML = "Test123";

    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'scale(1) rotate(0) translate(0, 0)');
    g.appendChild(text);

    let viewport = page.getViewport({scale: DEFAULT_SCALE});
    let styleViewport = page.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS});
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', viewport.width);
    svg.setAttribute('height', viewport.height);
    svg.style.width = `${styleViewport.width}px`;
    svg.style.height = `${styleViewport.height}px`;
    svg.appendChild(g);
    
    document.body.appendChild(svg);

    bbox2 = text.getBBox();

    document.body.removeChild(svg);
  }
  
  let bbox3 = undefined;
  {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 0);
    text.setAttribute('y', 1056);
    text.setAttribute('fill', '#E71F63');
    text.setAttribute('fontSize', 18);
    text.setAttribute('transform', 'rotate(0)');
    text.setAttribute('style', 'white-space: pre');
    text.innerHTML = "Test123";

    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', 'scale(1) rotate(0) translate(0, 0)');
    g.appendChild(text);

    let viewport = page.getViewport({scale: DEFAULT_SCALE});
    let styleViewport = page.getViewport({scale: DEFAULT_SCALE * PixelsPerInch.PDF_TO_CSS_UNITS});

    let temp_div = document.createElement('div');
    temp_div.innerHTML = "<svg></svg>";
    let svg = temp_div.firstChild;
    svg.setAttribute('width', viewport.width);
    svg.setAttribute('height', viewport.height);
    svg.style.width = `${styleViewport.width}px`;
    svg.style.height = `${styleViewport.height}px`;
    svg.appendChild(g);
    
    document.body.appendChild(svg);

    bbox3 = text.getBBox();

    document.body.removeChild(svg);
  }

  {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', annotation.x);
    text.setAttribute('y', annotation.y);
    text.setAttribute('fill', annotation.color);
    text.setAttribute('fontSize', annotation.size);
    text.setAttribute('transform', `rotate(${annotation.rotation})`);
    text.setAttribute('style', 'white-space: pre');
    text.innerHTML = annotation.content;

    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(text);
    svg.appendChild(g);

    annotation.width = text.getBBox().width * viewport.scale;
    annotation.height = text.getBBox().height * viewport.scale;
    
    svg.removeChild(g);
  }