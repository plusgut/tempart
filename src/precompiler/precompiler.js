function Precompiler(template) {
  this.template = template;
}

Precompiler.prototype = {
  parse() {
    this.positions = this.indexOfAll();
    this.index = 0;
    let blocks = [];
    this.handleBlocks(blocks)
  },

  handleBlocks(blocks) {
    blocks.push({

    });
    while(this.index < this.positions.length) {
      // else-closing
        
      // closing
        this.incrementIndex()
        break;
      // openening
        let lastBlock = blocks[blocks.length - 1];
        lastBlock.children = [];
        this.incrementIndex()
            .handleBlocks(lastBlock.children)

    }
  },
  nodePosition(fromIndex) {
    return this.template.indexOf(/<|{{/g, fromIndex);
  },

  indexOfAll() {
    let occurances = [];
    let fromIndex = 0;
    let occurance;
    do {
      occurance = this.nodePosition(fromIndex);
      if(occurance !== -1) {
        occurances.push(occurance);
      }
    } while(occurance !== -1);

    return occurances;
  },

  isInside(currentPosition, nextPosition) {
    return this.template.indexOf(">", currentPosition) < nextPosition;
  },
};


export function precompiler(template) {
  return new Precompiler(template).parse();
}