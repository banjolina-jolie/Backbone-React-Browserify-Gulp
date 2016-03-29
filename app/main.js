'use strict';

let Store = require('./stores/Store');
let React = require('react');

window._ = require('lodash');
window.Backbone = require('backbone');
window.$ = require('jquery');
Backbone.$ = $;

// API base url
window.apiBaseUrl = 'https://victor.bettercompany.co';

let Actions = require('./actions/Actions');
let AppBase = require('./views/AppBase.jsx');
let Router = require('./router.jsx');

// Render AppBase component
React.render(React.createElement(AppBase, {}), document.getElementById('app'));
// Init router
let router = new Router({ root: '/' });
// Start history
Backbone.history.start({ pushState: true, root: '/' });

// make anchor tags work with pushstate (Backbone boilerplate)
$(document).on('click', 'a:not([data-bypass])', function (evt) {
    if (evt.metaKey || evt.ctrlKey) { return; }

    let href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
    let root = location.protocol + '//' + location.host + '/';

    if (href.prop && href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        Backbone.history.navigate(href.attr, true);
    }
});
