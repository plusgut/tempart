import Class from './class';
import version from '../version';

export default function factory(path, template) {
  if (template.version !== version) {
    const errorMessage = 'The parsed tempart version is ' + template.version +
    ', this is not compatible with compiler ' + version;
    throw new Error(errorMessage);
  }

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
  TempartTemplate.prototype._blocks = template.block;

  return TempartTemplate;
}
