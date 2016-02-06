var React = require('react');
var Basic = require('../profile_edit/Basic.jsx');
var Actions = require('../../actions/Actions');

var Register3View = React.createClass({

    getInitialState: function () {
        return {
            acceptsTerms: false
        };
    },

    componentDidMount: function () {
    },

    render: function () {
        return (
	        <section className="registration step-3">
	            <div className="container">
	                <div className="row mb20">
	                    <div className="col-xs-12">
	                        <h2 className="step-title">Create account</h2>
	                    </div>
	                </div>

	                <div className="row mb40">
	                    <div className="col-xs-6 fn ma">
	                        <Basic user={this.props.user} />
                            <button disabled={!this.state.acceptsTerms} onClick={this.saveAndNext} type="button" className="btn btn-default btn-solid btn-blue">Register</button>
                            <div className="terms-of-service mt20">
                                <input checked={this.state.acceptsTerms} onChange={this._toggleAcceptsTerms} type="checkbox" name="acceptsTerms" value="true"/>
                                <span>You agree to our <a href="https://www.okpitch.com/terms" target="_blank">Terms of Service</a> and the <a href="https://stripe.com/connect/account-terms" target="_blank">Stripe Connected Account Agreement.</a></span>
                            </div>
	                    </div>
	                </div>
	            </div>
	        </section>
        );
    },
    saveAndNext: function () {
    	Actions.saveProfile();
        setTimeout(function() {
            var user = this.props.user;
            
            // break if errors
            if (!user.validationError) {
    	        Actions.startLoading();
            	user.save()
                .done(function () {
                    Backbone.history.navigate('/register/verify', { trigger: true });
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
        }.bind(this), 50);
    },
    _toggleAcceptsTerms: function (e) {
        var acceptsTerms = $(e.currentTarget).prop('checked');
        this.setState({ acceptsTerms: acceptsTerms });;
    }
});

module.exports = Register3View;
