module('core.Resources');

test('Resource-basic', function () {

    var rs1 = nx.Resources.getInstance();
    var rs2 = nx.Resources.getInstance();

    ok(rs1===rs2,'Get single instance resources');
    rs1.setResource('test1','abc');
    equal('abc',rs1.getResource('test1'),'Set/get');

});
