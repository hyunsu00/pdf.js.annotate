import renderLine from './renderLine'; // 선 그리기
import renderRect from './renderRect'; // 직사각형
import renderDrawing from './renderDrawing'; // 자유형 그리기 그룹
import renderPath from './renderPath'; // 자유형 그리기
import renderPoint from './renderPoint'; // 스티커 노트
import renderText from './renderText'; // 텍스트
import renderUnderline from './renderUnderline'; // 밑줄
import renderStrikeout from './renderStrikeout'; // 취소선
import renderHighlight from './renderHighlight'; // 형광펜
import renderCircle from './renderCircle';
import renderArrow from './renderArrow';


const isFirefox = /firefox/i.test(navigator.userAgent);

/**
 * Get the x/y translation to be used for transforming the annotations
 * based on the rotation of the viewport.
 *
 * @param {Object} viewport The viewport data from the page
 * @return {Object}
 */
export function getTranslation(viewport) {
  let x;
  let y;

  // Modulus 360 on the rotation so that we only
  // have to worry about four possible values.
  switch (viewport.rotation % 360) {
    case 0:
      x = y = 0;
      break;
    case 90:
      x = 0;
      y = (viewport.width / viewport.scale) * -1;
      break;
    case 180:
      x = (viewport.width / viewport.scale) * -1;
      y = (viewport.height / viewport.scale) * -1;
      break;
    case 270:
      x = (viewport.height / viewport.scale) * -1;
      y = 0;
      break;
  }

  return { x, y };
}

/**
 * Transform the rotation and scale of a node using SVG's native transform attribute.
 *
 * @param {Node} node The node to be transformed
 * @param {Object} viewport The page's viewport data
 * @return {Node}
 */
function transform(node, viewport) {
  let trans = getTranslation(viewport);

  // Let SVG natively transform the element
  node.setAttribute('transform', `scale(${viewport.scale}) rotate(${viewport.rotation}) translate(${trans.x}, ${trans.y})`);

  // Manually adjust x/y for nested SVG nodes
  if (!isFirefox && node.nodeName.toLowerCase() === 'svg') {
    node.setAttribute('x', parseInt(node.getAttribute('x'), 10) * viewport.scale);
    node.setAttribute('y', parseInt(node.getAttribute('y'), 10) * viewport.scale);

    let x = parseInt(node.getAttribute('x', 10));
    let y = parseInt(node.getAttribute('y', 10));
    let width = parseInt(node.getAttribute('width'), 10);
    let height = parseInt(node.getAttribute('height'), 10);
    let path = node.querySelector('path');
    let svg = path.parentNode;

    // Scale width/height
    [node, svg, path, node.querySelector('rect')].forEach((n) => {
      n.setAttribute('width', parseInt(n.getAttribute('width'), 10) * viewport.scale);
      n.setAttribute('height', parseInt(n.getAttribute('height'), 10) * viewport.scale);
    });

    // Transform path but keep scale at 100% since it will be handled natively
    transform(path, Object.assign({}, viewport, { scale: 1 }));

    switch (viewport.rotation % 360) {
      case 90:
        node.setAttribute('x', viewport.width - y - width);
        node.setAttribute('y', x);
        svg.setAttribute('x', 1);
        svg.setAttribute('y', 0);
        break;
      case 180:
        node.setAttribute('x', viewport.width - x - width);
        node.setAttribute('y', viewport.height - y - height);
        svg.setAttribute('y', 2);
        break;
      case 270:
        node.setAttribute('x', y);
        node.setAttribute('y', viewport.height - x - height);
        svg.setAttribute('x', -1);
        svg.setAttribute('y', 0);
        break;
    }
  }

  return node;
}

function _createElement(annotation) {

  let element = null;
  switch (annotation.type) {
    case 'area':
      element = renderRect(annotation);
      break;
    case 'highlight':
      element = renderHighlight(annotation);
      break;
    case 'circle':
    case 'fillcircle':
    case 'emptycircle':
      element = renderCircle(annotation);
      break;
    case 'line':
      element = renderLine(annotation);
      break;
    case 'strikeout':
      element = renderStrikeout(annotation);
      break;
    case 'underline':
      element = renderUnderline(annotation);
      break;
    case 'point':
      element = renderPoint(annotation);
      break;
    case 'textbox':
      element = renderText(annotation);
      break;
    case 'path':
      element = renderPath(annotation);
      break;
    case 'drawing':
      element = renderDrawing(annotation);
      break;
    case 'arrow':
      element = renderArrow(annotation);
      break;
  }

  // If no type was provided for an annotation it will result in node being null.
  // Skip appending/transforming if node doesn't exist.
  if (element) {
    // Set attributes
    element.setAttribute('data-pdf-annotate-id', annotation.uuid);
    element.setAttribute('aria-hidden', true);

    // Dynamically set any other attributes associated with annotation that is not related to drawing it
    Object.keys(annotation).filter((key) => {
      return ['color', 'x', 'y', 'cx', 'cy', 'color', 'documentId', 'lines', 'page',
        'width', 'class', 'content', 'size', 'rotation', 'r', 'paths', 
        'strokeWidth', 'strokeColor',  'strokeOpacity', 'strokeDasharray',
        'fillColor', 'fillOpacity', 'rectangles'].indexOf(key) === -1;
    }).forEach((key) => {
      element.setAttribute(`data-pdf-annotate-${key}`, annotation[key]);
    });
  }

  return element;
}

/**
 * Append an annotation as a child of an SVG.
 *
 * @param {SVGElement} svg The SVG element to append the annotation to
 * @param {Object} annotation The annotation definition to render and append
 * @param {Object} viewport The page's viewport data
 * @return {SVGElement} A node that was created and appended by this function
 */
export function appendChild(svg, annotation, viewport) {
  if (!viewport) {
    viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));
  }

  let child = _createElement(annotation);
  if (child) {
    svg.appendChild(transform(child, viewport));
  } else {
    throw new Error('주석엘리먼트를 추가 할수 없다.');
  }

  return child;
}

export function replaceChild(svg, annotation, viewport) {
  if (!viewport) {
    viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));
  }

  const target = svg.querySelector('[data-pdf-annotate-id="' + annotation.uuid + '"]');
  let child = _createElement(annotation);
  if (target && child) {
    svg.replaceChild(transform(child, viewport), target);
  } else {
    throw new Error('주석엘리먼트를 교체 할수 없다.');
  }

  return child;
}

export function insertBefore(svg, target, annotation, viewport) {
  if (!viewport) {
    viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));
  }

  let child = _createElement(annotation);
  if (target && child) {
    svg.insertBefore(transform(child, viewport), target);
  } else {
    throw new Error('주석엘리먼트를 교체 할수 없다.');
  }

  return child;
}

/**
 * Transform a child annotation of an SVG.
 *
 * @param {SVGElement} svg The SVG element with the child annotation
 * @param {Object} child The SVG child to transform
 * @param {Object} viewport The page's viewport data
 * @return {SVGElement} A node that was transformed by this function
 */
export function transformChild(svg, child, viewport) {
  if (!viewport) {
    viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));
  }

  // If no type was provided for an annotation it will result in node being null.
  // Skip transforming if node doesn't exist.
  if (child) {
    child = transform(child, viewport);
  }

  return child;
}

export default {
  /**
   * Get the x/y translation to be used for transforming the annotations
   * based on the rotation of the viewport.
   */
  getTranslation,

  /**
   * Append an SVG child for an annotation
   */
  appendChild,

  /**
   * Replace an SVG child for an annotation
   */
  replaceChild,

  /**
   * InsertBefore an SVG child for an annotation
   */
  insertBefore,

  /**
   * Transform an existing SVG child
   */
  transformChild
};
