class Element {
  tagName: string;
  className: string;
  id: string;
  children: Element[];

  constructor(tagName: string) {
    this.tagName = tagName;
    this.children = [];
  }

  public appendChild(element: Element) {
    this.children.push(element);
  }
}

export default Element;
