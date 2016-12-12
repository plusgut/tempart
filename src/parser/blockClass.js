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

  addParameter(type, value) {
    var capitalizedType = util.capitalize(type);
    if (capitalizedType === 'Parameter') {throw 'Are you trying to make an infinitive loop?';}

    var length = this['add' + capitalizedType](value);
    var parameter = {
      exec: type,
      value: length - 1,
    };

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

    return this[key].push(value);
  },
};

export default BlockClass;
