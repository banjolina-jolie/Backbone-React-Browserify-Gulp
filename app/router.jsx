'use strict';

let React = require('react');
let Actions = require('./actions/Actions');
let Store = require('./stores/Store');
let UserModel = require('./models/UserModel');

let parseQuery = qstr => {
    let query = {};
    let a = qstr.split('&');
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

let router = Backbone.Router.extend({
    routes: {
        '': 'landing',
        'login': 'login',
        '*all': 'notFound'
    },
    landing() {
        let view = require('./views/Landing.jsx');
        Actions.setUI(view);
    },
    notFound() {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    }
});

module.exports = router;
