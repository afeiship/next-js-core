(function (nx, global) {

  nx.RootClass = function () {
  };

  var methods = nx.mix({
    toString: function () {
      return '[Class ' + this.__type__ + ']';
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
      nx.each(this.__properties__, function (name, val) {
        result[name] = this.get(name);
      }, this);
      return result;
    },
    sets: function (target) {
      nx.each(target, function (name, val) {
        this.set(name, val);
      }, this);
    },
    getMeta: function (name) {
      return this.__meta__[name];
    },
    setMeta: function (name, value) {
      this.__meta__[name] = value;
    },
    member: function (inName) {
      return this[inName] || this['@on' + inName];
    },
    memberMeta: function (inName) {
      var member = this.member(inName);
      return member ? member.__meta__ : member;
    },
    memberType: function (inName) {
      var meta = this.memberMeta(inName);
      switch (typeof meta) {
        case 'object':
          return 'property';
        case 'string':
          return 'event';
        case 'function':
          return 'method';
        case 'undefined':
          return 'undefined';
      }
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
    __type__: 'nx.RootClass',
    __classId__: 0,
    __init__: nx.noop,
    __static_init__: nx.noop,
    __mixins__: [],
    __statics__: {},
    __properties__: {},
    __methods__: methods
  };

  nx.mix(nx.RootClass.prototype, meta, methods);
  nx.mix(nx.RootClass, meta, methods);


}(nx, nx.GLOBAL));
