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
Actions.startLoading();

// make anchor tags work with pushstate (Backbone boilerplate)
$(document).on('click', 'a:not([data-bypass])', function(evt) {
    if (evt.metaKey || evt.ctrlKey) { return; }

    var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
    var root = location.protocol + '//' + location.host + '/';

    if (href.prop && href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        Backbone.history.navigate(href.attr, true);
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
        currentUser.isFetched = true;

        if (response.status === 'connected') {
            FB.api('/me', {fields: 'first_name, last_name, picture, friends'}, function (user) {
                user.profile_pic = user.picture.data.url;
                user.fb_id = user.id;
                delete user.id;
                delete user.picture;
                currentUser.set(user);
                checkLogin();
            });
        } else {
            checkLogin();
        }
    });
};

function checkLogin () {
    // send GET to /login to read cookies and return currentUser
    currentUser.fetch({url: apiBaseUrl + '/login'})
    // NOTE: currentUser is parsed by now
    .done(function (response) {
        Actions.setCurrentUser(currentUser);
    })
    .fail(function () {
        Actions.okpAlert('API is down.');
    });
}
