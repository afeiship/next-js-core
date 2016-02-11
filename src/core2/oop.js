(function (nx, global) {

  var classId = 1,
    instanceId = 0;
  var instanceMap = {};
  var ArraySlice = Array.prototype.slice;

  var __ = {
    distinct: function (array) {
      var result = [],
        map = {},
        key;

      array.forEach(function (val) {
        key = val.__type__;
        if (!map[key]) {
          map[key] = true;
          result.push(val);
        }
      });
      return result || array;
    },
    union: function () {
      var result = [];
      nx.each(arguments, function (index, item) {
        result = result.concat(item || []);
      });
      return __.distinct(result);
    }
  };

  function LifeCycle(type, meta) {
    this.type = type;
    this.meta = meta;
    this.base = meta.extend || nx.RootClass;
    this.$base = this.base.prototype;
    this.__classMeta__ = {};
    this.__Class__ = null;
    this.__constructor__ = null;
  }

  LifeCycle.prototype = {
    constructor: LifeCycle,
    initMetaProcessor: function () {
      var methods = this.meta.methods || {};
      var statics = this.meta.statics || {};
      nx.mix(this.__classMeta__, {
        __type__: this.type,
        __meta__: this.meta,
        __base__: this.base,
        __classId__: classId++,
        __init__: methods.init || this.base.__init__,
        __static_init__: statics.init || this.base.__static_init__
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

      nx.each(mixins, function (index, mixinItem) {
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
    defineMethods: function (classMeta) {
      var metaMethods = this.meta.methods || {};
      var methods = Object.keys(metaMethods);
      var extendMethods = classMeta.__methods__;
      var target = this.__Class__.prototype;

      nx.each(extendMethods, function (name, method) {
        nx.defineMethod(target, name, method);
        if (methods.indexOf(name) > -1) {
          nx.defineMethod(target, name, metaMethods[name]);
          target[name].__base__ = method;
        }
      });

      nx.each(metaMethods, function (name, method) {
        if (!target[name]) {
          nx.defineMethod(target, name, method);
        }
      });

      classMeta.__methods__ = nx.mix(extendMethods, metaMethods);

    },
    defineProperties: function (classMeta) {
      var metaProperties = this.meta.properties || {};
      var properties = Object.keys(metaProperties);
      var extendProperties = classMeta.__properties__;
      var target = this.__Class__.prototype;
      nx.each(extendProperties, function (name, prop) {
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
      nx.each(metaProperties, function (name, prop) {
        if (!target[name]) {
          nx.defineProperty(target, name, prop);
        }
      });
      classMeta.__properties__ = nx.mix(extendProperties, metaProperties);
    },
    defineStatics: function (classMeta) {
      var staticsMembers = nx.mix(classMeta.__statics__, this.meta.statics);
      nx.each(staticsMembers, function (staticKey, staticMeta) {
        nx.defineStatic(this.__Class__, staticKey, staticMeta);
      }, this);
    },
    methodsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      var mixins = classMeta.__mixins__;
      this.__constructor__ = function () {
        nx.each(mixins, function (index, mixItem) {
          mixItem.__init__.call(this);
        }, this);
        classMeta.__init__.apply(this, ArraySlice.call(arguments));
      };
    },
    staticsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      classMeta.__static_init__.call(this.__Class__);
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
    nx.$ = function (id) {
      return instanceMap[id];
    };
  }

}(nx, nx.GLOBAL));
