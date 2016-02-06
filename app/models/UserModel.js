var Backbone = require('backbone');
var Email = require('./EmailModel');
var Actions = require('../actions/Actions');

var model = Backbone.Model.extend({
    defaults: function () {
        return {
            password: '',
            type: null,
            address: {}
        };
    },
    urlRoot: function () {
        var Store = require('../stores/Store');
        // when POSTing a new user, chop off '/api'
        var currentUser = Store.getCurrentUser();
        var route = currentUser.isNew() ? '/users' : '/api/users';
        return apiBaseUrl + route;
    },
    profilePic: function (el) {
        if (this.get('profile_pic')) {
            var url = this.get('profile_pic');
            var img = document.createElement('img');
            img.onload = function(){
                el.style.backgroundImage = 'url("' + img.src + '")';
            };
            img.src = url;
        }
        return '';
    },
    parse: function (model) {
        this.fetched = true;

        if (model._id) {
            model.id = model._id;
            delete model._id;
        }
        if (model.events) {
            
        }
        this.status = true;

        return model;
    },
    validate: function (attrs) {
        var emailModel = new Email(attrs.email);
        var mailOutput = emailModel.isValid();
        var errors = {};

        if (!mailOutput) {
            errors.email = emailModel.validationError;
        }
        if (!attrs.first_name) {
            errors.first_name = 'Please enter a first name';
        }
        if (!attrs.last_name) {
            errors.last_name = 'Please enter your last name';
        }

        if (!_.isEmpty(errors)) {
            return errors;
        }
    }
});

module.exports = model;
