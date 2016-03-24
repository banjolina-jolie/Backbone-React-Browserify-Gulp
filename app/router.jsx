'use strict';

let React = require('react');
let Actions = require('./actions/Actions');
let Store = require('./stores/Store');

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
        '*all': 'notFound'
    },
    landing() {
        let view;
        let storage = window.localStorage;
        let token = storage.getItem('token');
        let location = storage.getItem('location');

        if (token && location) {
            view = require('./views/Messages.jsx');
        } else {
            view = require('./views/Login.jsx');
        }
        Actions.setUI(view);
    },
    notFound() {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    }
});

module.exports = router;
