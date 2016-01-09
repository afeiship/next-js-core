module("oop.js");

nx.declare('test.MyStaticClass', {
    static: true,
    methods: {
        staticMethod: function () {
            return 'static!!'
        }
    }
});
