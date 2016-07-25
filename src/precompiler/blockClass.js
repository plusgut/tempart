import util from "../helper/util";

class Block {
  constructor(type) {
    this.type = type;
  }
  setId(value) {
    this.id = value;
  }
  addParameter(type, value) {
    var length = this['add' + util.capitalize(type)](value);
    var parameter = {
      exec: type,
      value: length - 1
    };
    return this.push('parameters', parameter);
  }
  addVariables(value) {
    return this.push('variables', value);
  }
  addConstants(value) {
    return this.push('constants', value);
  }
  addContains(value) {
    return this.push('contains', value);
  }
  addElseContains(value) {
    return this.push('elseContains', value);
  }
  add(key, value) {
    if(!this[key]) {
      this[key] = [];
    }
    return this[key].push(value);
  }
}

export default Block;
