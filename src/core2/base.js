var nx = {
  DEBUG: false,
  BREAKER: {},
  VERSION: '1.0.2',
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var undefined;
  var class2type = {};
  var toString = class2type.toString;
  var emptyArray = [],
    filter = emptyArray.filter,
    slice = emptyArray.slice,
    concat = emptyArray.concat;

  var rPath = /(?:{)([\w.]+?)(?:})/gm;
  var javascriptType = 'Boolean Number String Function Array Date RegExp Object Error';

  //populate class2type map:
  javascriptType.split(' ').forEach(function (name) {
    class2type["[object " + name + "]"] = name.toLowerCase()
  });


  nx.noop = function () {
  };

  nx.error = function (msg) {
    throw new Error(msg);
  };

  nx.each = function (target, callback, context) {
    var key, length;
    if (target) {
      if (target.__each__) {
        target.__each__(callback, context);
      } else {
        length = target.length;
        if (nx.isArrayLike(target)) {
          for (key = 0; key < length; key++) {
            if (callback.call(context, key, target[key]) === nx.BREAKER) {
              break;
            }
          }
        } else {
          for (key in target) {
            if (target.hasOwnProperty(key)) {
              if (callback.call(context, key, target[key]) === nx.BREAKER) {
                break;
              }
            }
          }
        }
      }
    }
  };

  nx.type = function (obj) {
    if (obj && obj.__type__) {
      return obj.__type__;
    }
    return obj == null ? String(obj) :
    class2type[toString.call(obj)] || 'object';
  };

  nx.isDocument = function (obj) {
    return obj != null && obj.nodeType == 9;
  };

  nx.isWindow = function (obj) {
    return obj != null && obj == obj.global;
  };

  nx.isNumber = function (obj) {
    return !isNaN(obj) && typeof(obj) == 'number';
  };

  nx.isBoolean = function (obj) {
    return typeof(obj) == 'boolean';
  };

  nx.isString = function (obj) {
    return typeof(obj) == 'string';
  };

  nx.isArray = Array.isArray || function (obj) {
      return obj instanceof Array;
    };

  nx.isArrayLike = function (obj) {
    return typeof obj.length == 'number';
  };

  nx.isFunction = function (obj) {
    return typeof(obj) == 'function';
  };

  nx.isObject = function (obj) {
    return nx.type(obj) == 'object';
  };

  nx.isPlainObject = function (obj) {
    return nx.isObject(obj) && !nx.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
  };

  nx.is = function (target, type) {
    if (target && target.__is__) {
      return target.__is__(type);
    } else {
      if (typeof type === 'string') {
        switch (type) {
          case 'undefined':
          case 'null':
            return String(type);
          case 'object':
            return nx.isObject(target);
          case 'plain':
            return nx.isPlainObject(target);
          case 'string':
          case 'boolean':
          case 'number':
          case 'function':
            return typeof(target) === type;
          case 'array':
            return nx.isArray(target);
          default:
            return toString(target).toLowerCase().slice(8, -1) === type;
        }
      } else if (typeof type === 'function') {
        return target instanceof type;
      }
    }
  };

  nx.unique = function (array) {
    return filter.call(array, function (item, idx) {
      return array.indexOf(item) == idx;
    });
  };

  nx.flatten = function (array) {
    return array.length > 0 ? concat.apply([], array) : array;
  };

  nx.compact = function (array) {
    return filter.call(array, function (item) {
      return item != null;
    });
  };

  nx.grep = function (array, callback) {
    return filter.call(array, callback);
  };

  nx.isEmptyObject = function (obj) {
    var key;
    for (key in obj) return false;
    return true;
  };

  nx.inArray = function (target, array, i) {
    return emptyArray.indexOf.call(array, target, i);
  };

  nx.camelCase = function (str) {
    return str.replace(/-+(.)?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  };

  nx.trim = function (str) {
    return str == null ? "" : String.prototype.trim.call(str)
  };

  nx.deserializeValue = function (value) {
    try {
      return value ?
      value == "true" ||
      ( value == "false" ? false :
        value == "null" ? null :
          +value + "" == value ? +value :
            /^[\[\{]/.test(value) ? $.parseJSON(value) :
              value )
        : value;
    } catch (e) {
      return value;
    }
  };

  nx.dasherize = function (str) {
    return str.replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/_/g, '-')
      .toLowerCase()
  };

  nx.clone = function (target, source, deep) {
    var isPlainObject = nx.isPlainObject,
      isArray = nx.isArray;
    var key;
    for (key in source) {
      if (deep) {
        if (isPlainObject(source[key]) || isArray(source[key])) {
          if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
            target[key] = {};
          }
          if (isArray(source[key]) && !isArray(target[key])) {
            target[key] = [];
          }
          nx.clone(target[key], source[key], deep);
        }
      }
      else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  };

  nx.mix = function (target) {
    var deep, args = slice.call(arguments, 1);
    if (typeof target == 'boolean') {
      deep = target;
      target = args.shift();
    }
    args.forEach(function (arg) {
      nx.clone(target, arg, deep);
    });
    return target;
  };

  nx.path = function (target, path, value) {
    if (!nx.isString(path)) {
      nx.error('Path must be a string!');
    }

    var paths = path.split('.'),
      result = target || global,
      last;

    if (undefined === value) {
      paths.forEach(function (path) {
        result = result[path];
      });
    } else {
      last = paths.pop();
      paths.forEach(function (path) {
        result = result[path] = result[path] || {};
      });

      result[last] = value;
    }
    return result;
  };

  nx.format = function (string, args) {
    var result = string || '';
    var replaceFn = nx.isArray(args) ? function (str, match) {
      return args[match];
    } : function (str, match) {
      return nx.path(args, match);
    };
    result = string.replace(rPath, replaceFn);
    return result;
  };

}(nx, nx.GLOBAL));

/**
 * Export the "nx" object
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = nx;
}
