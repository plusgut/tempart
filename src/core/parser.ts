import Block    from '../types/Block';
import Dom      from '../types/Dom';
import Content  from '../types/Content';
import Variable from '../types/Variable';
import State    from '../helper/State';
import util     from '../helper/util';

export default function parser(templateString: string): Block {
  const state = new State(templateString);

  while (state.index < state.templateString.length) {
    if (util.isPartial(state) === true) {

    } else if (util.isNewDomTag(state) === true) {
      state.getCurrentBlock().addChild(new Dom(state));
      state.incrementIndex();
    } else if (util.isEndTag(state) === true) {
      state.openTag = false;
      state.incrementIndex();
    } else if (util.isNewDomCloseTag(state) === true) {
      state.getCurrentBlock().closeTag();
    } else if (util.isState(state) === true) {
      state.getCurrentBlock().addChild(new Variable(state, 'state'));
    } else if (util.isAttribute(state) === true) {
      state.getCurrentBlock().addChild(new Variable(state, 'attribute'));
    } else if (util.isText(state) === true) {
      if (state.openTag === true) {
        let tagName = '';
        while (util.isText(state) === true) {
          tagName += state.getCurrentChar();
          state.incrementIndex();
        }

        state.getCurrentBlock().addConstant(tagName);
      } else {
        state.getCurrentBlock().addChild(new Content(state));
      }
    } else {
      // Please make an github issue and tell me how you got here
      throw new Error('Couldn\'t decide how to parse ');
    }
  }

  return state.compress(state.root);
}
