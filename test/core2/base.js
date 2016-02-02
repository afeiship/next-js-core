module('nx-base');

test('nx.type', function () {
    var type1 = null;
    var type2 = undefined;
    var type3 = 124;
    var type4 = 'string';
    var type5 = new Date();
    var type6 = window.alert;
    var type7 = [1, 2, 34];
    var type8 = {name: 'tsest'};
    var type9 = document;
    var type10 = window;
    var type11 = document.createTextNode('test');
    var type12 = document.createElement('div');
    var type13 = /\w+/;
    var type14 = {
        __type__: 'MyClass'
    };



    ok(nx.type(type1) === 'null');
    ok(nx.type(type2) === 'undefined');
    ok(nx.type(type3) === 'number');
    ok(nx.type(type4) === 'string');
    ok(nx.type(type5) === 'date');
    ok(nx.type(type6) === 'function');
    ok(nx.type(type7) === 'array');
    ok(nx.type(type8) === 'object');
    ok(nx.type(type9) === 'object');
    ok(nx.type(type10) === 'object');
    ok(nx.type(type11) === 'object');
    ok(nx.type(type12) === 'object');
    ok(nx.type(type13) === 'regexp');
    ok(nx.type(type14) === 'MyClass');

});




test("nx.is", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    };
    var func = {};
    func.__is__ = testfunc;
    nx.is(func, "String");
    equal(1, count, "object with is func")
});



test('nx.each', function () {
    var arr1 = [1, 2, 3, 4, 5];
    var obj = {
        name: 'xiaoming',
        wife: 'xiaohong',
        children: [
            {
                name: 'mingming',
                age: 10
            },
            {
                name: 'honghong',
                age: 12
            }
        ]
    };
    var arrayLike = {
        0: 'item1',
        1: 'item2',
        2: 'item3',
        length: 3
    };

    var result1 = 0;
    var result2 = 0;
    var keys = [];
    var values = [];
    var obj = {
        rate: 0.8
    };
    var loopTimes = 0;

    //pure array:
    nx.each(arr1, function (idx,item) {
        result1 += item;
    });

    //pure array with context:
    nx.each(arr1, function (idx,item) {
        result2 += item * this.rate;
    }, obj);

    //get object keys:
    nx.each(obj, function (key, item) {
        keys.push(key);
        values.push(item);
    });

    //loop array like object
    nx.each(arrayLike, function (key,item) {
        loopTimes++;
    });

    ok(result1 === 15, 'Result is 15');
    ok(result2 === 12, 'Result is 15 * 0.8');
    deepEqual(keys, Object.keys(obj), 'loop keys ok..');
    ok(loopTimes === arrayLike.length, 'loop array like object');
});


test('nx.concat', function () {
    var arr1 = [1, 2, 3];
    var arr2 = ['A', 'B', 'C'];
    var arr3 = ['a', 'b', 'c'];
    var arr4 = [];

    var result1 = [].concat(arr1, arr2, arr3, arr4);
    ok(result1.length === 9);
    deepEqual(result1, [1, 2, 3, 'A', 'B', 'C', 'a', 'b', 'c']);
});


test('nx.mix', function () {
    var obj1 = {
        name: '123'
    };
    var obj2 = {
        name: 'xiaoming',
        age: 100
    };

    var result = nx.mix(obj1, obj2);
    deepEqual(result, {name: 'xiaoming', age: 100});
});




test('nx.path',function(){
    var obj={
        name:'jack',
        prop1:{
            test1:{
                value:{
                    name:'programming'
                }
            }
        }
    };

    var rs1=nx.path(obj,'prop1.test1.value.name');
    ok(rs1==='programming','Get by path');
    nx.path(obj,'a.b.c.e.f.g.h','testvalue....');
    ok(obj.a.b.c.e.f.g.h==='testvalue....','Set by path');
});
















