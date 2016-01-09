module("event.js");


test('test on/fire method', function () {

    var obj1 = {};
    nx.event.__listeners__ = {};
    var obserObj = nx.mix(obj1, nx.event);
    var counter = 1;
    obserObj.on('add', function () {
        counter++;
    });

    ok(1 === counter, 'has not fire event event!');
    obserObj.fire('add');
    ok(2 === counter, 'fire add event!');
});


test('test off/fire method', function () {

    var obj1 = {};
    nx.event.__listeners__ = {};
    var obserObj = nx.mix(obj1, nx.event);
    var counter = 1;
    obserObj.on('add', function () {
        counter++;
    });

    ok(1 === counter, 'has not fire event event!');
    obserObj.off('add');
    obserObj.fire('add');
    ok(1 === counter, 'add event has removed!');
});


test('test event.__listeners__', function () {

    var obj1 = {};
    nx.event.__listeners__ = {};
    var obserObj = nx.mix(obj1, nx.event);
    obserObj.on('add', function (sender, data) {
        //console.log('add & add data:->');
        //console.log(data);
    });

    obserObj.on('add', function (sender, data) {
        //console.log('add2 event...');
        //console.log('data');
    });

    obserObj.on('remove', function (sender, data) {
        //console.log('remove & remove data:->');
        //console.log(data);
    });


    //console.log(obserObj.__listeners__);
    ok(1==1);
});