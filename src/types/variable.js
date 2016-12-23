import parameters from '../helpers/parameters';

const VARIABLE_INDEX = 0;
const TAG_INDEX = 1;

export default {
  clean(handler, block) {
    handler._addHtml(parameters.generateParameterString(handler, block, TAG_INDEX))
           ._addHtml(parameters.getValue(handler, block, VARIABLE_INDEX))
           ._addHtml('</' + parameters.getValue(handler, block, TAG_INDEX) + '>');
  },

  dirty() {

  },
};
