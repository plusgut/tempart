abstract class Block {
  abstract type: string
  id: number
  children: Array<Block>
  elseChildren: Array<Block>
  root: boolean
  setId(id: number) {
    this.id = id;
  }
  addChild(block: Block) {
    if(!this.children) {
      this.children = [];
    }
    this.children.push(block);
  }
  addElseChild(block: Block) {
    if(!this.elseChildren) {
      this.elseChildren = [];
    }
    this.elseChildren.push(block);
  }
}

export default Block;
