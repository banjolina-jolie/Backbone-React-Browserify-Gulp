require('./stores/Store');

(function () {
    var location = window.location;

    if (location.hostname === 'www.okpitch.com') {
        // chop off 'www' - problem with browser extension
        location.hostname = 'okpitch.com';
    }
        // enforce use of https
    if (location.hostname === 'okpitch.com' && location.protocol !== 'https:') {
        location.href = 'https://' + location.hostname + location.pathname;
        return;
    }

    var Store = require('./stores/Store');
    var React = require('react');

    window._ = require('lodash');
    window.Backbone = require('backbone');
    window.$ = require('jquery');
    window.select2 = require('select2');
    window.moment = require('moment');
    Backbone.$ = $; // kinda sux

    var Actions = require('./actions/Actions');

    var UserModel = require('./models/UserModel');
    var AppBase = require('./views/AppBase.jsx');

    var Router = require('./router.jsx');

    $.ajaxSetup({
       xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    });

    // Create currentUser model
    var currentUser = Store.getCurrentUser();
    // Render AppBase component
    React.render(React.createElement(AppBase, {}), document.getElementById('app'));
    // Init router
    var router = new Router({ root: '/', currentUser: currentUser });
    // Start history
    Backbone.history.start({ pushState: true, root: '/' });
    // show loading while API checks cookies
    // Actions.startLoading();
    // // send GET to /login to read cookies
    // currentUser.fetch({url: apiBaseUrl + '/login'})
    // // NOTE: currentUser is parsed by now
    // .done(function (response) {
    //     Actions.setCurrentUser(currentUser);
    //     // set listener for when Bistri is loaded
    //     window.onBistriConferenceReady = function () {
    //         router.trigger('bc:ready');
    //     };
    // })
    // .fail(function () {
    //     document.write('API Failure');
    // });
    // make anchor tags work with pushstate (Backbone boilerplate)
    $(document).on('click', 'a:not([data-bypass])', function(evt) {
        if (evt.metaKey || evt.ctrlKey) { return; }

        var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
        var root = location.protocol + '//' + location.host + '/';

        if (href.prop && href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            if (window.inActiveMeeting) {
                var self = this;
                Actions.okpAlert({
                    body: 'You are in an active meeting. Are you sure you want to navigate away?',
                    ok: function () {
                        window.inActiveMeeting = false;
                        Backbone.history.navigate(href.attr, true);
                    },
                    cancel: function () {
                        return false;
                    }
                });
            } else {
                Backbone.history.navigate(href.attr, true);
            }
        }
    });
    window.fbAsyncInit = function () {
        FB.init({
            appId: 167536220286926,
            cookie: true,
            xfbml: false,
            version: 'v2.3',
        });
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                FB.api('/me', {fields: 'name, picture, friends'}, function (user) {
                    user.profile_pic = user.picture.data.url;
                    delete user.picture;
                    currentUser.set(user);
                    Actions.setCurrentUser(currentUser);
                });
            } else if (response.status === 'not_authorized') {
                console.log(response);
            } else {
                console.log(response);
            }
        });
    };
})();
