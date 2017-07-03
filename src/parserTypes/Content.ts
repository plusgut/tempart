import State from '../helper/State';
import util  from '../helper/util';
import ParserBlock from './ParserBlock';


class Content extends ParserBlock {
  type: string;

  constructor(state: State) {
    super(state);

    this.type = 'content';
    let content = '';
    while (util.isText(state) && state.index < state.templateString.length) {
      content += state.getCurrentChar();
      state.incrementIndex();
    }
    this.addConstant(content);
  }

  public closeTag() {
    throw new Error('Closing a text is not possible');
  }

  public addChild() {
    // Please make an github issue and tell me how you got here
    throw new Error('Textcontent should not have children');
  }
}

export default Content;
