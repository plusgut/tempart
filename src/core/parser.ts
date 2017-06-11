import Block from '../types/Block';
import Dom   from '../types/Dom';
import State from '../helper/State';
import util  from '../helper/util';

export default function parser(templateString: string): Block {
  const state = new State(templateString);

  while (state.index < state.templateString.length) {
    if (util.isPartial(state)) {

    } else if (util.isDom(state)) {
      state.getLastBlock().addChild(new Dom(state));
    } else if (util.isText(state)) {

    }
    state.incrementIndex();
  }
  debugger;

  return state.root;
}
