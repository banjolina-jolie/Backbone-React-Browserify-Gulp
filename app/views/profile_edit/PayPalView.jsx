var React = require('react/addons');
var Store = require('../../stores/Store');
var Actions = require('../../actions/Actions');
var vsBinding = require('../../utils/vsBinding');

var PayPalView = React.createClass({
    componentWillMount: function () {
        Actions.setEnabledButton(null);
    },
    componentDidMount: function () {
        Store.addSaveProfileListener(this._onSaveProfile);
    },
    componentWillUnmount: function () {
        Store.removeSaveProfileListener(this._onSaveProfile);
    },
    getInitialState: function () {
        return {
            paypalEmail: null
        };
    },
    render: function () {
		return (
			<div className="form-group">
                <div className="col-xs-12">
                    <label className="col-sm-4 control-label" htmlFor="paypal-email">PayPal Email:</label>
                    <div className="col-sm-8 no-padding">
                        <input type="email" id="paypal-email" className="form-control" name="paypalEmail" onChange={this.inputChanged}/>
                    </div>
                </div>
            </div>
		);
	},
    inputChanged: function (e) {
        vsBinding.call(this, e, this.setEnabledButton);
    },
    setEnabledButton: function () {
        Actions.setEnabledButton(!!(this.state.paypalEmail));
    },
    _onSaveProfile: function () {
        var meta = this.props.user.get('meta');
        meta = _.extend(meta, this.state);
        this.props.user.set({ meta: meta });
    }
});

module.exports = PayPalView;
