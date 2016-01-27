module("oop-normal.js");

test('norml-Anonymous', function () {
    var Class1 = nx.declare({
        methods: {
            method1: function () {
                return 'method1-fn';
            }
        }
    });

    var Class2 = nx.declare({
        methods: {
            method1: function () {
                return 'method1-fn';
            }
        }
    });
    var cl = new Class1;
    var c2 = new Class2;
    ok(cl.method1 !== c2.method1, 'not the same class');
});

test('norml-init', function () {
    var num1 = 1;
    nx.declare('demo.Class1', {
        methods: {
            init: function () {
                num1++;
              debugger;
            }
        }
    });

  debugger;
    var c1 = new demo.Class1();
    ok(num1 == 2, 'Init has execute!');
    ok(demo.Class1.__methods__.length === 1, 'Only one method.')
});

test('normal-properties-', function () {
    var Class1 = nx.declare({
        properties: {
            $prop1: {
                get: function () {
                    return 'prop1';
                },
                set: function (inValue) {
                    return inValue + '$prop1-setter';
                }
            }
        }
    });

    var Class2 = nx.declare({
        extend: Class1,
        properties: {
            $prop1: {
                get: function () {
                    return this.base() + 'prop2';
                }
            }
        }
    });


    var c2 = new Class2;

    ok(c2.$prop1()==='prop1prop2','Property extended!')
});
