var nx = {
  DEBUG:false,
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

  var javascriptType = 'Boolean Number String Function Array Date RegExp Object Error';

  //populate class2type map:
  javascriptType.split(' ').forEach(function (name) {
    class2type["[object " + name + "]"] = name.toLowerCase()
  });


  nx.noop = function () {
  };

  nx.each = function (target, callback, context) {
    var key, length;
    if (target) {
      if (target.__each__) {
        target.__each__(callback, context);
      } else {
        length = target.length;
        if (nx.isLikeArray(target)) {
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

  nx.isString = function (obj) {
    return typeof(obj) == 'string';
  };

  nx.isArray = Array.isArray || function (obj) {
      return obj instanceof Array;
    };

  nx.isLikeArray = function (obj) {
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
    if (typeof path !== 'string') {
      throw new Error('Path must be a string!');
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

}(nx, nx.GLOBAL));

/**
 * Export the "nx" object
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = nx;
}

(function (nx, global) {

  nx.event = {
    init: function () {
      this.__listeners__ = {};
    },
    destroy: function () {
      this.__listeners__ = {};
    },
    on: function (name, handler, context) {
      var map = this.__listeners__;
      var listeners = map[name] = map[name] || [];
      listeners.push({
        owner: this,
        handler: handler,
        context: context
      });
    },
    off: function (name, handler, context) {
      var listeners = this.__listeners__[name];
      if (handler) {
        nx.each(listeners, function (listener, index) {
          if (listener.handler === handler && (!context || listener.context === context )) {
            listeners.splice(index, 1);
          }
        });
      } else {
        listeners.length = 0;
      }
    },
    fire: function (name, inArgs) {
      var listeners = this.__listeners__[name];
      if (listeners) {
        nx.each(listeners, function (listener) {
          if (listener && listener.handler) {
            if (listener.handler.call(listener.context || listener.owner, listener.owner, inArgs) === false) {
              return nx.BREAKER;
            }
          }
        });
      }
    }
  };

}(nx, nx.GLOBAL));

(function (nx, global) {

  nx.RootClass = function () {
  };

  var methods = nx.mix({
    toString: function () {
      return '[object ' + this.__type__ + ']';
    },
    base: function () {
      //TODO:NOT SUPPORT ES5 `USE STRICT` MODE
      var method = this.base.caller.__base__;
      if (method) {
        return method.apply(this, arguments);
      }
    },
    is: function (type) {
      var selfType = this.__type__;
      if (selfType === type) {
        return true;
      } else {
        var base = this.__base__;
        if (base) {
          return nx.is(base.prototype, type);
        } else {
          return false;
        }
      }
    },
    has: function (name) {
      return name in this;
    },
    get: function (name) {
      var type = this.memberType(name);
      switch (type) {
        case 'method':
        case 'property':
          return this[name];
        case 'static':
          return this.constructor[name];
      }
    },
    set: function (name, value) {
      this[name] = value;
    },
    gets: function () {
      var result = {};
      nx.each(this.__properties__, function (val, name) {
        result[name] = this.get(name);
      }, this);
      return result;
    },
    sets: function (target) {
      nx.each(target, function (val, name) {
        this.set(name, val);
      }, this);
    },
    getMeta: function (name) {
      return this.__meta__[name];
    },
    setMeta: function (name, value) {
      this.__meta__[name] = value;
    },
    member: function (name) {
      return this['@' + name] || this[name] || this.constructor[name];
    },
    memberType: function (name) {
      var member = this.member(name);
      return member.__type__;
    },
    __is__: function (type) {
      return this.is(type);
    },
    __has__: function (name) {
      return this.has(name);
    },
    __get__: function (name) {
      return this.get(name);
    },
    __set__: function (name, value) {
      return this.set(name, value);
    },
    __gets__: function () {
      return this.gets();
    },
    __sets__: function (target) {
      return this.sets(target);
    }
  }, nx.event);

  var meta = {
    constructor: nx.RootClass,
    __type__: 'nx.Object',
    __classId__: 0,
    __init__: nx.noop,
    __mixins__: [],
    __statics__: {},
    __properties__: {},
    __methods__: methods
  };

  nx.mix(nx.RootClass.prototype, meta, methods);
  nx.mix(nx.RootClass, meta, methods);


}(nx, nx.GLOBAL));

(function (nx, global) {

  nx.defineProperty = function (target, name, meta) {
    var key = '@' + name;
    var valType;
    meta = (nx.isObject(meta)) ? meta : {
      value: meta
    };
    var getter, setter, descriptor;
    var value, filed;

    if ('value' in meta) {
      value = meta.value;
      filed = '_' + name;
      valType = nx.type(value);

      getter = function () {
        if (filed in this) {
          return this[filed];
        } else {
          return nx.isFunction(valType) ? value.call(this) : value;
        }
      };

      setter = function (inValue) {
        this[filed] = inValue;
      };

    } else {
      getter = meta.get || nx.noop;
      setter = meta.set || nx.noop;
    }

    //remain base setter/getter:
    if (key in target) {
      getter.__base__ = target[key].get;
      setter.__base__ = target[key].set;
    }

    descriptor = target[key] = {
      __meta__: meta,
      __name__: name,
      __type__: 'property',
      get: getter,
      set: setter,
      configurable: true
    };

    Object.defineProperty(target, name, descriptor);

    return descriptor;
  };

  nx.defineMethod = function (target, name, meta) {
    var descriptor = {
      __meta__: meta,
      __name__: name,
      __type__: 'method'
    };
    nx.mix(meta, descriptor);
    target[name] = meta;
    return descriptor;
  };


  nx.defineStatic = function (target, name, meta) {
    var descriptor = {
      __meta__: meta,
      __name__: name,
      __type__: 'static'
    };
    nx.mix(meta, descriptor);
    target[name] = meta;
    return descriptor;
  };


}(nx, nx.GLOBAL));

(function (nx, global) {

  var classId = 1,
    instanceId = 0;
  var instanceMap = {};
  var ArraySlice = Array.prototype.slice;

  var __ = {
    distinct: function (inArray) {
      var result = [],
        map = {},
        key;

      inArray.forEach(function (val) {
        key = val.__type__;
        if (!map[key]) {
          map[key] = true;
          result.push(val);
        }
      });
      return result || inArray;
    },
    union: function () {
      var result = [];
      nx.each(arguments, function (item) {
        result = result.concat(item || [])
      });
      return __.distinct(result);
    }
  };

  function LifeCycle(inType, inMeta) {
    this.type = inType;
    this.meta = inMeta;
    this.base = inMeta.extend || nx.RootClass;
    this.__classMeta__ = {};
    this.__Class__ = null;
    this.__constructor__ = null;
  }

  LifeCycle.prototype = {
    constructor: LifeCycle,
    initMetaProcessor: function () {
      var methods = this.meta.methods || {};
      nx.mix(this.__classMeta__, {
        __type__: this.type,
        __meta__: this.meta,
        __base__: this.base,
        __classId__: classId++,
        __init__: methods.init || this.base.__init__
      });
    },
    createClassProcessor: function () {
      var self = this;
      this.__Class__ = function () {
        this.__id__ = ++instanceId;
        this.__listeners__ = {};
        self.__constructor__.apply(this, ArraySlice.call(arguments));
        instanceMap[instanceId] = this;
      };
    },
    mixinItemsProcessor: function () {
      var base = this.base;
      var mixins = this.meta.mixins;
      var classMeta = this.__classMeta__;
      var mixinMixins = [],
        mixinMethods = {},
        mixinProperties = {},
        mixinStatics = {},

        mixItemMixins = [],
        mixinItemMethods = {},
        mixinItemProperties = {},
        mixinItemStatics = {};

      nx.each(mixins, function (mixinItem) {
        mixItemMixins = mixinItem.__mixins__;
        mixinItemMethods = mixinItem.__methods__;
        mixinItemProperties = mixinItem.__properties__;
        mixinItemStatics = mixinItem.__statics__;

        mixinMixins = mixinMixins.concat(mixItemMixins);
        nx.mix(mixinMethods, mixinItemMethods);
        nx.mix(mixinProperties, mixinItemProperties);
        nx.mix(mixinStatics, mixinItemStatics);
      });

      classMeta.__mixins__ = __.union(mixinMixins, base.__mixins__, mixins);
      classMeta.__methods__ = nx.mix(mixinMethods, base.__methods__);
      classMeta.__properties__ = nx.mix(mixinProperties, base.__properties__);
      classMeta.__statics__ = nx.mix(mixinStatics, base.__statics__);
    },
    inheritProcessor: function () {
      var classMeta = this.__classMeta__;
      this.defineMethods(classMeta);
      this.defineProperties(classMeta);
      this.defineStatics(classMeta);
    },
    defineMethods: function (inClassMeta) {
      var metaMethods = this.meta.methods || {};
      var methods = Object.keys(metaMethods);
      var extendMethods = inClassMeta.__methods__;
      var target = this.__Class__.prototype;

      nx.each(extendMethods, function (method, name) {
        nx.defineMethod(target, name, method);
        if (methods.indexOf(name) > -1) {
          nx.defineMethod(target, name, metaMethods[name]);
          target[name].__base__ = method;
        }
      });

      nx.each(metaMethods, function (method, name) {
        if (!target[name]) {
          nx.defineMethod(target, name, method);
        }
      });

      inClassMeta.__methods__ = nx.mix(extendMethods, metaMethods);

    },
    defineProperties: function (inClassMeta) {
      var metaProperties = this.meta.properties || {};
      var properties = Object.keys(metaProperties);
      var extendProperties = inClassMeta.__properties__;
      var target = this.__Class__.prototype;
      nx.each(extendProperties, function (prop, name) {
        var member,
          extendMember;
        member = nx.defineProperty(target, name, prop);
        if (properties.indexOf(name) > -1) {
          extendMember = nx.defineProperty(target, name, metaProperties[name]);
          if (extendMember.set) {
            extendMember.set.__base__ = member.set;
          }
          extendMember.get.__base__ = member.get;
        }
      });
      nx.each(metaProperties, function (prop, name) {
        if (!target[name]) {
          nx.defineProperty(target, name, prop);
        }
      });
      inClassMeta.__properties__ = nx.mix(extendProperties, metaProperties);
    },
    defineStatics: function (inClassMeta) {
      var staticsMembers = nx.mix(inClassMeta.__statics__, this.meta.statics);
      nx.each(staticsMembers, function (staticMeta, staticKey) {
        nx.defineStatic(this.__Class__, staticKey, staticMeta);
      }, this);
    },
    methodsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      var mixins = classMeta.__mixins__;
      this.__constructor__ = function () {
        nx.each(mixins, function (mixItem) {
          mixItem.__init__.call(this);
        }, this);
        classMeta.__init__.apply(this, ArraySlice.call(arguments));
      };
    },
    staticsConstructorProcessor: function () {
      var statics = this.meta.statics;
      if (statics && statics.init) {
        statics.init.call(this.__Class__);
      }
    },
    registerNsProcessor: function () {
      var type = this.type,
        Class = this.__Class__;
      var classMeta = this.__classMeta__;

      nx.mix(Class.prototype, classMeta, {
        constructor: this.__Class__
      });

      nx.mix(Class, classMeta);
      if (type !== 'nx.Anonymous') {
        nx.path(global, type, Class);
      }
    }
  };


  nx.declare = function (inType, inMeta) {
    var type = typeof(inType) === 'string' ? inType : "nx.Anonymous";
    var meta = inMeta || inType;
    var lifeCycle = new LifeCycle(type, meta);
    lifeCycle.initMetaProcessor();
    lifeCycle.createClassProcessor();
    lifeCycle.mixinItemsProcessor();
    lifeCycle.inheritProcessor();
    lifeCycle.methodsConstructorProcessor();
    lifeCycle.staticsConstructorProcessor();
    lifeCycle.registerNsProcessor();
    return lifeCycle.__Class__;
  };


  if (nx.DEBUG) {
    nx.$ = function (inId) {
      return instanceMap[inId];
    };
  }

}(nx, nx.GLOBAL));
