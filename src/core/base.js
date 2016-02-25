nx = {
  BREAKER: {},
  VERSION: '1.0.4',
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global, undefined) {

  var toString = Object.prototype.toString;
  var class2type = {
    '[object Boolean]': 'Boolean',
    '[object Number]': 'Number',
    '[object String]': 'String',
    '[object Function]': 'Function',
    '[object Array]': 'Array',
    '[object Date]': 'Date',
    '[object RegExp]': 'RegExp',
    '[object Object]': 'Object',
    '[object Error]': 'Error'
  };

  var __ = {
    typeString: function (inTarget) {
      return toString.call(inTarget).slice(8, -1);
    }
  };

  nx.noop = function () {
  };

  nx.each = function (inTarget, inCallback, inContext) {
    var key, length;
    if (inTarget) {
      if (inTarget.__each__) {
        inTarget.__each__(inCallback, inContext);
      } else {
        length = inTarget.length;
        if (length >= 0) {
          for (key = 0; key < length; key++) {
            if (inCallback.call(inContext, inTarget[key], key) === nx.BREAKER) {
              break;
            }
          }
        } else {
          for (key in inTarget) {
            if (inTarget.hasOwnProperty(key)) {
              if (inCallback.call(inContext, inTarget[key], key) === nx.BREAKER) {
                break;
              }
            }
          }
        }
      }
    }
  };

  nx.mix = function (inTarget) {
    var i, length;
    for (i = 1, length = arguments.length; i < length; i++) {
      nx.each(arguments[i], function (val, key) {
        inTarget[key] = val;
      });
    }
    return inTarget;
  };

  nx.type = function (inTarget) {
    var typeString;
    if (inTarget && inTarget.__type__) {
      return inTarget.__type__;
    } else {
      if (inTarget === null) {
        return 'Null';
      }
      if (inTarget === undefined) {
        return 'Undefined';
      }
      typeString = toString.call(inTarget);
      return class2type[typeString] || __.typeString(inTarget);
    }
  };

  nx.path = function (inTarget, inPath, inValue) {
    if (typeof inPath !== 'string') {
      throw new Error('Path must be a string!');
    }

    var paths = inPath.split('.'),
      result = inTarget || nx.GLOBAL,
      last;

    if (undefined === inValue) {
      nx.each(paths, function (path) {
        result = result[path];
      });
    } else {
      last = paths.pop();
      nx.each(paths, function (path) {
        result = result[path] = result[path] || {};
      });
      result[last] = inValue;
    }
    return result;
  };

}(nx, nx.GLOBAL));


/**
 * Export the "nx" object
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = nx;
}
