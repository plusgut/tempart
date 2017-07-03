import Element from './Element';

export default {
  create(tagName: string): Element | HTMLElement {
    if (typeof document === 'undefined') {
      return new Element(tagName);
    } else {
      return document.createElement(tagName);
    }
  },
  getOuterHTML(element: Element | HTMLElement) {
    if (element instanceof Element) {
      throw new Error('not yet implemented');
    } else {
      return element.outerHTML;
    }
  },
};
