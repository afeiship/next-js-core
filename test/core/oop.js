module("oop.js");


test("nx.oop-meta", function () {

  var DemoCls = nx.declare('demo.DemoCls', {
    statics: {
      init: function () {
        console.log('static init!', this);
      },
      sMethod1: function () {
        console.log('s method 1!');
      },
      sMethod2: function () {
        console.log('s method 2');
      }
    },
    methods: {
      init: function () {
        console.log('method init!', this);
      },
      method1: function () {
        console.log('method1!');
      },
      method2: function () {
        console.log('method2!');
      }
    }
  });

  var demoCls = new DemoCls();
  console.log(demoCls.meta('statics'));

  //todo:fixed meta method:
  console.log(demoCls.meta('methods'));

  ok(true);

});
