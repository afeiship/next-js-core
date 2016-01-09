(function (global) {

    var nx = this.nx = {
        BREAKER: {},
        VERSION: '0.0.1',
        global: this,
        noop: function () {
        }
    };

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

}(window));
(function (nx, global) {

    var classMeta = {
        __classId__: 0,
        __name__: 'nx.RootClass',
        __static__: false,
        __init__: nx.noop,
        __mixins__: [],
        __methods__: {},
        __statics__: {}
    };

    function RootClass() {
    }

    var RootPrototype = RootClass.prototype = {
        constructor: RootClass,
        base: function () {
            var method = this.base.caller.__base__;
            if (method) {
                return method.apply(this, arguments);
            }
        },
        invoke: function (inName) {
            var method = this[inName],
                args;
            if (method) {
                args = Array.prototype.slice.call(arguments, 1);
                return method.apply(this, args);
            }
        },
        init: function () {
            this.__init__.apply(this, arguments);
        },
        destroy: function () {
        },
        toString: function () {
            return '[class ' + this.__type__ + ']'
        }
    };

    nx.mix(RootClass, classMeta);
    nx.mix(RootPrototype, classMeta);
    nx.RootClass = RootClass;

}(nx, nx.GLOBAL));
(function (nx, global) {

    //private container:
    var classId = 1,
        instanceId = 1;
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
                key = val.__type__;
                if (!map[key]) {
                    map[key] = true;
                    result.push(val);
                }
            });
            return result || inArray;
        }
    };


    nx.declare = function (inType, inMeta) {
        var Class, classMeta = {};
        var prototype, mergeTarget;

        var name = classMeta.__type__ = inType || "nx.Anonymous";
        var meta = classMeta.__meta__ = inMeta || inType;
        var base = classMeta.__base__ = meta.extend || nx.RootClass;
        var $base = classMeta.$base = base.prototype;
        var methods = classMeta.__methods__ = meta.methods || {};
        var static = classMeta.__static__ = meta.static || false;
        var init = classMeta.__init__ = methods.init || base.__init__;
        var statics = classMeta.__statics__ = meta.statics || {};
        var mixins = classMeta.__mixins__ = meta.mixins || [],
            mixMixins = [],
            mixStatics = {},
            mixMethods = {};

        classMeta.__classId__ = classId++;

        if (base.__static__) {
            throw new Error('Static class cannot be inherited.');
        }
        classMeta.__classId__ = classId++;

        if (static) {
            mergeTarget = Class = function () {
                throw new Error('Cannot instantiate static class.');
            };
            //execute init methods:
            init.call(Class, arguments);
        } else {
            Class = function () {
                var baseMixins = base.__mixins__;
                nx.each(baseMixins, function (mixin) {
                    mixin.__init__.call(this);
                }, this);

                this.__id__ = instanceId++;
                init.apply(this, arguments);
            };

            //Extend method class && extend prototype methods:
            mergeTarget = prototype = __.inherit(base);
            Class.prototype = prototype;

            //Get extend mixin && extend events|properties|statics:
            mixins = mixins.concat(base.__mixins__);
            methods = nx.mix({}, base.__methods__, methods);
            statics = nx.mix({}, base.__statics__, statics);

            //Get all the meta mixin:
            nx.each(mixins, function (mixin) {
                mixMixins = mixMixins.concat(mixin.__mixins__);
            });

            //Update classMeta:
            mixins = classMeta.__mixins__ = __.distinct(mixins.concat(mixMixins));

            nx.each(mixins, function (mixin) {
                mixMethods = nx.mix(mixMethods, mixin.__methods__);
                mixStatics = nx.mix(mixStatics, mixin.__statics__);
            });

            //extend mixin merge:
            methods = classMeta.__methods__ = nx.mix(methods, mixMethods);
            statics = classMeta.__statics__ = nx.mix(statics, mixStatics);

            nx.mix(prototype, classMeta);
        }

        //merge the methods to prototype:
        nx.each(methods, function (method, name) {
            if (mergeTarget[name]) {
                method.__base__ = mergeTarget[name];
            }
            mergeTarget[name] = method;
        });

        //add statics member for Class
        nx.mix(Class, classMeta, statics);

        //set the namespace:
        nx.path(global, name, Class);
        return Class;
    };


}(nx, nx.GLOBAL));