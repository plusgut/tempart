import util from '../helper/util';

function BlockClass(type) {
  this.setType(type);
}

BlockClass.prototype = {
  setType(type) {
    this.type = type;

    return this;
  },

  setId(id) {
    this.id = id;

    return this;
  },

  addParameter(type, value, name, parameters) {
    const capitalizedType = util.capitalize(type);
    if (capitalizedType === 'Parameter') {throw 'Are you trying to make an infinitive loop?';}

    const index = this['add' + capitalizedType](value);
    let parameter = {
      exec: type,
      value: index
    };

    if(name !== undefined) {
      parameter.name = name;
    }

    if(parameters !== undefined) {
      parameter.parameters = parameters;
    }

    return this.add('parameters', parameter);
  },

  addVariables(value) {
    return this.add('variables', value);
  },

  addConstants(value) {
    return this.add('constants', value);
  },

  addContains(value) {
    return this.add('contains', value);
  },

  addElseContains(value) {
    return this.add('elseContains', value);
  },

  add(key, value) {
    if (!this[key]) {
      this[key] = [];
    }

    return this[key].push(value) - 1; // index return, not the length
  },
};

export default BlockClass;
