var React = require('react');
var Actions = require('./actions/Actions');
var Store = require('./stores/Store');
var UserModel = require('./models/UserModel');

function parseQuery(qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

var router = Backbone.Router.extend({
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
    initialize: function (options) {
        // NOTE: use for debugging
        // window.currentUser = Store.getCurrentUser();
    },
    notFound: function () {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    },
    about: function () {
        var view = require('./views/About.jsx');
        Actions.setUI('loggedIn', view);
    },
    logout: function () {
        // TODO: Log out of FB
        $.ajax({
            url: apiBaseUrl + '/api/logout' // server should remove cookie
        })
        .done(function () {
            window.location.href= '/';
        });
    },
    landing: function () {
        var view = require('./views/Landing.jsx');
        var data = { user: Store.getCurrentUser() };
        Actions.setUI(false, view, data);
    },
    profileEdit: function (section) {
        var view = require('./views/profile_edit/ProfileEditBase.jsx');
        var data = { user: Store.getCurrentUser(), section: section };
        Actions.setUI('loggedIn', view, data);
    },
    terms: function () {
        var view = require('./views/Terms.jsx');
        Actions.setUI('loggedIn', view);

    },
    privacy: function () {
        var view = require('./views/Privacy.jsx');
        Actions.setUI('loggedIn', view);

    }
});

module.exports = router;
