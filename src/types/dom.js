import parameters from '../helpers/parameters';

const TAG_INDEX = 0;

export default {
  clean(handler, block) {
    handler._addHtml(parameters.generateParameterString(handler, block, TAG_INDEX));

    if (block.children) {
      handler._handleCleanBlocks(block.children);
    }

    handler._addHtml('</' + parameters.getValue(handler, block, TAG_INDEX) + '>');
  },

  dirty() {

  },

  validate() {

  },

};
