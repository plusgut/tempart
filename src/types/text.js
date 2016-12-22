import parameters from '../helpers/parameters';

export default {
  clean(handler, block) {
    handler._addHtml(parameters.getValue(handler, block, 0));

    return this;
  },
  dirty() {
    throw new Error('Constant can\'t be updated');
  },
};
