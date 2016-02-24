'use strict';

let React = require('react');
let Actions = require('./actions/Actions');
let Store = require('./stores/Store');
let UserModel = require('./models/UserModel');

function parseQuery(qstr) {
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
        'logout': 'logout',
        'account': 'profileEdit',
        'account/:section': 'profileEdit',
        'about': 'about',
        'terms': 'terms',
        'privacy': 'privacy',
        '*all': 'notFound'
    },
    initialize(options) {
        // NOTE: use for debugging
        window.currentUser = Store.getCurrentUser();
    },
    notFound() {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    },
    about() {
        let view = require('./views/About.jsx');
        Actions.setUI('loggedIn', view);
    },
    logout() {
        // TODO: Log out of FB
        $.ajax({
            url: apiBaseUrl + '/api/logout' // server should remove cookie
        })
        .done(function () {
            // Actions.setCurrentUser({});
            window.location.href= '/';
        });
    },
    landing() {
        let view = require('./views/Landing.jsx');
        Actions.setUI(false, view);
    },
    profileEdit(section) {
        let view = require('./views/profile_edit/ProfileEditBase.jsx');
        let data = { section: section };
        Actions.setUI('loggedIn', view, data);
    },
    terms() {
        let view = require('./views/Terms.jsx');
        Actions.setUI('loggedIn', view);
    },
    privacy() {
        let view = require('./views/Privacy.jsx');
        Actions.setUI('loggedIn', view);

    }
});

module.exports = router;
