import Class from './class';

export default function factory(path, blocks) {
  let TempartTemplate = function (prefix) {
    if (this instanceof TempartTemplate) {
      this._prefix = prefix;
      this._currentValues = {};
    } else {
      throw new Error('Tempart has to be called with new');
    }
  };

  TempartTemplate.prototype = new Class();
  TempartTemplate.prototype._path = path;
  TempartTemplate.prototype._blocks = blocks;

  return TempartTemplate;
}
