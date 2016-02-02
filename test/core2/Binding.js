module("nx.Binding");
var TestObserve1 = nx.declare('TestObserve1', {
  extends: nx.Observable,
  properties: {
    xprop1: 'test'
  }
});

var TestObserve2 = nx.declare('TestObserve2', {
  extends: nx.Observable,
  properties: {
    yprop1: 'test'
  }
});

var TestObserve3 = nx.declare('TestObserve3', {
  extends: nx.Observable,
  properties: {
    t3: 't3-prop-value'
  }
});

var TestObserve4 = nx.declare('TestObserve4', {
  extends: nx.Observable,
  properties: {
    t4: 't4-prop-value'
  }
});


var TestObserve5 = nx.declare('TestObserve5', {
  extends: nx.Observable,
  properties: {
    t5: 't5-prop-value'
  }
});
var TestObserve6 = nx.declare('TestObserve6', {
  extends: nx.Observable,
  properties: {
    t6: 't6-prop-value'
  }
});

var ComplexObserveObjY = nx.declare('ComplexObserveObjY', {
  extends: nx.Observable,
  properties: {
    x: {
      value: new TestObserve6()
    }
  }
});
var ComplexObserveObj1 = nx.declare('ComplexObserveObj1', {
  extends: nx.Observable,
  properties: {
    prop1: {
      value: new ComplexObserveObjY()
    }
  }
});


test('test/property===>new Binding-forward', function () {


  var test1 = new TestObserve1();
  var test2 = new TestObserve2();

  //single direction binding------------正向绑定->forward:
  //正向绑定的定义：target的属性change,source的属性会跟着change；
  //         但是：source的属性change,target的属性不会change
  var binding1 = new nx.Binding({
    target: test1,
    targetPath: 'xprop1',
    source: test2,
    sourcePath: 'yprop1',
    direction: "->"
  });

  //set test1 prop will trigger test2's property change!!
  //target--->source
  test1.xprop1 = 1234;


  //ok(1==1);
  ok(test2.yprop1 === 1234, '->forward binding works ok!');
  test2.yprop1 = 'test2-value';
  ok(test1.xprop1 !== 'test2-value', '->backward binding works ok!');

});


test('test/property===>new Binding-duplex', function () {


  var test3 = new TestObserve3();
  var test4 = new TestObserve4();

  //双向绑定：
  //双向绑定的定义：target的属性change,source的属性会跟着change；
  //              source的属性change,target的属性也会跟着change
  var binding2 = new nx.Binding({
    target: test3,
    targetPath: 't3',
    source: test4,
    sourcePath: 't4',
    direction: "<>"
  });

  test3.t3 = 1234;
  ok(test4.t4 === 1234, '<>ok,single binding relationship works ok!');

  test4.t4 = 'new t4 value';
  ok(test3.t3 === 'new t4 value', '<>ok single binding works!');


});


test('test/property===>new Binding-backward', function () {

  var test5 = new TestObserve5();
  var test6 = new TestObserve6();


  //single direction binding------------反向绑定->backward:
  //正向绑定的定义：target的属性change,source的属性不会跟着change；
  //         但是：source的属性change,target的属性会change
  var binding3 = new nx.Binding({
    target: test5,
    targetPath: 't5',
    source: test6,
    sourcePath: 't6',
    direction: '<-'
  });

  test5.t5 = 'new t5 value';
  ok('new t5 value' !== test6.t6, '<-test5 t5c change,t6 update!');
  test6.t6 = 'new t6 value';
  ok('new t6 value' === test5.t5, '<-backward binding works!');

});
