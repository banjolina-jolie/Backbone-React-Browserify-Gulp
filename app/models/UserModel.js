var Backbone = require('backbone');
var Email = require('./EmailModel');
var Actions = require('../actions/Actions');

var model = Backbone.Model.extend({
    defaults: function () {
        return {
            password: '',
            type: null
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
    partnerRole: function () {
        return this.isListener() ? 'presenter' : 'listener';
    },
    role: function () {
        return this.isListener() ? 'listener' : 'presenter';
    },
    isListener: function () {
        return !Number(this.get('type')) || this.isNew();
    },
    isPresenter: function () {
        return Number(this.get('type')) && !this.isNew();
    },
    getTransactor: function () {
        return $.ajax({
            url: apiBaseUrl + '/api/transactors/' + this.id,
            type: 'GET'
        });
    },
    saveTransactor: function (data) {
        Actions.startLoading();
        return $.ajax({
            url: apiBaseUrl + '/api/transactors/' + this.id,
            type: 'PUT',
            data: data,
            dataType: 'json'
        })
        .done(function () {
            this.trigger('saved:payments');
        }.bind(this))
        .always(function () {
            Actions.stopLoading();
        });
    },
    removePaymentMethod: function (pmId) {
        return $.ajax({
            url: apiBaseUrl + '/api/transactors/' + this.id + '/' + pmId,
            type: 'DELETE'
        });
    },
    isActive: function () {
        return this.get('state') === 0 || this.get('state') === 3;
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
        if (this.isNew() && (!attrs.password || attrs.password !== attrs.reEnterPassword)) {
            errors.reEnterPassword = 'Passwords do not match';
        }

        if (!_.isEmpty(errors)) {
            return errors;
        }
    }
});

module.exports = model;
