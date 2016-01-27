(function (nx, global) {

  var rPath = /(?:{)([\w.]+?)(?:})/gm;
  nx.declare('nx.lang.String', {
    statics: {
      repeat: function (inChar, inCount) {
        return (new Array(inCount + 1)).join(inChar);
      },
      pad: function () {
      },
      format: function (inString, inArgs) {
        var result = inString || '';
        var replaceFn = (inArgs instanceof Array) ? function (str, match) {
          return inArgs[match];
        } : function (str, match) {
          return nx.path(inArgs, match);
        };
        result = inString.replace(rPath, replaceFn);
        return result;
      }
    }
  });

}(nx, nx.GLOBAL));
