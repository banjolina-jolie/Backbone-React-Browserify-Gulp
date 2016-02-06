var React = require('react/addons');
var Store = require('../../stores/Store');
var Actions = require('../../actions/Actions');
var vsBinding = require('../../utils/vsBinding');
var StepsIndicator = require('./StepsIndicator.jsx');
var NewPayment = require('../profile_edit/NewPayment.jsx');

var RegisterFinish3View = React.createClass({

    componentDidMount: function () {
        Store.addEnableButtonListener(this._onButtonEnable);
        this.props.user.on('saved:payments', function () {
            Actions.stopLoading();
            Backbone.history.navigate('/register-finish/bio', {trigger: true});
        });
    },

    componentWillUnmount: function () {
        this.props.user.off('saved:payments');
        Store.removeEnableButtonListener(this._onButtonEnable);
    },

    getButtonEnableState: function () {
        return {
            enableButton: Store.getButtonEnableState()
        };
    },

    getInitialState: function () {
        return { enableButton: !!(this.props.user.get('meta').payment) };
    },

    render: function () {
        var currentStep = this.props.user.isListener() ? 2 : 1;
        var totalSteps = this.props.user.isListener() ? 4 : 3;

        return (
            <div>
                <StepsIndicator totalSteps={totalSteps} currentStep={currentStep} />

                <section className="registration-finish payment">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h2 className="step-title">{this.title()}</h2>
                            </div>
                        </div>

                        <NewPayment user={this.props.user}/>

                        <div className="next-or-skip">
                            <button onClick={this.next} className="btn btn-default btn-solid btn-blue" disabled={!this.state.enableButton}>Next</button>
                            <span className="or-separator">or</span>
                            <a href="/register-finish/bio">SKIP</a>
                        </div>
                    </div>
                </section>
            </div>
        );
    },
    title: function () {
        return this.props.user.isListener() ? 'How will we pay you?' : 'How will you pay?';
    },
    next: function (e) {
        // TODO: render loading
        e.preventDefault();

        Actions.startLoading();
        Actions.saveProfile();
    },
    _onButtonEnable: function () {
        this.setState(this.getButtonEnableState());
    }

});

module.exports = RegisterFinish3View;
