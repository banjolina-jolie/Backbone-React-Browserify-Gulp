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
        '': 'login',
        'messages': 'messages',
        '*all': 'notFound'
    },
    login() {
        let view = require('./views/Login.jsx');
        Actions.setUI(view);
    },
    messages() {
        let view = require('./views/Messages.jsx');
        Actions.setUI(view);
    },
    notFound() {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    }
});

module.exports = router;
