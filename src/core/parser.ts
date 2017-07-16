import ParserBlock from '../parserTypes/ParserBlock';
import Dom         from '../parserTypes/Dom';
import Content     from '../parserTypes/Content';
import Container   from '../parserTypes/Container';
import Variable    from '../parserTypes/Variable';
import State       from '../helper/State';
import util        from '../helper/util';

export default function parser(templateString: string): ParserBlock[] {
  const state = new State(templateString);

  while (state.index < state.templateString.length) {
    if (util.isPartial(state) === true) {
      throw new Error('Partials are not implemented yet');
    } else if (util.isNewDomTag(state) === true) {
      state.getCurrentBlock().addChild(new Dom(state));
    } else if (util.isNewDomCloseTag(state) === true) {
      state.getCurrentBlock().closeTag();
    } else if (util.isState(state) === true || util.isAttribute(state) === true) {
      const container = new Container(state);
      container.addChild(new Variable(state));
      state.getCurrentBlock().addChild(container);
    } else if (util.isText(state) === true) {
      const currentBlock = state.getCurrentBlock();
      if (state.root === currentBlock) {
        const container = new Container(state);
        container.addChild(new Content(state));
        currentBlock.addChild(container);
      } else {
        currentBlock.addChild(new Content(state));
      }
      
    } else {
      // Please make an github issue and tell me how you got here
      throw new Error('Couldn\'t decide how to parse ');
    }
  }

  return state.root.children.map(state.compress.bind(state));
}
