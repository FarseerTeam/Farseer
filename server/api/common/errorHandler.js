'use strict';

module.exports = (function(){
  var _retrieveErrorMessage = function(errorCode, propertyName){
    const DUPLICATE_KEY_ERROR_CODE = 11000;
    const INTERNAL_SERVER_ERROR = 500;

    if (errorCode === DUPLICATE_KEY_ERROR_CODE){
      return 'Cannot enter a ' +
        propertyName +
        ' with the same name as another ' +
        propertyName;
    }
    else {
        if (errorCode === INTERNAL_SERVER_ERROR){
              return 'An internal server error has occurred.';
            }
      }
    return '';
  }

  return {
    retrieveErrorMessage : _retrieveErrorMessage,
  };
})();
