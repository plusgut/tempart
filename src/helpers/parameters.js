import values from './values';

export default {
  getName(block, index) {
    return block.parameters[index].name;
  },

  getValue(handler, block, index) {
    const parameter = block.parameters[index];
    let result;
    if (parameter.exec === 'constants') {
      result = block.constants[parameter.value];
    } else if (parameter.exec === 'variables') {
      result = values.get(handler, parameter.variables[parameter.name]);
    } else {
      throw new Error('The paramenter-type ' + parameter.exec + ' is not known to the engine');
    }

    return result;
  },

  generateId(handler, block) {
    return 'data-snew-id=\"' + handler._prefix + block.id + '\"';
  },
};
