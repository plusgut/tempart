import Element from './Element';

export default {

  createElement(tagName: string): Element | HTMLElement {
    if (typeof document === 'undefined') {
      return new Element(tagName);
    } else {
      return document.createElement(tagName);
    }
  },

  createText(content: string): Text {
    if (typeof document === 'undefined') {
      // return new Element(content);
      throw new Error('Textnode is not yet implemented');
    } else {
      return document.createTextNode(content);
    }
  },

  getOuterHTML(element: Element | HTMLElement | Text) {
    if (element instanceof Element) {
      throw new Error('not yet implemented');
    } else if (element instanceof Text) {
      return element.textContent;
    } else {
      return element.outerHTML;
    }
  },
};
