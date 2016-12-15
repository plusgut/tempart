const types = ['constants', 'variables', 'children', 'elseChildren'];

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

  pushParameter(type, value, name, parameters) {
    return this._addParameter('push', type, value, name, parameters);
  },

  unshiftParameter(type, value, name, parameters) {
    return this._addParameter('unshift', type, value, name, parameters);
  },

  _addParameter(addType, type, value, name, parameters) {
    if (type === 'parameter') {throw 'Are you trying to make an infinitive loop?';}

    if (types.indexOf(type) === -1) {
      throw 'I\'m sorry, but I don\'t know the type ' + type;
    }

    const index = this._add(addType, type, value);
    let parameter = {
      exec: type,
      value: index,
    };

    if (name !== undefined) {
      parameter.name = name;
    }

    if (parameters !== undefined) {
      parameter.parameters = parameters;
    }

    return this._add(addType, 'parameters', parameter);
  },

  _add(addType, key, value) {
    if (!this[key]) {
      this[key] = [];
    }

    return this[key][addType](value) - 1; // index return, not the length
  },
};

export default BlockClass;
