var React = require('react/addons');
var Actions = require('../actions/Actions');

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
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="loginModalLabel">Login</h4>
                            <span className="login-modal-flash flash-msg-error hidden">Invalid email/password combination.</span>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-xs-6">
                                    <form>
                                        <div className="form-group">
                                            <div className="input-group input-with-label">
                                                <input valueLink={this.linkState('email')} type="email" name="email" className="form-control" placeholder="Email"/>
                                                <span className="input-group-title">
                                                    Email
                                                </span>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group input-with-label">
                                                <input onKeyUp={this.login} valueLink={this.linkState('password')} type="password" name="password" className="form-control" placeholder="Password"/>
                                                <span className="input-group-title">
                                                    Password
                                                </span>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">Not an OKPitch member yet? <a className="fwnormal ttn" href="/register/step1">Register here</a>.</div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-outline btn-blue" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-default btn-solid btn-blue" onClick={this.login}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    login: function (e) {
        if (e.keyCode && e.keyCode !== 13) { return; }

        var self = this;
        var currentUser = self.props.user;

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
            window.location.reload();
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
    }
});

module.exports = LoginModalView;
