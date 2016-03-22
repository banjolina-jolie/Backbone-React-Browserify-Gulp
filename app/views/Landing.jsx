'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');
let SearchBar = require('./search/SearchBar.jsx');

let LandingView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            email: '',
            password: ''
        }
    },
    render() {
        return (
            <div className="landing">
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
        $.ajax({
            headers: {
                 Accept: 'application/json',
                'Content-Type': 'application/json; scheme=authentication; version=0'
            },
            type: 'post',
            url: apiBaseUrl + '/authenticate',
            data: JSON.stringify(this.state)
        })
        .done(function () {
            debugger;
        });
    }
});

module.exports = LandingView;

