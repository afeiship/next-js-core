module('nx.Observable');

test('basic->watch/unwatch', function () {

    var Class1 = nx.declare({
        extends: nx.Observable,
        properties: {
            prop1: 123,
            prop2: 'abc'
        }
    });


    var cl1 = new Class1();
    var cl2 = new Class1();
    var watcher1 = function (a, b, c) {
        console.log(a, b, c);
    };
    var wathcer2 = function () {
        console.log('test watcher..');
    };
    cl1.watch('prop1', watcher1);
    cl1.watch('prop1', wathcer2);

    cl2.watch('prop1', watcher1);
    cl2.watch('prop1', wathcer2);
    cl2.watch('prop2', wathcer2);
    cl2.watch('prop2', wathcer2);


    ok(cl1.__watchers__['prop1'].length === 2, 'Add watcher success!');
    ok(cl2.__watchers__['prop1'].length === 2, 'Add watcher success!');
    ok(cl2.__watchers__['prop2'].length === 2, 'Add watcher success!');

    cl1.unwatch('prop1', watcher1);
    ok(cl1.__watchers__['prop1'].length === 1, 'unwatch watcher success!');
    cl2.unwatch('*');
    ok(cl2.__watchers__['prop1'].length === 0, 'remove all prop1 watchers...');
    ok(cl2.__watchers__['prop1'].length === 0, 'remove all prop2 watchers...');
});


test('nx.Observable/watch/notify', function () {

    var Class1 = nx.declare({
        extends: nx.Observable,
        properties: {
            prop1: 123,
            prop2: 'abc'
        }
    });


    var cls1 = new Class1();
    var counter = 0;
    var counter2 = 0;
    //window.cls1=cls1;
    cls1.watch('prop1', function (a, b, c) {
        counter++;
    });
    cls1.watch('prop2', function (a, b, c) {
        counter2++;
    });

    cls1.prop1 = 12314;
    cls1.prop1 = 123142;
    cls1.prop1 = 12314123;


    ok(counter === 3, 'Observable property changed 3 times!');

    cls1.prop1 = 12314123;
    ok(counter === 3, 'The same value,will not trigger the watcher!');

    //The same value ,I want to trigger:
    cls1.prop2 = {
        name: 'cmd1'
    };
    cls1.prop2 = {
        name: 'cmd1'
    };
    cls1.prop2 = {
        name: 'cmd1'
    };

    ok(counter2 === 3, 'Use the object ,can triggered every time.');
});
