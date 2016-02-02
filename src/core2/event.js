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
        nx.each(listeners, function (index, listener) {
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
        nx.each(listeners, function (index, listener) {
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
