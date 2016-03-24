'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');
let Seq = require('seq');

let LoginView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            email: '',
            password: ''
        }
    },
    render() {
        return (
            <div className="login-page">
                <div className="title-container">
                    <h2 className="page-title">Triangle</h2>
                    <div className="page-description">Chat with interesting people in your city.</div>
                </div>

                <div className="login-container">
                    <input className="email-input" type="text" valueLink={this.linkState('email')} placeholder="Email" name="email"/>
                    <input className="password-input" type="password" valueLink={this.linkState('password')} placeholder="Password" name="password"/>
                    <button className="btn" onClick={this._fetchAuthUrl}>sign in</button>
                </div>
            </div>
        );
    },
    _fetchAuthUrl() {
        // fetch auth URL
        $.ajax({
            url: apiBaseUrl + '/',
            headers: {
                Accept: 'application/json; scheme=root; version=0'
            }
        })
        .done(this._sendAuth);
    },
    _sendAuth(data) {
        let authUrl = data['authenticate-url'];

        // POST email/password to fetch location and x-session-token
        $.ajax({
            url: apiBaseUrl + authUrl,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; scheme=authentication; version=0',
            },
            type: 'post',
            data: JSON.stringify(this.state)
        })
        .done((data, status, res) => {
            // set local storage for persistence
            this._setLocalStorage(res);
            // go to messages view
            this._renderMessages();
        });
    },
    _setLocalStorage(res) {
        let location = res.getResponseHeader('location');
        let token = res.getResponseHeader('x-session-token');

        window.localStorage.setItem('location', location);
        window.localStorage.setItem('token', token);
    },
    _renderMessages() {
        let messagesView = require('./Messages.jsx');
        Actions.setUI(messagesView);
    }
});

module.exports = LoginView;
