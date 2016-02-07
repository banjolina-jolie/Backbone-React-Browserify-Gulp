var React = require('react');
var Actions = require('./actions/Actions');
var Store = require('./stores/Store');
var UserModel = require('./models/UserModel');

// register views
var registerViews = {};
registerViews.step2 = require('./views/register/Register2.jsx');
registerViews.verify = require('./views/register/RegisterVerify.jsx');

// register finish views
var registerFinishViews = {};
registerFinishViews.payment = require('./views/register/RegisterPayment.jsx');
registerFinishViews.bio = require('./views/register/RegisterBio.jsx');

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
        'validator': 'validator',
        'register/:step': 'register',
        'register/:step/:type': 'register',
        'register-finish/:step': 'registerFinish',
        'login': 'login',
        'logout': 'logout',
        'signup/:type': 'signup',
        'account': 'profileEdit',
        'account/:section': 'profileEdit',
        'users/:userName': 'userProfile',
        'schedule/:page': 'schedule',
        'schedule': 'schedule',
        'about': 'about',
        'terms': 'terms',
        'privacy': 'privacy',
        '*all': 'notFound'
    },
    initialize: function (options) {
        // set current user
        // Store.getCurrentUser() = options.currentUser;

        // TODO: remove before deploy
        window.currentUser = Store.getCurrentUser();
    },
    notFound: function () {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    },
    about: function () {
        var view = require('./views/About.jsx');
        Actions.setUI('loggedIn', view);
    },
    validator: function (qString) {
        var keyVal = qString.split('=');
        var data = {};
        data.token = keyVal[1];

        $.ajax({
            url: apiBaseUrl + '/validator',
            type: 'POST',
            data: data
        })
        .done(function () {
            Backbone.history.navigate('/login', true);
        }.bind(this));
    },
    login: function () {
        var view = require('./views/Login.jsx');
        var data = { user: Store.getCurrentUser() };
        Actions.setUI('register', view, data);
    },
    logout: function () {
        $.ajax({
            url: apiBaseUrl + '/api/logout'
        })
        .done(function () {
            window.location.href= '/';
        });
    },
    schedule: function () {
        var data = { user: Store.getCurrentUser() };
        var view = require('./views/schedule/ScheduleBase.jsx');
        Actions.setUI('loggedIn', view, data);
    },
    roomLocked: function () {
        Actions.setUI('loggedIn');
        $('#content').html('<div class="container mt40"><h4>Sorry this room is locked</h4></div>');
    },
    landing: function () {
        var view = require('./views/Landing.jsx');
        var data = { user: Store.getCurrentUser() };
        Actions.setUI(false, view, data);
    },
    register: function (step) {

        Store.getCurrentUser().set({ type: 1 });
        var view = registerViews[step];
        var data = { user: Store.getCurrentUser() };

        Actions.setUI('register', view, data);
    },
    profileEdit: function (section) {
        if (section === 'schedule') {
            this.schedule();
            return;
        }

        var view = require('./views/profile_edit/ProfileEditBase.jsx');
        var data = { user: Store.getCurrentUser(), section: section };
        Actions.setUI('loggedIn', view, data);
    },
    userProfile: function (userName, queryStr) {
        var args = arguments;
        var currentUser = Store.getCurrentUser();
        
        if (!currentUser.fetched) {
            this.listenToOnce(currentUser, 'sync', function () {
                this.userProfile.apply(this, args);
            }.bind(this));
            return;
        }

        var searchedUser = new UserModel({id: userName});
        searchedUser.fetch()
        .done(function (res) {
            var view = require('./views/users/UserProfile.jsx');
            var data = { user: Store.getCurrentUser(), searchedUser: searchedUser };
            Actions.setUI('loggedIn', view, data);
            Actions.setSelectedUser(res);
        }.bind(this));
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
