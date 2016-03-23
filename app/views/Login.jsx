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
        let location;
        let token;

        Seq()
            .seq(function () {
                $.ajax({
                    url: apiBaseUrl + '/',
                    headers: {
                        Accept: 'application/json; scheme=root; version=0'
                    }
                })
                .done(_ => {
                    this();
                });
            })
            .seq(function () {
                $.ajax({
                    url: apiBaseUrl + '/authenticate',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json; scheme=authentication; version=0'
                    },
                    type: 'post',
                    data: JSON.stringify(data)
                })
                .done((data, status, res) => {
                    location = res.getResponseHeader('location');
                    // Actions.setLocation(location);
                    this();
                });
            })
            .seq(function () {
                $.ajax({
                    url: apiBaseUrl + location,
                    headers: {
                        Accept: 'application/json; scheme=session; version=0',
                        Host: 'localhost:8008'
                    }
                })
                .done(function () {
                    debugger;
                });
                // Backbone.history.navigate('/messages');
            });
    }
});

module.exports = LoginView;
