module("oop-String.js");

test("nx.oop-base", function () {

    ok(nx.RootClass.__type__ === 'nx.RootClass', 'RootClass.__type__ is nx.RootClass');
    ok(nx.RootClass.__classId__ === 0, 'Class id 0');
    ok(nx.RootClass.__init__ === nx.noop, 'Default __init__ is nx.noop');

});
