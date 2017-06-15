import State from './State';

export default {
  isPartial(state: State): boolean {
    return false;
  },

  /**
   * checks for opening a new tag
   * @param state
   */
  isNewDomTag(state: State): boolean {
    return state.getCurrentChar() === '<' && state.templateString[state.index + 1] !== '/';
  },

  /**
   * checks for closing tag'</
   * @param state
   */
  isNewDomCloseTag(state: State): boolean {
    return state.getNextChars(2) === '</';
  },

  /**
   * checks for the end of new tag >
   * @param state
   */
  isEndTag(state: State): boolean {
    return state.getCurrentChar() === '>';
  },

  /**
   * checks for special chars
   */
  isText(state: State): boolean {
    // should check for < > and { }
    return /[A-z]/.test(state.getCurrentChar());
  },

  isVariable(state: State): boolean {
    return false;
  },
};
