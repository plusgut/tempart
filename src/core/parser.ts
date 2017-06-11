import Block from '../types/Block';
import Dom   from '../types/Dom';
import State from '../helper/State';
import util  from '../helper/util';

function createRootElement(): Dom {
  const rootBlock = new Dom();
  rootBlock.root = true;
  return rootBlock;
}

export default function parser(templateString: string): Block {
  const rootBlock = createRootElement();
  const openBlocks = [rootBlock];
  const state = new State(templateString, rootBlock);

  while (state.index < state.templateString.length) {
    if (util.isPartial(state)) {

    } else if (util.isDom(state)) {

    } else if (util.isText(state)) {

    }
    state.incrementIndex();
  }

  return rootBlock;
}
