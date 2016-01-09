(function (nx, global) {

    nx.declare('nx.lang.Object', {
        statics: {
            keys: Object.keys || function (inObject) {
                var result = [];
                for (result[result.length] in inObject);
                return result;
            },
            values: function () {
            }
        }
    });

}(nx, nx.GLOBAL));