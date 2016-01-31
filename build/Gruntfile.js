(function () {

  var path = require('path'),
    grunt = require('grunt');

  var pwd = process.cwd(),
    rootPath = path.dirname(pwd);
  var jsSrcPath = rootPath + '/src/';

  var srcFiles = [
    jsSrcPath + '/core/base.js',
    jsSrcPath + '/core/event.js',
    jsSrcPath + '/core/oop-base.js',
    jsSrcPath + '/core/oop.js',
    //jsSrcPath + '/env/Browser.js',
    //jsSrcPath + '/lang/Common.js',
    //jsSrcPath + '/lang/Array.js',
    //jsSrcPath + '/lang/Date.js',
    //jsSrcPath + '/lang/Function.js',
    //jsSrcPath + '/lang/Number.js',
    //jsSrcPath + '/lang/Float.js',
    //jsSrcPath + '/lang/Object.js',
    //jsSrcPath + '/lang/String.js'
  ];

  grunt.initConfig({
    jsSrcDir: jsSrcPath,
    jsDestDir: rootPath + '/dist',
    clean: {
      base: {
        src: [
          rootPath + '/dist'
        ]
      }
    },
    concat: {
      base: {
        src: srcFiles,
        dest: '<%=jsDestDir%>/nx.core.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! web-js-material <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      buildJs: {
        src: '<%=jsDestDir%>/nx.core.js',
        dest: '<%=jsDestDir%>/nx.core.min.js'
      }
    }
  });

  //load necessary modules:
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //register task for project:
  grunt.registerTask('default', [
    'clean',
    'concat',
    'uglify'
  ]);

}());
