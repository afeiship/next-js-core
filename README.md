#next-js-core
##Homepage:
+ http://afeiship.github.io/next-js-core/

##Feature list:
+ Keywords:methods/statics/properties
+ Feature:property/method extends(extend)/mixins/
+ Namespace support

##Log：
+ [2015-05-25]:init base & oop.
+ [2015-11-01]:refactor,support ie7+/w3c browser.

##Know issues：
+ Remove events.

##New feature：
+ Normalize static/statics/property/init and other concept.

##build
+ cd build
+ npm install
+ grunt --force

##Bug issue:
+ this.base() will invalid in 'use strict' mode.(use this.$base.xxMethods() instead)
