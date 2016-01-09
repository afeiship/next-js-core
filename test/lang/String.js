module("String.js");

var StringUtil = nx.lang.String;
test("nx.lang.String--repeat", function () {
    ok(StringUtil.repeat('a', 3) === 'aaa', 'char ~a~ repeat 3 times');
    ok(StringUtil.repeat(' ', 5) === '     ', 'space repeat 5 times');
});


test("nx.lang.String--format", function () {
    var arrStr = '{0} am a good {1}';
    var arrArgs = ['XiaoMing', 'person'];
    var objString = '{index} the news title is:"{title}",pupdate is ->{pupdate}, other info:->by:{desc.name},version:{desc.version}';
    var objArs = {
        index: 0,
        title: 'No news is good News',
        pupdate: '2015-06-13',
        desc: {
            name: 'Tom',
            version: 0.1
        }
    };
    ok(StringUtil.format(arrStr, arrArgs) === 'XiaoMing am a good person', 'Array format wonxs!');
    ok(StringUtil.format(objString, objArs) === '0 the news title is:"No news is good News",pupdate is ->2015-06-13, other info:->by:Tom,version:0.1', 'Object format wonxs!');
});

