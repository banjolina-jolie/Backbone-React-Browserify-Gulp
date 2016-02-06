var React = require('react/addons');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');
var vsBinding = require('../../utils/vsBinding');
var CreditCardView = require('./CreditCardView.jsx');

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
            cardDetails: {}
		};
	},
	renderOption: function (obj) {
		return <option key={obj.slug} value={obj.slug}>{obj.text}</option>;
	},
    render: function () {
    	return (
            <div className="row">
                <div className="col-xs-10 text-center pl0">
                    <form className="pay-method form-horizontal">
                        <CreditCardView user={this.props.user} />
                    </form>
                </div>
            </div>
    	);
    }
});

module.exports = PaymentView;
