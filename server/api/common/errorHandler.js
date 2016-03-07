'use strict';

module.exports = (function(){
  var _retrieveErrorMessage = function(errorCode, propertyName){
    if (errorCode === 11000){
      return 'Cannot enter a ' +
        propertyName +
        ' with the same name as another ' +
        propertyName;
    }
    else if (errorCode === 500){
      return 'An internal server error has occurred.';
    }
    return '';
  }

  return {
    retrieveErrorMessage : _retrieveErrorMessage,
  };
})();
