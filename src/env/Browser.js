(function (nx, global) {

  var userAgent = global.navigator.userAgent;
  var __ = {
    browserList: ['Chrome', 'Firefox', 'Safari', 'Opera', 'Ie'],
    engineVersion: function (inKeyRegexp) {
      var versionExp = new RegExp('(?:\\w+|\\s+)' + inKeyRegexp + '(\\d+\\.\\d+)');
      return userAgent.match(versionExp)[1];
    }
  };

  var engineMap = {
    'webkit': 'it/',    //safari/new opera/chrome/default
    'gecko': 'rv:',     //firefox
    'presto': 'to/',    //old opera
    'trident': 'nt/'    //ie
  };

  var vendorMap = {
    'webkit': ['Webkit', '-webkit-'],
    'gecko': ['Moz', '-moz-'],
    'presto': ['O', '-o-'],
    'trident': ['ms', '-ms-']
  };


  function isIe() {
    return userAgent.indexOf('MSIE ') > -1;
  }

  function ieVersion() {
    return userAgent.match(/MSIE (\d+\.\d+)/)[1];
  }

  function isChrome() {
    return userAgent.indexOf('Chrome/') > -1 && !isOpera();
  }

  function chromeVersion() {
    return userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
  }

  function isSafari() {
    return userAgent.indexOf('Safari/') > -1 && !isChrome() && !isOpera();
  }

  function safariVersion() {
    return userAgent.match(/Version\/(\d+\.\d+)/)[1];
  }

  function isFirefox() {
    return userAgent.indexOf('Firefox/') > -1;
  }

  function firefoxVersion() {
    return userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
  }

  function isOpera() {
    return userAgent.indexOf('Opera/') > -1 || userAgent.indexOf('OPR/') > -1;
  }

  function operaVersion() {
    return (userAgent.match(/Opera\/(\d+\.\d+)/) || userAgent.match(/OPR\/(\d+\.\d+)/))[1];
  }

  var BrowserUtil = nx.declare('nx.env', {
    statics: {
      userAgent: userAgent,
      init: function () {
        var browser = this.browser();
        this[browser.name] = browser.version;
      },
      browser: function () {
        var browserName, browserVersion;
        nx.each(__.browserList, function (name) {
          if (this['is' + name]) {
            browserName = name.toLowerCase();
            browserVersion = this.getVersion(browserName);
            return nx.BREAKER;
          }
        }, this);
        return {
          name: browserName,
          version: browserVersion
        };
      },
      engine: function () {
        var engineName, engineVersion;
        nx.each(engineMap, function (value, key) {
          if (userAgent.indexOf(value) > -1) {
            engineName = key;
            engineVersion = parseFloat(__.engineVersion(value));
            return nx.BREAKER;
          }
        });
        return {
          name: engineName,
          version: engineVersion
        };
      },
      prefix: function (isCamelize) {
        var camelize = isCamelize | 0;
        var engineName = this.engine().name;
        return vendorMap[engineName][camelize];
      },
      version: function (inName) {
        return parseFloat(this[inName + 'Version']());
      }
    }
  });

}(nx, nx.GLOBAL));
