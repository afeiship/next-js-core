(function (nx, global) {

  function RootClass() {
  }

  var classMeta = {
    __classId__: 0,
    __type__: 'nx.RootClass',
    __init__: nx.noop,
    __mixins__: [],
    __statics__: {},
    __events__: [],
    __properties__: [],
    __methods__: []
  };

  var prototype = RootClass.prototype = {
    constructor: RootClass,
    base: function () {
      var method = this.base.caller.__base__;
      if (method) {
        return method.apply(this, arguments);
      }
    },
    init: function () {
      //will be implement
    },
    destroy: function () {
      //will be implement
    },
    toString: function () {
      return '[Class@' + this.__type__ + ']';
    }
  };

  nx.mix(RootClass, classMeta);
  nx.mix(prototype, classMeta);
  nx.mix(prototype, nx.event);

  nx.RootClass = RootClass;

}(nx, nx.GLOBAL));
