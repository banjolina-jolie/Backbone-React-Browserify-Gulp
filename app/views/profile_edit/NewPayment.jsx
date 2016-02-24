'use strict';

let React = require('react/addons');
let Actions = require('../../actions/Actions');
let Store = require('../../stores/Store');
let vsBinding = require('../../utils/vsBinding');
let CreditCardView = require('./CreditCardView.jsx');

let PaymentView = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        $('select#payment-method').select2({
            minimumResultsForSearch: -1
        });

        // bind change event on dropdown
        $('#payment-method').on('change', vsBinding.bind(this));
    },
    componentWillUnmount() {
        $('#payment-method').off();
    },
	getInitialState() {
		return {
			paymentMethod: 'card',
            cardDetails: {}
		};
	},
	renderOption(obj) {
		return <option key={obj.slug} value={obj.slug}>{obj.text}</option>;
	},
    render() {
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
