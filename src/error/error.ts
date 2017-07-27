import Position from './Position';
import State from '../helper/State';

class ErrorHandler {
  public throwCallError() {
    const error = new Error('CallError');
    error.message = 'Tempart has to be called with new';
    throw error;
  }
  
  public throwVersionMissmatch(parseVersion: string, compileVersion: string) {
    const error = new Error('VersionMissmatch');
    error.message = 'The parsed tempart version is ' + parseVersion + ', this is not compatible with compiler ' + compileVersion;
    throw error;
  }
}

export default new ErrorHandler();
