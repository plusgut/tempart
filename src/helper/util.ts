import State from './State';

export default {
  isPartial(state: State): boolean {
    return false;
  },

  isDom(state: State): boolean {
    return state.getCurrentChar() === '<';
  },


  isText(state: State): boolean {
    return false;
  },

  isVariable(state: State): boolean {
    return false;
  }
};
