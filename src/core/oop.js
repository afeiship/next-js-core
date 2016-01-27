(function (nx, global) {

  //private container:
  var classId = 1,
    instanceId = 1;
  var ArraySlice = Array.prototype.slice;
  var __ = {
    inherit: function (inClass) {
      var prototype;

      function Class() {
      }

      Class.prototype = inClass.prototype;
      prototype = new Class();
      prototype.constructor = inClass;
      return prototype;
    },
    distinct: function (inArray) {
      var result = [],
        map = {},
        type,
        key;

      nx.each(inArray, function (val) {
        type = typeof(val);
        if (type === 'string') {
          key = type + val;
        } else {
          key = val.__type__;
        }
        if (!map[key]) {
          map[key] = true;
          result.push(val);
        }
      });
      return result || inArray;
    },
    indexOf: function (inArray, inItem) {
      var result = -1;
      nx.each(inArray, function (item, index) {
        if (inItem === item) {
          result = index;
          return nx.BREAKER;
        }
      });
      return result;
    },
    union: function () {
      var result = [];
      nx.each(arguments, function (item) {
        result = result.concat(item || [])
      });
      return __.distinct(result);
    },
    keys: (function () {
      return Object.keys || function (obj) {
          var result = [];
          for (result[result.length] in obj);
          return result;
        };
    }())
  };

  //responsibility chain pattern:
  function LifeCycle() {
    this.__Class__ = null;
    this.__Constructor__ = nx.noop;
  }

  LifeCycle.prototype = {
    constructor: LifeCycle,
    metaInitialProcessor: function (inMeta, inClassMeta) {
      var base = inClassMeta.__base__ = inMeta.extend || nx.RootClass;
      var methods = inMeta.methods,
        statics = inMeta.statics;
      inClassMeta.__static__ = inMeta.statics && !inMeta.methods;
      inClassMeta.__classId__ = classId++;
      inClassMeta.__init__ = (methods && methods.init) || base.__init__;
      inClassMeta.__static_init__ = (statics && statics.init);
      inClassMeta.$base = base.prototype;
    },
    createClassProcessor: function (inMeta, inClassMeta) {
      var self = this;
      if (inClassMeta.__static__) {
        this.__Class__ = function () {
          throw new Error('Cannot instantiate static class.');
        };
      } else {
        this.__Class__ = function () {
          this.__instanceId__ = instanceId++;
          this.__listeners__ = {};
          self.__Constructor__.apply(this, ArraySlice.call(arguments, 0) || {});
        };
      }
    },
    mixinsProcessor: function (inMeta, inClassMeta) {
      var base = inClassMeta.__base__;
      var mixins = inClassMeta.__mixins__ = __.union(base.__mixins__, inMeta.mixins);
      var mixinStatics = {},
        mixinEvents = [],
        mixinProperties = [],
        mixinMethods = [];

      nx.each(mixins, function (mixItem) {
        nx.mix(mixinStatics, mixItem.__statics__);
        mixinEvents = mixinEvents.concat(mixItem.__events__);
        mixinProperties = mixinProperties.concat(mixItem.__properties__);
        mixinMethods = mixinMethods.concat(mixItem.__methods__);
      }, this);

      inClassMeta.__statics__ = mixinStatics;
      inClassMeta.__events__ = mixinEvents;
      inClassMeta.__properties__ = mixinProperties;
      inClassMeta.__methods__ = mixinMethods;
    },
    staticsProcessor: function (inMeta, inClassMeta) {
      var base = inClassMeta.__base__;
      var statics = nx.mix(inClassMeta.__statics__, base.__statics__, inMeta.statics);
      inClassMeta.__methods__ = __.keys(statics);
      nx.mix(this.__Class__, statics);
    },
    eventsProcessor: function (inMeta, inClassMeta) {
      var base = inClassMeta.__base__;
      inClassMeta.__events__ = __.union(inClassMeta.__events__, base.__events__, inMeta.events);
    },
    propertiesProcessor: function (inMeta, inClassMeta) {
      var base = inClassMeta.__base__;
      inClassMeta.__properties__ = __.union(
        inClassMeta.__properties__,
        base.__properties__,
        __.keys(inMeta.properties || {})
      );
    },
    methodsProcessor: function (inMeta, inClassMeta) {
      var base = inClassMeta.__base__;
      inClassMeta.__methods__ = __.union(
        inClassMeta.__methods__,
        base.__methods__,
        __.keys(inMeta.methods || {})
      );
    },
    constructorProcessor: function (inMeta, inClassMeta) {
      var mixins = inClassMeta.__mixins__;
      this.__Constructor__ = function () {
        nx.each(mixins, function (mixItem) {
          mixItem.__init__.call(this);
        }, this);
        inClassMeta.__init__.apply(this, ArraySlice.call(arguments, 0) || {});
      };
    },
    inheritedProcessor: function (inMeta, inClassMeta) {
      var prototype,
        base = inClassMeta.__base__,
        target;
      if (!inClassMeta.__static__) {
        prototype = __.inherit(base);
        target = this.__Class__.prototype = prototype;
      } else {
        target = this.__Class__;
        nx.mix(target, base.prototype);
      }
      this.__mixinMetas(target, inMeta);
      this.__inheritedMethods(target, inClassMeta.__methods__, inMeta);
      this.__inheritedProperties(target, inClassMeta.__properties__, inMeta);
    },
    staticConstructorProcessor: function (inMeta, inClassMeta) {
      //if (inClassMeta.__static__) {
      //this.__Constructor__.call(this.__Class__);
      inClassMeta.__static_init__.call(this.__Class__);
      //}
    },
    registerNamespace: function (inMeta, inClassMeta) {
      var type = inClassMeta.__type__,
        Class = this.__Class__;

      if (!inClassMeta.__static__) {
        nx.mix(Class.prototype, inClassMeta);
      }

      nx.mix(Class, inClassMeta);
      if (type !== 'nx.Anonymous') {
        nx.path(global, type, Class);
      }
    },
    __mixinMetas: function (inTarget, inMeta) {
      var mixins = inMeta.mixins,
        mixMethods,
        mixProperties,
        target;
      var $setter, $getter;
      nx.each(mixins, function (mixItem) {
        mixMethods = mixItem.__methods__;
        mixProperties = mixItem.__properties__;
        target = mixItem.__static__ ? mixItem : mixItem.prototype;
        nx.each(mixMethods, function (mixMethod) {
          inTarget[mixMethod] = target[mixMethod];
        });
        nx.each(mixProperties, function (mixProperty) {
          $setter = '$_setter_' + mixProperty;
          $getter = '$_getter_' + mixProperty;
          inTarget[$setter] = target[$setter];
          inTarget[$getter] = target[$getter];
          inTarget[mixProperty] = target[mixProperty];
        });
      });
    },
    __inheritedMethods: function (inTarget, inMethods, inMeta) {
      var metaMethods = inMeta.methods || {},
        method;

      nx.each(inMethods, function (name) {
        method = metaMethods[name];
        if (method) {
          method.__base__ = inTarget[name];
          inTarget[name] = method;
        }
      });
    },
    __inheritedProperties: function (inTarget, inProperties, inMeta) {
      var $setter, $getter;
      var metaProperties = inMeta.properties || {},
        property;
      nx.each(metaProperties, function (metaProperty, name) {
        var setter, getter;
        property = inTarget[name];
        $setter = '$_setter_' + name;
        $getter = '$_getter_' + name;
        setter = metaProperty.set || nx.noop;
        getter = metaProperty.get || nx.noop;
        if (property) {
          setter.__base__ = inTarget[$setter];
          getter.__base__ = inTarget[$getter];
        }
        inTarget[$setter] = setter;
        inTarget[$getter] = getter;
        inTarget[name] = function (inValue) {
          if (typeof inValue === 'undefined') {
            return getter.call(this);
          } else {
            return setter.call(this, inValue);
          }
        };
      });
    }
  };

  nx.declare = function (inType, inMeta) {
    var Class, classMeta = {},
      meta = classMeta.__meta__ = inMeta || inType,
      lifeCycle = new LifeCycle();

    classMeta.__type__ = typeof(inType) === 'string' ? inType : "nx.Anonymous";

    lifeCycle.metaInitialProcessor(meta, classMeta);
    lifeCycle.createClassProcessor(meta, classMeta);
    lifeCycle.mixinsProcessor(meta, classMeta);
    lifeCycle.staticsProcessor(meta, classMeta);
    lifeCycle.eventsProcessor(meta, classMeta);
    lifeCycle.propertiesProcessor(meta, classMeta);
    lifeCycle.methodsProcessor(meta, classMeta);
    lifeCycle.constructorProcessor(meta, classMeta);
    lifeCycle.inheritedProcessor(meta, classMeta);
    lifeCycle.staticConstructorProcessor(meta, classMeta);
    lifeCycle.registerNamespace(meta, classMeta);
    Class = lifeCycle.__Class__;

    return Class;
  };


}(nx, nx.GLOBAL));
