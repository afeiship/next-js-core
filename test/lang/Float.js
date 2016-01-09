module("Float.js");

var FloatUtil = nx.lang.Float;
test("nx.lang.Float->add", function () {
    var result1 = FloatUtil.add(0.01, 0.02);
    ok(result1 == 0.03, '0.01+0.02 is ok!');
});

test("nx.lang.Float->add", function () {
    var result1 = FloatUtil.add(550.00, 0.11);
    ok(result1 == 550.11, '550.00+0.11 is ok!');
});



test("nx.lang.Float->sub", function () {
    var result1 = FloatUtil.sub(0.03, 0.01);
    ok(result1 == 0.02, '0.03-0.01 is ok!');
});


test("nx.lang.Float->mul", function () {
    var result1 = FloatUtil.mul(0.2, 0.1);
    ok(result1 == 0.02, '0.2*0.1 is ok!');
});

test("nx.lang.Float->mul", function () {
    var result1 = FloatUtil.mul(50, 0.1);
    ok(result1 == 5, '50*0.1 is ok!');
});


test("nx.lang.Float->div", function () {
    var result1 = FloatUtil.div(0.02, 0.1);
    ok(result1 == 0.2, '0.2/0.1 is ok!');
});

