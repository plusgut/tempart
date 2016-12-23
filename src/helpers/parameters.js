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
      result = values.get(handler, block.variables[parameter.value]);
    } else {
      throw new Error('The paramenter-type ' + parameter.exec + ' is not known to the engine');
    }

    return result;
  },

  generateParameterString(handler, block, offset) {
    let result = '<' + this.getValue(handler, block, offset) + ' ';

    for (let i = offset + 1; i < block.parameters.length; i++) {
      const key = this.getName(block, i);
      const value = this.getValue(handler, block, i);
      if (key) {
        result += key + '=\"' + value + '\" ';
      } else {
        result += value + ' ';
      }
    }

    result += this.generateId(handler, block) + '>';
    return result;
  },

  generateId(handler, block) {
    return 'data-snew-id=\"' + handler._prefix + block.id + '\"';
  },
};
