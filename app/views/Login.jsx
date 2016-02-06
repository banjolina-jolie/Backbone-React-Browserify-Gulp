var React = require('react/addons');
var Actions = require('../actions/Actions');

var LoginView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount: function () {
        $('[name=email]').focus();
    },

    getInitialState: function () {
        return {
            email: '',
            password: ''
        };
    },

    render: function () {
        return (
            <section>
                <div className="container">
                    <div className="row mb20">
                        <div className="col-xs-12">
                            <h2>Login</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                            <form>
                                <div className="form-group">
                                    <div className="input-group input-with-label">
                                        <input valueLink={this.linkState('email')} type="email" name="email" className="form-control" placeholder="Email"/>
                                        <label htmlFor="email" className="input-group-title">
                                            Email
                                        </label>
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
                    <button type="button" onClick={this.login} className="btn btn-default btn-outline btn-blue mt40 ml15">Login</button>
                    <span className="login-page-flash flash-msg-error hidden">Invalid email/password combination.</span>
                </div>
            </section>
        );
    },
    login: function (e) {
        if (e.keyCode && e.keyCode !== 13) { return; }

        var self = this;
        var currentUser = this.props.user;

        $.ajax({
            url: apiBaseUrl + '/login',
            type: 'POST',
            data: {
                email: this.state.email,
                password: this.state.password
            }
        })
        .done(function(data) {
            currentUser.once('sync', function (response) {
                var meta = currentUser.get('meta');
                var firstTime = !meta.bio && !meta.telephone;
                
                $('#loginModal').modal('hide');
                Backbone.history.navigate('/users/' + currentUser.get('username'), {trigger: true});
            });
            // Send GET to /login to read cookies
            currentUser.fetch({ url: apiBaseUrl + '/login' });
        })
        .fail(function () {
            $('.flash-msg-error').toggleClass('hidden');
            setTimeout(function () {
                $('.flash-msg-error').toggleClass('hidden');
            }, 3000);
        });
    }
});

module.exports = LoginView;
