var React = require('react/addons');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');
var vsBinding = require('../../utils/vsBinding');
var CreditCardView = require('./CreditCardView.jsx');
var PayPalView = require('./PayPalView.jsx');

var PaymentView = React.createClass({
	
	mixins: [React.addons.LinkedStateMixin],

    componentDidMount: function () {
        $('select#payment-method').select2({
            minimumResultsForSearch: -1
        });

        // bind change event on dropdown
        $('#payment-method').on('change', vsBinding.bind(this));
    },
    componentWillUnmount: function () {
        $('#payment-method').off();
    },
	getInitialState: function () {
		return {
			paymentMethod: 'card',
			title: this.props.user.isListener() ? 'How will we pay you?' : 'How will you pay?',
            cardDetails: {}
		};
	},
	secondaryComponent: function () {
		switch (this.state.paymentMethod) {
			case 'card':
				return <CreditCardView user={this.props.user} />;
			case 'paypal':
				return <PayPalView user={this.props.user} />;
		}
	},
	renderOption: function (obj) {
		return <option key={obj.slug} value={obj.slug}>{obj.text}</option>;
	},
	getPaymentMethods: function () {
        if (this.props.user.isListener()) {
			return [{slug: 'bank', text: 'Bank Account'}, {slug: 'card', text: 'Debit Card'}, {slug: 'paypal', text: 'PayPal'}];
		} else {
			return [{slug: 'card', text: 'Credit Card'}];
		}
	},
    render: function () {
    	return (
            <div className="row">
                <div className="col-xs-10 text-center pl0">
                    <form className="pay-method form-horizontal">
                        {/*<div className="form-group">
                            <div className="col-xs-12">
                                <select valueLink={this.linkState('paymentMethod')} name="paymentMethod" id="payment-method">
                                    {this.getPaymentMethods().map(this.renderOption)}
                                </select>
                            </div>
                        </div>*/}
                        { this.secondaryComponent() }
                    </form>
                </div>
            </div>
    	);
    }
});

module.exports = PaymentView;
