module('nx-define-meta');

test('nx-defineProperty', function () {
  var properties = {
    prop1: 123,
    prop2: [1, 2, 3, 45],
    prop3: 'teset1',
    prop4: null,
    prop5: {
      value: 'etst1'
    },
    prop6: {
      value: {
        name: 'fei',
        age: 100
      }
    },
    prop7: {
      value: function () {
        var a = 12;
        var b = 234;
        return {
          sum: a + b,
          div: a - b
        };
      }
    },
    prop8: false,
    prop9: true,
    prop10: 0
  };

  var obj = {};

  nx.each(properties, function (key, value) {
    nx.defineProperty(obj, key, value);
  });

  ok(obj.prop1 === 123, 'default value.');
  deepEqual(obj.prop2, [1, 2, 3, 45], 'default value.');

  deepEqual(obj.prop7, {
    sum: 246,
    div: -222
  }, 'default value.');


});


