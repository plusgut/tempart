// import Position from './Position';
// import State from '../helper/State';

class ErrorHandler {
  public throwPrefixMissing(): never {
    const error = new Error('PrefixMissing');
    error.message = 'No Template was given to the factory';
    throw error;
  }

  public throwTemplateMissing(): never {
    const error = new Error('TemplateMissing');
    error.message = 'No Template was given to the factory';
    throw error;
  }

  public throwVersionMissing(): never {
    const error = new Error('VersionMissing');
    error.message = 'No version was given';
    throw error;
  }
  public throwCallError(): never {
    const error = new Error('CallError');
    error.message = 'Tempart has to be called with new';
    throw error;
  }
  
  public throwVersionMissmatch(parseVersion: string, compileVersion: string): never {
    const error = new Error('VersionMissmatch');
    error.message = 'The parsed tempart version is ' + parseVersion + ', this is not compatible with compiler ' + compileVersion;
    throw error;
  }
}

export default new ErrorHandler();
