(function (nx, global) {

  nx.defineProperty = function (target, name, meta) {
    var key = '@' + name;
    meta = (nx.isObject(meta)) ? meta : {
      value: meta
    };
    var getter, setter, descriptor;
    var value, filed;

    if ('value' in meta) {
      value = meta.value;
      filed = '_' + name;

      getter = function () {
        if (filed in this) {
          return this[filed];
        } else {
          return nx.isFunction(value) ? value.call(this) : value;
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
