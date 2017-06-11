abstract class Block {
  abstract type: string;
  public id: number;
  public children: Block[];
  public elseChildren: Block[];
  public root: boolean;

  public setId(id: number) {
    this.id = id;
  }

  public addChild(block: Block) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(block);
  }

  public addElseChild(block: Block) {
    if (!this.elseChildren) {
      this.elseChildren = [];
    }
    this.elseChildren.push(block);
  }
}

export default Block;
