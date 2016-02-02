module('nx-resources');

test('nx-resources-basic', function () {
    function Test() {
        this.__resources__ = {};
    }

    Test.prototype = nx.resources;


    var test1=new Test();
    ok(test1.setResource,'exist setResource');
    ok(test1.getResource,'exist getResource');
    ok(test1.removeResource,'exist removeResource');

    test1.setResource('test1','abc');

    ok('abc'===test1.getResource('test1'),'Resource can be set/get');
    console.log(test1);

});
