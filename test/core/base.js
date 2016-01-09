module("base.js");

test("nx.mix", function () {
    var target = {};
    var arg = new Object();
    arg.x = 1;
    arg.y = 2;
    arg.func = function () {
        console.log("test")
    };
    var arg2 = new Object();
    arg2.x = 5;
    arg2.z = 2;
    var arg3 = {a: {b: 1, c: 2}, d: [1, 2, 3]};

    var result = nx.mix(target, arg, arg2, arg3);
    equal(5, target.x, "property override");
    deepEqual(target.func, arg.func, "extend function");
    deepEqual(target.d, arg3.d, "array function");
    deepEqual(target.a, arg3.a, "object function");
    target = {};
    result = nx.mix(target, {});
    deepEqual(target, {}, "empty object");
    target = {};
    result = nx.mix(target);
    deepEqual(target, {}, "empty object")
});


test("nx.each", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    };
    var func = {};
    func.__each__ = testfunc;
    nx.each(func, testfunc);
    equal(1, count, "object with each func")

});


test("nx.each", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    };
    var func = [];
    nx.each(func, testfunc);
    equal(0, count, "empty array");
});

test("nx.each", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    };
    var func = document.images;
    nx.each(func, testfunc);
    equal(0, count, "empty native collection")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function (i, j) {
        count += 1
    };
    var func = [101, 102];
    nx.each(func, testfunc)
    equal(2, count, "array * 2")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function (i, j) {
        count += 1
    };
    var arg2 = new Object();
    arg2.x = 5;
    arg2.z = 2;
    arg2.obj = {a: {b: 1, c: 2}, d: [1, 2, 3]};
    nx.each(arg2, testfunc);
    equal(3, count, "object")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function (i, j) {
        count += 1
    };
    var arg2 = new Object();
    nx.each(arg2, testfunc);
    equal(0, count, "empty object")
});

test('nx.each', function () {
    var arr = [1, 2, 3, 4];
    var newArr = [];
    var testBreaker = function (val, key) {
        if (val <= 3) {
            newArr.push(val);
        } else {
            return nx.BREAKER;
        }
    };
    nx.each(arr, testBreaker);
    equal(3, newArr.length, "nx.BREAKER wonxs!")
});


test('nx.each-->arguments', function () {
    function add() {
        var result = 0;
        nx.each(arguments, function (item) {
            result += item;
        });
        return result;
    }

    var sum = add(1, 2, 3, 4, 5);
    ok(15 === sum, 'Arguments can be in this each function.');
});


test("nx.type", function () {
    var num1 = 123;
    var num2 = new Number(233);
    var null1 = null;
    var undef = void 0;
    var bol = true;
    var str1 = 'abc';
    var str3 = new String('abcd');
    var fn1 = function () {
    };
    //var fn2 = window.alert;
    var arr1 = [1, 2, 3];
    var arr2 = new Array(2, 2, 3);
    var date1 = new Date();
    var reg1 = /abc/;
    var reg2 = new RegExp('abc');
    var obj = {name: 'fei'};
    var obj2 = new Object({
        name: 'feizheng'
    });
    var err1 = new Error('error?');


    ok(nx.type(num1) === 'Number', '123 is number');
    ok(nx.type(num2) === 'Number', '233 is number');
    ok(nx.type(null1) === 'Null', 'null1 is null');
    ok(nx.type(undef) === 'Undefined', 'void 0 is undefined');
    ok(nx.type(bol) === 'Boolean', 'true is Boolean');
    ok(nx.type(str1) === 'String', 'str1 is String');
    ok(nx.type(str3) === 'String', 'str3 is String');
    ok(nx.type(fn1) === 'Function', 'fn1 is Function');
    //ok(nx.type(fn2) === 'Function', 'alert is Function');
    ok(nx.type(arr1) === 'Array', 'arr1 is Array');
    ok(nx.type(arr2) === 'Array', 'arr2 is Array');
    ok(nx.type(date1) === 'Date', 'date1 is Date');
    ok(nx.type(reg1) === 'RegExp', 'reg1 is RegExp');
    ok(nx.type(reg2) === 'RegExp', 'reg2 is RegExp');
    ok(nx.type(obj) === 'Object', 'obj is Object');
    ok(nx.type(obj2) === 'Object', 'obj2 is Object');
    ok(nx.type(err1) === 'Error', 'err1 is an Error');
});


test("nx.path", function () {
    var jobj1 = {a: '1', b: {c: {d: "2"}}, e: ['3', '4', '5', '6']};
    var jobj2 = [
        {a: '1', b: '2', c: {d: {e: '3'}}},
        {a: '4', b: '5', c: {d: {e: '6'}}},
        '7',
        ['8', '9']
    ];

    // need json, array
    equal(nx.path(jobj1, "a"), "1", "json check");
    equal(nx.path(jobj1, "b.c.d"), "2", "json child check");
    equal(nx.path(jobj1, "e.1"), "4", "json check array");
    deepEqual(nx.path(jobj1, "e"), ['3', '4', '5', '6'], "array");

    equal(nx.path(jobj2, "0.a"), "1", "check prop");
    equal(nx.path(jobj2, "0.c.d.e"), "3", "check prop");
    equal(nx.path(jobj2, "1.b"), "5", "check prop");
    equal(nx.path(jobj2, "2"), "7", "check prop");
    deepEqual(nx.path(jobj2, "3"), ['8', '9'], "check prop");
    nx.path(jobj2, "3", ['10']);
    deepEqual(nx.path(jobj2, "3"), ['10']);
    nx.path(jobj2, "4.new.net", ['11']);
    deepEqual(nx.path(jobj2, "4.new.net"), ['11']);
});
