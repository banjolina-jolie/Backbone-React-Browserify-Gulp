var Backbone = require('backbone');
var Email = require('./EmailModel');
var Actions = require('../actions/Actions');

var model = Backbone.Model.extend({
    defaults: function () {
        return {
            password: '',
            type: null,
            meta: {
                address: {},
                price: {}
            },
            currentSession: {
                state: 0,
                email: '',
                name: '',
                company: '',
                prompts: [],
                messages: []
            },
            feedbackPrompts: [
                {
                    type: 'text',
                    text: 'What is your top takeaway from the meeting?',
                    checked: true
                },
                {
                    type: 'rate 1-10',
                    text: 'How was the presentation?',
                    checked: true
                }
            ]
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
    sendInvites: function (invites) {
        var data = $.extend(true, [], invites);

        _.each(data, function (invite) {
            invite.duration = Number(invite.duration);
            invite.rate = Number(invite.rate);
            invite.startTime  = Number(invite.startTime)/1000;
            invite.listener = invite.listener.id;
            invite.presenter = invite.presenter.id;
        });

        if (this.isActive()) {
            return $.ajax({
                url: apiBaseUrl + '/api/meetings',
                type: 'POST',
                data: {
                    meetings: data
                },
                dataType: 'json'
            });
        }
    },
    sendBatchInvites: function (options) {
        var data = $.extend(true, {}, options);
        if (this.isActive()) {
            return $.ajax({
                url: apiBaseUrl + '/api/invites',
                type: 'POST',
                data: {
                    options: data
                },
                dataType: 'json'
            });
        }
    },
    checkMtgListener: function (listenerEmail, meetingId) {
        return $.ajax({
            url: apiBaseUrl + '/checkListener',
            type: 'POST',
            data: {
                listenerEmail: listenerEmail,
                meetingId: meetingId
            },
            dataType: 'json'
        })
        .always(function () {
            Actions.stopLoading();
        });
    },
    noAuthSaveMtg: function (mtg) {
        var data = {
            listenerEmail: this.get('email'),
            meeting: mtg.toJSON()
        };
        data = $.extend(true, {}, data);
        data.meeting = JSON.stringify(data.meeting);

        return $.ajax({
            url: apiBaseUrl + '/meetings/' + mtg.id,
            type: 'put',
            data: data,
            dataType: 'json'
        })
        .done(function () {
            mtg.set(mtg.parse(mtg.attributes));
        });
    },
    isActive: function () {
        return this.get('state') === 0 || this.get('state') === 3;
    },
    save: function () {
        this.set({meetings: []});
        return Backbone.Model.prototype.save.apply(this, arguments);
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
        if (!attrs.name) {
            errors.name = 'Please enter a first name';
        }
        if (!attrs.surname) {
            errors.surname = 'Please enter your last name';
        }
        if (!attrs.username) {
            errors.username = 'Please enter a username';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(attrs.username)) {
            // TODO: validate this on BE and make sure we're validating unique usernames to not be case-specific
            setTimeout(function () {
                Actions.okpAlert({body: 'Username must contain only letters, numbers, and max 2 underscores.'});
            }, 0);
            errors.username = 'Username cannot have special charactors other than _';
        }
        if (!attrs.meta.address.city) {
            errors.city = 'Please enter a city';
        }
        if (!attrs.meta.address.state || attrs.meta.address.state.length !== 2) {
            errors.state = 'Please enter a state';
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
