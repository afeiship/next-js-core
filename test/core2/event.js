module('nx-event');


test('nx-event-on/fire', function() {
    function Test() {
        this.__listeners__ = {};
    }
    nx.mix(Test.prototype, nx.event);

    var instance = new Test();
    instance.on('test1', function() {
        console.log('test1 log...');
    });

    instance.on('test1', function() {
        console.log('test2 log...');
    });

    ok(instance.__listeners__['test1'].length===2,'add two events');
});




test('nx-event-off/fire',function () {
	function Test() {
        this.__listeners__ = {};
    }
    nx.mix(Test.prototype, nx.event);

    var counter=0;
    var instance = new Test();
    instance.on('test1', function() {
        counter++;
    });

    instance.on('test1', function() {
        counter++;
    });


    instance.fire('test1');
    ok(2===counter,'Add 2 listeners.');

    instance.off('test1');
    ok(instance.__listeners__['test1'].length===0,'Off all the listeners ,leave the empty array.');
});
