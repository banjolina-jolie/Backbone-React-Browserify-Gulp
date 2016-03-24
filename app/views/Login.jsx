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
                    <button className="btn" onClick={this.login}>sign in</button>
                </div>
            </div>
        );
    },
    login() {
        let data = this.state;
        let authUrl;

        Seq()
            .seq(function () {
                // fetch auth URL
                $.ajax({
                    url: apiBaseUrl + '/',
                    headers: {
                        Accept: 'application/json; scheme=root; version=0'
                    }
                })
                .done(data => {
                    authUrl = data['authenticate-url'];
                    this();
                });
            })
            .seq(function() {
                // POST email/password to fetch location and x-session-token
                $.ajax({
                    url: apiBaseUrl + authUrl,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; scheme=authentication; version=0',
                    },
                    type: 'post',
                    data: JSON.stringify(data)
                })
                .done((data, status, res) => {
                    let location = res.getResponseHeader('location');
                    let token = res.getResponseHeader('x-session-token');
                    // add token to headers
                    window.localStorage.setItem('location', location);
                    window.localStorage.setItem('token', token);

                    let view = require('./Messages.jsx');
                    Actions.setUI(view);
                });
            });
    }
});

module.exports = LoginView;
