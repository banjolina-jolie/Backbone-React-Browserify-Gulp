'use strict';

let React = require('react');
let Actions = require('./actions/Actions');
let Store = require('./stores/Store');
let setTokenHeader = require('./utils/setTokenHeader');


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
            setTokenHeader(token);
            view = require('./views/Messages.jsx');
        } else {
            view = require('./views/Login.jsx');
        }
        Actions.setUI(view);
    },
    userProfile() {

    },
    notFound() {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    }
});

module.exports = router;
