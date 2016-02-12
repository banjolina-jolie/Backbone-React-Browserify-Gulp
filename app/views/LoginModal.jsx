var React = require('react/addons');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');

var LoginModalView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount: function () {
        $('#loginModal').on('shown.bs.modal', function () {
            setTimeout(function () {
                $('[name=email]').focus();
            }, 0);
        });
    },

    componentWillUnmount: function () {
        $('#loginModal').modal('hide');
    },

    getInitialState: function () {
        return {
            email: '',
            password: ''
        };
    },

    render: function () {
        return (
            <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog narrow-modal">
                    <div className="modal-content">
                        <div className="modal-body">
                            <span className="login-modal-flash flash-msg-error hidden">Invalid email/password combination.</span>
                            <div className="row">
                                <div className="col-xs-12">
                                    <form>
                                        <button onClick={this.FBLogin} type="button" className="btn btn-default fb-blue mb4">
                                            <i className="fa fa-facebook-f mr10"></i>
                                            Log in with Facebook
                                        </button>
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
                                                <input onKeyUp={this.login} valueLink={this.linkState('password')} type="password" name="password" className="form-control" placeholder="Password"/>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-default btn-solid btn-blue login-btn" onClick={this.login}>Log In</button>
                                        <div className="mt20 pt20 pb10 btddd">{'Don\'t have an account? '}<a className="fwnormal ttn" href="/register/step1">Sign up</a></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    login: function (e) {
        if (e.keyCode && e.keyCode !== 13) { return; }

        Actions.startLoading();

        $.ajax({
            url: apiBaseUrl + '/login',
            type: 'POST',
            data: {
                email: this.state.email,
                password: this.state.password
            }
        })
        .done(function() {
            debugger;
        })
        .fail(function () {
            $('.flash-msg-error').toggleClass('hidden');
            setTimeout(function () {
                $('.flash-msg-error').toggleClass('hidden');
            }, 3000);
        })
        .always(function () {
            Actions.stopLoading();
        });
    },
    FBLogin: function () {
        var currentUser = Store.getCurrentUser();

        FB.login(function () {
            FB.api('/me', {fields: 'email, first_name, last_name, picture, friends'}, function (user) {
                user.profile_pic = user.picture.data.url;
                delete user.picture;
                currentUser.set(user);
                Actions.setCurrentUser(currentUser);
                $('#loginModal').modal('hide');
            });
        });
    }
});

module.exports = LoginModalView;
