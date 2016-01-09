module("Object.js");

var ObjectUtil=nx.lang.Object;
test("nx.lang.Object--keys", function () {
    var obj={
        name:'123',
        age:201
    };
    ok(Object.keys===ObjectUtil.keys,'Chrome use the default keys method');
    deepEqual(ObjectUtil.keys(obj),['name','age'],'wonxs!');
});

