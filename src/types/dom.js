import parameters from '../helpers/parameters';

export default {
  clean(handler, block) {
    const tag = parameters.getValue(handler, block, 0);
    let result = '<' + tag + ' ';

    for (let i = 1; i < block.parameters.length; i++) {
      const key = parameters.getName(block, i);
      const value = parameters.getValue(handler, block, i);
      if (key) {
        result += key + '=\"' + value + '\" ';
      } else {
        result += value + ' ';
      }
    }

    result += parameters.generateId(handler, block) + '>';

    handler._addHtml(result);

    if (block.children) {
      handler._handleCleanBlocks(block.children);
    }

    handler._addHtml('</' + tag + '>');
  },

  dirty() {

  },

  validate() {

  },

};
