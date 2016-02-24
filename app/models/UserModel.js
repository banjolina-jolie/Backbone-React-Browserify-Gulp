'use strict';

let Backbone = require('backbone');
let Email = require('./EmailModel');
let Actions = require('../actions/Actions');

let model = Backbone.Model.extend({
    defaults() {
        return {
            password: '',
            type: null,
            address: {}
        };
    },
    urlRoot() {
        let Store = require('../stores/Store');
        // when POSTing a new user, chop off '/api'
        let currentUser = Store.getCurrentUser();
        let route = currentUser.isNew() ? '/users' : '/api/users';
        return apiBaseUrl + route;
    },
    profilePic(el) {
        if (this.get('picture')) {
            let url = this.get('picture');
            let img = document.createElement('img');
            img.onload = _ => {
                el.style.backgroundImage = 'url("' + img.src + '")';
            };
            img.src = url;
        }
        return '';
    },
    parse(model) {
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
    validate(attrs) {
        let emailModel = new Email(attrs.email);
        let mailOutput = emailModel.isValid();
        let errors = {};

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
