(function (nx, global) {

    nx.declare('nx.lang.Date', {
        statics: {
            now: (function () {
                return Date.now || function () {
                        +new Date();
                    };
            }()),
            format: function (inFormat, inDateInstance) {
                var instance = inDateInstance || new Date();
                var k, result;
                var o = {
                    "M+": instance.getMonth() + 1,
                    "d+": instance.getDate(),
                    "h+": instance.getHours(),
                    "m+": instance.getMinutes(),
                    "s+": instance.getSeconds(),
                    "q+": Math.floor((instance.getMonth() + 3) / 3),
                    "S": instance.getMilliseconds()
                };
                if (/(y+)/.test(inFormat)) {
                    result = inFormat.replace(RegExp.$1, (instance.getFullYear() + "").substr(4 - RegExp.$1.length));
                }

                for (k in o) {
                    if (new RegExp("(" + k + ")").test(inFormat)) {
                        result = result.replace(
                            RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))
                        );
                    }
                }

                return result;
            }
        }
    });

}(nx, nx.GLOBAL));