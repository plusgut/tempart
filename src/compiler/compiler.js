import Class from './class';

export default function factory(path, blocks) {
  var TempartTemplate = function(prefix) {
    this._prefix = prefix;
    this._currentValues = {};
  };

  TempartTemplate.prototype = new Class();
  TempartTemplate.prototype._path = path;
  TempartTemplate.prototype._blocks = blocks;

  return TempartTemplate;
}
