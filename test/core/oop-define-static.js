module("oop-static-true.js");

var number1 = 1;
nx.declare('demo.MyStaticClass', {
    statics: {
        method1: function () {
            return 'method1-value'
        }
    }
});

nx.declare('demo.StaticWithInitClass', {
    statics: {
        init: function () {
            console.log('static init?');
            number1++;
        },
        method2: function () {
            return 'method2-value';
        }
    }
});


nx.declare('demo.TheFlash', {
    properties: {
        $prop1: {
            get: function () {
                return 'prp1'
            }
        }
    },
    statics: {
        run: function () {
            return 'run'
        }
    }
});


nx.declare('demo.StaticSpider', {
    properties: {
        $prop2: {
            get: function () {
                return 'prp2'
            }
        }
    },
    statics: {
        fly: function () {
            return 'fly';
        }
    }
});

nx.declare('demo.RunSpider', {
    mixins: [
        demo.TheFlash,
        demo.StaticSpider
    ],
    properties: {
        $prop3: {
            get: function () {
                return 'prp3'
            }
        }
    },
    statics: {
        init: function () {
            console.log(this.fly() + ' is who?');
        },
        superMethod: function () {
            return this.run() + this.fly();
        }
    }
});


nx.declare('demo.Properties1', {
    properties: {
        $prop1: {
            get: function () {
                return this._$prop1 || 'fei';
            },
            set: function (inValue) {
                this._$prop1 = inValue;
            }
        }
    },
    statics: {
        method1: function () {
            console.log('i am static method!');
        }
    }
});

var TestStaticsCls=nx.declare({
    statics:{
        init:function(){
            this.m1();
            this.m2();
        },
        m1:function(){
            console.log('m1');
        },
        m2:function(){
            console.log('m2');
        }
    }
});

test('Static without constructor', function () {
    var DemoMyStaticClass = demo.MyStaticClass;
    ok(DemoMyStaticClass.__type__ === 'demo.MyStaticClass', 'test class meta infomation.');
    ok('method1-value' === DemoMyStaticClass.method1(), 'test static method');
});

test('Static with constructor', function () {
    ok(2 === number1, 'init method has execute!');
});


test('Static with mixins', function () {
    ok('runfly' === demo.RunSpider.superMethod());
    ok('prp1' === demo.RunSpider.$prop1());
    ok('prp2' === demo.RunSpider.$prop2());
    ok('prp3' === demo.RunSpider.$prop3());
});