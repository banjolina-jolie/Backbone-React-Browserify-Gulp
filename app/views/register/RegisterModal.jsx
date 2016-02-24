'use strict';

let React = require('react');
let Basic = require('../profile_edit/Basic.jsx');
let Actions = require('../../actions/Actions');
let Store = require('../../stores/Store');

let RegisterView = React.createClass({

    getInitialState() {
        return {
            acceptsTerms: false
        };
    },

    render() {
        return (
            <div className="modal fade" id="registerModal" tabIndex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
                <div className="modal-dialog narrow-modal">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="ps15">
                                <a href="http://localhost:3001/auth/facebook" className="btn btn-default fb-blue mb4 ps20">
                                    <i className="fa fa-facebook-f mr10"></i>
                                    Log in with Facebook
                                </a>
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
    save() {
        let user = Store.getCurrentUser();
        // break if errors
        if (!user.validationError) {
            Actions.startLoading();
            user.save()
            .done(_ => {
                $('#registerModal').modal('hide');
                Backbone.history.navigate('/account', { trigger: true });
            })
            .fail(function (res) {
                res = res.responseJSON || res;
                let msg = (res && res.message) || 'Sorry there was an error.';
                Actions.okpAlert({body: msg});
            })
            .always(_ => {
                Actions.stopLoading();
            });
        }
    },
    triggerSet() {
        let user = Store.getCurrentUser();
        user.off();
        user.once('change', this.save);
        Actions.saveProfile();
    },
    _toggleAcceptsTerms(e) {
        let acceptsTerms = $(e.currentTarget).prop('checked');
        this.setState({ acceptsTerms: acceptsTerms });;
    }
});

module.exports = RegisterView;
