'use strict';

let Store = require('./stores/Store');
let React = require('react');

window._ = require('lodash');
window.Backbone = require('backbone');
window.$ = require('jquery');
window.select2 = require('select2');
window.moment = require('moment');
Backbone.$ = $; // kinda sux

let Actions = require('./actions/Actions');

let UserModel = require('./models/UserModel');
let AppBase = require('./views/AppBase.jsx');

let Router = require('./router.jsx');

$.ajaxSetup({
   xhrFields: {
        withCredentials: true
    },
    crossDomain: true
});

// Create currentUser model
let currentUser = Store.getCurrentUser();
// Render AppBase component
React.render(React.createElement(AppBase, {}), document.getElementById('app'));
// Init router
let router = new Router({ root: '/', currentUser: currentUser });
// Start history
Backbone.history.start({ pushState: true, root: '/' });

// show loading while API checks cookies
Actions.startLoading();

// send GET to /login to read cookies and return currentUser
currentUser.fetch({url: apiBaseUrl + '/login'})
// NOTE: currentUser is parsed by now
.done(function (response) {
    currentUser.isFetched = true;
    Actions.setCurrentUser(currentUser);
})
.fail(function () {
    // Actions.okpAlert({body: 'API is down.'});
})
.always(function () {
    Actions.stopLoading();
});

// make anchor tags work with pushstate (Backbone boilerplate)
$(document).on('click', 'a:not([data-bypass])', function(evt) {
    if (evt.metaKey || evt.ctrlKey) { return; }

    let href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
    let root = location.protocol + '//' + location.host + '/';

    if (href.prop && href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        Backbone.history.navigate(href.attr, true);
    }
});
