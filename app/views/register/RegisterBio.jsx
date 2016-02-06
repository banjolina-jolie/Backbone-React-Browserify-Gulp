var React = require('react/addons');
var PersonalBio = require('../profile_edit/Bio.jsx');
var Actions = require('../../actions/Actions');
var StepsIndicator = require('./StepsIndicator.jsx');
var Store = require('../../stores/Store');

var RegisterFinish4View = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

    componentDidMount: function () {
        Store.addEnableButtonListener(this._onButtonEnable);
    },

    componentWillUnmount: function () {
        Store.removeEnableButtonListener(this._onButtonEnable);
    },

    getButtonEnableState: function () {
        return {
            enableButton: Store.getButtonEnableState()
        };
    },

	getInitialState: function () {
		return { enableButton: !!(this.props.user.get('meta').bio || this.props.user.profilePic()) };
	},

    render: function () {
    	var currentStep = this.props.user.isListener() ? 3 : 2;
    	var totalSteps = this.props.user.isListener() ? 4 : 3;

    	return (
    		<div>
				<StepsIndicator totalSteps={totalSteps} currentStep={currentStep} />

	            <section className="registration-finish step-4">
	                <div className="container">
	                    <div className="row">
	                        <div className="col-xs-12">
	                            <h2 className="step-title">Select a profile icon and <br/> add a short bio</h2>
	                        </div>
	                    </div>

	                    <div className="row">
	                        <div className="col-xs-12 text-center">

	                            <PersonalBio user={this.props.user} />

                                <div className="next-or-skip">
                                    <button onClick={this.next} className="btn btn-default btn-solid btn-blue" disabled={!this.state.enableButton}>Next</button>
                                    <span className="or-separator">or</span>
                                    <a href="/">SKIP</a>
                                </div>
	                        </div>
	                    </div>
	                </div>
	            </section>
    		</div>
    	);
    },

    _onButtonEnable: function () {
        this.setState(this.getButtonEnableState());
    },

    next: function (e) {
    	e.preventDefault();
        
        Actions.startLoading();
        Actions.saveProfile();

        this.props.user.save()
        .done(function () {
            Actions.stopLoading();
            Backbone.history.navigate('/', { trigger: true });
        });
        
    }

});

module.exports = RegisterFinish4View;
