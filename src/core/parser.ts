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
      throw new Error('Partials are not implemented yet');
    } else if (util.isNewDomTag(state) === true) {
      state.getCurrentBlock().addChild(new Dom(state));
    } else if (util.isNewDomCloseTag(state) === true) {
      state.getCurrentBlock().closeTag();
    } else if (util.isState(state) === true || util.isAttribute(state) === true) {
      state.getCurrentBlock().addChild(new Variable(state));
    } else if (util.isText(state) === true) {
      state.getCurrentBlock().addChild(new Content(state));
    } else {
      // Please make an github issue and tell me how you got here
      throw new Error('Couldn\'t decide how to parse ');
    }
  }

  return state.compress(state.root);
}
