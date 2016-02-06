// View/State Binding
var $ = require('jquery');

module.exports = function (e, callback) {
    var attr = $(e.target).attr('name');
    var val = e.target.value;

    var change = {};
    change[attr] = val;
    this.setState(change, callback);
};
