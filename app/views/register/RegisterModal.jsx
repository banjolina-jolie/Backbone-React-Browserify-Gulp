var React = require('react');
var Basic = require('../profile_edit/Basic.jsx');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');

var RegisterView = React.createClass({

    getInitialState: function () {
        return {
            acceptsTerms: false
        };
    },

    render: function () {
        return (
            <div className="modal fade" id="registerModal" tabIndex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
                <div className="modal-dialog narrow-modal">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="ps15">
                                <button onClick={this.FBLogin} type="button" className="btn btn-default fb-blue mb4 ps20">
                                    <i className="fa fa-facebook-f mr10"></i>
                                    Log in with Facebook
                                </button>
                            </div>
                            <div className="login-or">or</div>
                            <div className="pt20 btddd w100p"></div>

                            <Basic />
                            <div className="ms20 tos-container">
                                <div className="terms-of-service mt20 mb20">
                                    <input checked={this.state.acceptsTerms} onChange={this._toggleAcceptsTerms} type="checkbox" name="acceptsTerms" value="true"/>
                                    <span>You agree to our <a href="/terms" target="_blank">Terms of Service</a> and the <a href="https://stripe.com/connect/account-terms" target="_blank">Stripe Connected Account Agreement.</a></span>
                                </div>
                                <button disabled={!this.state.acceptsTerms} onClick={this.triggerSet} type="button" className="btn btn-default btn-solid btn-blue w100p">Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    save: function () {
        var user = Store.getCurrentUser();
        // break if errors
        if (!user.validationError) {
            Actions.startLoading();
            user.save()
            .done(function () {
                Backbone.history.navigate('/account', { trigger: true });
            })
            .fail(function (res) {
                res = res.responseJSON || res;
                var msg = (res && res.message) || 'Sorry there was an error.';
                Actions.okpAlert({body: msg});
            })
            .always(function () {
                Actions.stopLoading();
            });
        }
    },
    triggerSet: function () {
        var user = Store.getCurrentUser();
        user.off();
        user.once('change', this.save);
        Actions.saveProfile();
    },
    _toggleAcceptsTerms: function (e) {
        var acceptsTerms = $(e.currentTarget).prop('checked');
        this.setState({ acceptsTerms: acceptsTerms });;
    }
});

module.exports = RegisterView;
