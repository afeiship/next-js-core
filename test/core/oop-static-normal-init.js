module("oop-static-normal-init.js");

var number1 = 1;
nx.declare('demo.MyStaticClass', {
  statics: {
    init: function () {
      number1++
    },
    method1: function () {
      return 'method1-value'
    }
  },
  methods: {
    init: function () {
      number1++;
    }
  }
});

test('Static without constructor', function () {
  ok(number1 = 2, 'static init has execute!');
  var DemoMyStaticClass = new demo.MyStaticClass();
  ok(number1==3,'static && normal init all has execute!');
});
