module('nx-oop');

test('nx.declare->basic', function () {

  var counter = 0;
  var Class1 = nx.declare({
    methods: {
      init: function () {
        counter++;
      },
      hello: function () {
        return 'hello world';
      }
    }
  });

  var Class2 = nx.declare('test.demo.package1.Class2', {
    methods: {
      test1: function () {
        return 'test1';
      }
    }
  });

  var cl1 = new Class1();
  var cls2 = new Class2();
  var toString = cl1.toString();
  var toString2 = cls2.toString();
  ok(cl1.hello() === 'hello world', 'Hello world works!');
  ok('[Class nx.Anonymous]' === toString, 'nx.Anonymous toString!');
  ok('[Class test.demo.package1.Class2]' === toString2, 'Naming Class toString!');
  ok(1 === counter, 'One instance.');
});


test('nx.declare->with statics', function () {

  var staticInit;
  var Class1 = nx.declare({
    statics: {
      init: function () {
        staticInit = this.say();
      },
      self: function () {
        return this;
      },
      say: function () {
        return 'static say!';
      }
    }
  });

  ok(Class1 == Class1.self(), '`this` is the Class');
  ok(staticInit === 'static say!', 'Has execute when app start');

});


test('nx.declare->statics init', function () {
  var Class1 = nx.declare({
    statics: {
      init: function () {

      }
    }
  });

  ok(true);
});


test('nx.declare->with properties', function () {

  var Class1 = nx.declare({
    properties: {
      prop1: {
        value: 1234
      },
      PI: {
        get: function () {
          return 3.14;
        }
      }
    }
  });
  var cl1 = new Class1();
  ok(cl1.prop1 == 1234);
  ok(cl1.PI == 3.14);

  cl1.prop1 = 'test1';
  cl1.PI = 'test2';
  ok(cl1.prop1 === 'test1', 'property can be set!');
  ok(cl1.PI === 3.14, 'readonly property can not be set!');


});


test('nx-oop-mixin-init', function () {
  var abilities = [];
  var Man = nx.declare({});
  var Cls1 = nx.declare({
    methods: {
      addSpeed: function () {
        abilities.push('speed');
      }
    }
  });


  var Cls2 = nx.declare({
    methods: {
      addLight: function () {
        abilities.push('light');
      }
    }
  });


  var Cls3 = nx.declare({
    methods: {
      addStrength: function () {
        abilities.push('srength');
      }
    }
  });


  var SuperMan = nx.declare({
    mixins: [
      Cls1,
      Cls2,
      Cls3
    ],
    methods: {
      showMuscle: function () {
        this.addSpeed();
        this.addLight();
        this.addStrength();
        return abilities.join('-');
      }
    }
  });

  var superman = new SuperMan();
  window.superman = superman;

  ok(superman.showMuscle() === 'speed-light-srength', 'Mixins cls1/2/3 methods');

});


test('nx.decalre-extends', function () {

  nx.declare('Person', {
    methods: {
      init: function (inName, inSex) {
        this.name = inName;
        this.sex = inSex;
      }
    }
  });

  nx.declare('Employee', {
    extends: Person,
    methods: {
      init: function (inName, inSex, inEmployeeId) {
        this.base(inName, inSex);
        this.employeeId = inEmployeeId;
      }
    }
  });


  var employee1 = new Employee('fei', 'Male', 796013);
  ok(employee1.employeeId === 796013);
  ok(employee1.name === 'fei');
  ok(employee1.sex === 'Male');
});


test('nx.declare->memberType', function () {
  var Class1 = nx.declare({
    statics: {
      static1: function () {
        return 'test1 static';
      }
    },
    properties: {
      prop1: {
        value: [1, 2, 3, 4]
      }
    },
    methods: {
      method1: function () {
        return 'method1';
      }
    }
  });

  var instance = new Class1();
  var member1 = instance.memberType('static1');
  var member2 = instance.memberType('prop1');
  var member3 = instance.memberType('method1');

  ok(member1 === 'static', 'Staic member');
  ok(member2 === 'property', 'Property member');
  ok(member3 === 'method', 'Method member');

});
