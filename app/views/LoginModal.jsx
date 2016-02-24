'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');

let LoginModalView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        $('#loginModal').on('shown.bs.modal', _ => {
            setTimeout(_ => {
                $('[name=email]').focus();
            }, 0);
        });
    },

    componentWillUnmount() {
        $('#loginModal').modal('hide');
    },

    getInitialState() {
        return {
            email: '',
            password: ''
        };
    },

    render() {
        return (
            <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog narrow-modal">
                    <div className="modal-content">
                        <div className="modal-body">
                            <span className="login-modal-flash flash-msg-error hidden">Invalid email/password combination.</span>
                            <div className="row">
                                <div className="col-xs-12">
                                    <form>
                                        <a href="http://localhost:3001/auth/facebook" className="btn btn-default fb-blue mb4">
                                            <i className="fa fa-facebook-f mr10"></i>
                                            Log in with Facebook
                                        </a>
                                        <div className="login-or">or</div>
                                        <div className="form-group pt20 btddd">
                                            <div className="input-group input-with-label">
                                                <input valueLink={this.linkState('email')} type="email" name="email" className="form-control" placeholder="Email"/>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group input-with-label">
                                                <input onKeyUp={this.captureLogin} valueLink={this.linkState('password')} type="password" name="password" className="form-control" placeholder="Password"/>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-default btn-solid btn-blue login-btn" onClick={this.login}>Log In</button>
                                        <div className="mt20 pt20 pb10 btddd">{'Don\'t have an account? '}<a onClick={this.signUp} className="fwnormal ttn">Sign up</a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    signUp() {
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    },
    captureLogin(e) {
        if (e.keyCode && e.keyCode !== 13) { return; }

        let data = {
            email: this.state.email,
            password: this.state.password
        };

        this.login(data)
        .fail(_ => {
            $('.flash-msg-error').toggleClass('hidden');
            setTimeout(_ => {
                $('.flash-msg-error').toggleClass('hidden');
            }, 3000);
        });
    },
    login(data) {
        Actions.startLoading();

        return $.ajax({
            url: apiBaseUrl + '/login',
            type: 'POST',
            data: data
        })
        .always(_ => {
            Actions.stopLoading();
        });
    }
});

module.exports = LoginModalView;
