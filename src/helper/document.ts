class Document {
  createElement(tagName: string): Element | HTMLElement {
    // if (typeof document === 'undefined') {
    //   return new Element(tagName);
    // } else {
      return document.createElement(tagName);
    // }
  }

  createText(content: string): Text {
    if (typeof document === 'undefined') {
      // return new Element(content);
      throw new Error('Textnode is not yet implemented');
    } else {
      return document.createTextNode(content);
    }
  }

  getOuterHTML(element: Element | HTMLElement | Text) {
    if (element instanceof Element) {
      return element.outerHTML;
    } else if (element instanceof Text) {
      return element.textContent;
    }
  }
}

export default new Document();
