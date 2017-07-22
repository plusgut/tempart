import State from './State';
import Parameter from './Parameter';
import constants from '../helper/constants';

class Util {
  isPartial(state: State): boolean {
    return false;
  }

  /**
   * checks for opening a new tag
   * @param state
   */
  isNewDomTag(state: State): boolean {
    return state.getCurrentChar() === '<' && state.templateString[state.index + 1] !== '/';
  }

  /**
   * checks for closing tag'</
   * @param state
   */
  isNewDomCloseTag(state: State): boolean {
    return state.getNextChars(2) === '</';
  }

  /**
   * checks for the end of new tag >
   * @param state
   */
  isEndTag(state: State): boolean {
    return state.getCurrentChar() === '>';
  }

  isVariable(state: State) {
    return this.isLocal(state) === true ||
           this.isAttribute(state) === true ||
           this.isState(state) === true;
  }

  isLocal(state: State): boolean {
    return state.getNextChars(3) === '{{' + constants.LOCAL_PREFIX;
  }

  isAttribute(state: State): boolean {
    return state.getNextChars(3) === '{{' + constants.ATTRIBUTE_PREFIX;
  }

  isState(state: State): boolean {
    return state.getNextChars(3) === '{{' + constants.STATE_PREFIX;
  }

  isClosingMustache(state: State): boolean {
    return state.getNextChars(2) === '}}';
  }

  isQuote(state: State) {
    return ['"', '\'', '`'].indexOf(state.getCurrentChar()) !== -1;
  }

  isSpace(state: State) {
    return state.getCurrentChar() === ' ';
  }

  isMustacheHelper(state: State) {
    return state.getNextChars(2) === '{{' &&
           this.isMustacheHelperClose(state) === false &&
           this.isAttribute(state) === false &&
           this.isState(state) === false &&
           this.isLocal(state) === false;
  }

  isMustacheHelperWithChildren(state: State) {
    return state.getNextChars(3) === '{{#' && this.isMustacheHelper(state) === true;
  }

  isMustacheHelperClose(state: State) {
    return state.getNextChars(3) === '{{/';
  }

  /**
   * checks for special chars
   */
  isText(state: State): boolean {
    return this.isPartial(state)         === false &&
           this.isNewDomTag(state)       === false &&
           this.isNewDomCloseTag(state)  === false &&
           this.isEndTag(state)          === false &&
           this.isAttribute(state)       === false &&
           this.isState(state)           === false &&
           this.isClosingMustache(state) === false;
  }

  generateParameter(value: string) {
    let type = '';
    let newValue : string[];
    if (value[0] === constants.STATE_PREFIX) {
      newValue = value.slice(1, value.length).split(constants.VARIABLE_DELIMITER);
      type = 'state';
    } else if (value[0] === constants.ATTRIBUTE_PREFIX) {
      newValue = value.slice(1, value.length).split(constants.VARIABLE_DELIMITER);
      type = 'attribute';
    } else if (value[0] === constants.LOCAL_PREFIX) {
      newValue = value.slice(1, value.length).split(constants.VARIABLE_DELIMITER);
      type = 'local';
    } else {
      newValue = [value];
      type = 'constant';
    }

    return new Parameter(type, newValue);
  }

  getParameter(state: State): Parameter {
    let type = '';
    if (this.isState(state)) {
      type = 'state';
    } else if (this.isAttribute(state)) {
      type = 'attribute';
    } else if (this.isLocal(state)) {
      type = 'local';
    } else {
      throw 'Unknown Parameter type';
    }

    state.incrementIndex().incrementIndex().incrementIndex();

    let variableName = '';

    while (this.isClosingMustache(state) === false) {
      if (state.index >= state.templateString.length) {
        throw new Error('No end of variable found');
      }

      variableName += state.getCurrentChar();
      state.incrementIndex();
    }


    // Skipping }}
    state.incrementIndex().incrementIndex();

    const parameter = new Parameter(type, variableName.split(constants.VARIABLE_DELIMITER));

    return parameter;
  }

  /**
   * queues functions to call them and return the new data
   */
  pipe(...funcs: {(value: any): any}[]) {
    return (value: any) => {
      let result = value;
      for (let i = 0; i < funcs.length; i += 1) {
        result = funcs[i](result);
      }
      return result;
    };
  }
}

export default new Util();
