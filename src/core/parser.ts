import Block   from '../types/Block';
import Dom     from '../types/Dom';
import Content from '../types/Content';
import State   from '../helper/State';
import util    from '../helper/util';

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
      debugger;
      throw new Error('What am I?');
    }
  }

  return state.addIds(
    state.treeShake(state.root),
  );
}
