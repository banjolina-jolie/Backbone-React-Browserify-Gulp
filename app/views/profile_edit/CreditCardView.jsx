'use strict';

let React = require('react/addons');
let Actions = require('../../actions/Actions');
let Store = require('../../stores/Store');
let vsBinding = require('../../utils/vsBinding');

let numRange = (min, max) => {
    let arr = [];
    for (let i = min; i <= max; i++) {
        arr.push(i);
    }
    return arr;
}

let months = numRange(1, 12);
let years = numRange(2015, 2025);

let renderOption = num => {
	return <option key={num} value={num}>{num}</option>;
};

let CreditCardView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getSelectedCard() {
    	return Store.getSelectedCard();
    },

    getInitialState() {
        return {
            exp_month: null,
            exp_year: null,
            card_number: null,
            cvc: null,
            markers: {},
            useHomeAddress: !!Store.getCurrentUser().get('address').line1
        };
    },
    componentDidMount() {
        Store.addSaveProfileListener(this._onSaveProfile);
        Store.addSetSelectedCardListener(this._updateSelectedCard);

        // select2
        $('#credit-card-view').find('select').select2({
            minimumResultsForSearch: -1
        });
        $('#credit-card-view').find('select').on('change', this._selectChange);
	},
	componentDidUpdate() {
		$('#credit-card-view').find('select').select2({
            minimumResultsForSearch: -1
        });
        $('#credit-card-view').find('select').off();
        $('#credit-card-view').find('select').on('change', this._selectChange);
	},
    componentWillUnmount() {
        Store.removeSaveProfileListener(this._onSaveProfile);
        $('#credit-card-view').find('select').off('change');
	},
	renderSelectedCard() {
		return (
			<div id="credit-card-view" className="selected-card">
				<div className="form-group">
	                <div className="col-xs-12 no-padding">
	                    <label className="col-sm-4 control-label" htmlFor="brand">Card Company:</label>
                        <div className="col-xs-8 col-sm-8">
                            {this.state.brand}
                        </div>
	               	</div>
	           	</div>
				<div className="form-group">
	                <div className="col-xs-12 no-padding">
	                    <label className="col-sm-4 control-label" htmlFor="card-number">Card number:</label>
	                    <div className="col-sm-8">
	                        {'XXXX-XXXX-XXXX-' + this.state.last4}
	                    </div>
	                </div>
	            </div>

	            <div className="form-group">
	                <div className="col-xs-12 no-padding">
	                    <label className="col-sm-4 control-label">Expires:</label>
	                    <div className="col-sm-8">
                            {this.state.exp_month} / {this.state.exp_year}
	                    </div>
	                </div>
	            </div>
			</div>
		);
	},
	renderNewCard() {
		return (
			<div id="credit-card-view">
				<div className="form-group">
	                <div className="col-xs-12 no-padding">
	                    <label className="col-sm-4 control-label" htmlFor="card-number">Card number:</label>
	                    <div className="col-sm-8 no-padding">
	                    	<div className={'input-group input-with-label ' + this.state.markers.card_number}>
	                        	<input type="text" id="card-number" name="card_number" className="form-control" maxLength="16" placeholder="card number" onChange={this._inputChanged} onKeyUp={this._removeMarker} />
	                    		<i className="fa fa-times"></i>
		                		<i className="fa fa-check"></i>
	                    	</div>
	                    </div>
	                </div>
	            </div>

	            <div className="form-group">
	                <div className="col-xs-12 no-padding">
	                    <label className="col-sm-4 control-label">Valid to:</label>
	                    <div className="col-sm-8 mt8 no-padding">
	                        <div className={'col-xs-6 no-padding pr10 ' + this.state.markers.exp_month}>
	                            <select name="exp_month" id="valid-month " placeholder="exp month">
	                            	<option></option>
	                            	{_.map(months, renderOption)}
	                            </select>
	                        </div>
	                        <div className={'col-xs-6 no-padding pl10 ' + this.state.markers.exp_year}>
	                            <select name="exp_year" id="valid-year" placeholder="exp year">
	                            	<option></option>
	                            	{ years.map(renderOption) }
	                            </select>
	                        </div>
	                    </div>
	                </div>
	            </div>

	            <div className="form-group">
	                <div className="col-xs-12 no-padding">
	                	<label className="col-sm-4 control-label pt0-sm" htmlFor="number-on-card">CVV/CVC:</label>
	                    <div className="col-sm-2 no-padding">
	                    	<div className={'input-group input-with-label ' + this.state.markers.cvc}>
	                        	<input id="number-on-card" name="cvc" type="text" maxLength="4" className="form-control" onChange={this._inputChanged} onKeyUp={this._removeMarker}/>
	                        	<i className="fa fa-times"></i>
		                		<i className="fa fa-check"></i>
	                    	</div>
	                    </div>
	                </div>
	            </div>
	            <div className="form-group">
                	<label className="col-sm-4 control-label pt0-sm">Billing address:</label>
                    <div className="col-sm-8 no-padding mt10">

						{ this.renderAddressBase() }

                    </div>
	            </div>
			</div>
		);
	},
	render() {
		if (this.state.last4) {
			return this.renderSelectedCard();
		} else {
			return this.renderNewCard();
		}
	},
	renderAddressBase() {
		if (Store.getCurrentUser().get('address').line1) {
			return (
				<div>
					<div className="tal ml10">
		                <input checked={this.state.useHomeAddress} id="useHome1" onChange={this._toggleAddressForm} type="radio" name="useHomeAddress" value="1" />
                    	<label className="ml6" htmlFor="useHome1">use {Store.getCurrentUser().get('address').line1}</label>
                	</div>
                	<div className="tal ml10 mb10">
		                <input checked={!this.state.useHomeAddress} id="useHome0" onChange={this._toggleAddressForm} type="radio" name="useHomeAddress" value="0" />
                    	<label className="ml6" htmlFor="useHome0">different billing address</label>
                	</div>

	                { this.renderAddressFields() }

				</div>
			);
		} else {
			return this.renderAddressFields();
		}
	},
	renderAddressFields() {
		if (!this.state.useHomeAddress) {
			return (
				<div>
					<div className={'mb10 input-group input-with-label ' + this.state.markers.line1}>
		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('line1')} type="text" name="line1" className="form-control" placeholder="Address Line 1"/>
		                <i className="fa fa-times"></i>
		                <i className="fa fa-check"></i>
		            </div>
		            <div className={'mb10 input-group input-with-label ' + this.state.markers.line2}>
		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('line2')} type="text" name="line2" className="form-control" placeholder="Address Line 2"/>
		                <i className="fa fa-times"></i>
		                <i className="fa fa-check"></i>
		            </div>
		            <div className={'mb10 input-group input-with-label ' + this.state.markers.city}>
		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('city')} type="text" name="city" className="form-control" placeholder="City"/>
		                <i className="fa fa-times"></i>
		                <i className="fa fa-check"></i>
		            </div>
	        		<div className="row">
				        <div className="col-xs-4 no-padding pr20">
				            <div className={'input-group input-with-label ' + this.state.markers.state}>
				                <input onKeyUp={this._removeMarker} valueLink={this.linkState('state')} type="text" name="state" className="form-control" placeholder="State" maxLength="2" />
				                <i className="fa fa-times"></i>
				                <i className="fa fa-check"></i>
				            </div>
				        </div>
				        <div className="col-xs-8 no-padding">
				            <div className={'input-group input-with-label ' + this.state.markers.postal_code}>
				                <input onKeyUp={this._removeMarker} valueLink={this.linkState('postal_code')} type="text" name="postal_code" className="form-control" placeholder="Zip"/>
				                <i className="fa fa-times"></i>
				                <i className="fa fa-check"></i>
				            </div>
				        </div>
		            </div>
				</div>
			);
		}
	},
	_inputChanged(e) {
		vsBinding.call(this, e, this.setEnabledButton);
	},
	_selectChange(e) {
		$(e.currentTarget).parents('.has-error').removeClass('has-error');
		vsBinding.apply(this, arguments);
	},
	setEnabledButton() {
        Actions.setEnabledButton(!!(this.state.exp_month && this.state.exp_year && this.state.card_number && this.state.cvc));
	},
	_toggleAddressForm(e) {
		let attr = $(e.target).attr('name');
	    let val = Number(e.target.value);
	    this.setState({ useHomeAddress: val });
	},
	_onSaveProfile() {
        let values = _.clone(this.state);
   		delete values.markers;
   		delete values.errors;

  	    if (this.state.useHomeAddress) {
        	let homeAddress = Store.getCurrentUser().get('address');
  	    	_.extend(values, homeAddress);
  	    }

		let markers = {};
		let hasErrors = this.hasErrors();
    	if (hasErrors) {
    		for (let key in hasErrors) {
    			markers[key] = 'has-error';
    		}
        }

        this.setState({ markers: markers });

        if (hasErrors) { return; }

        Actions.startLoading();

		Store.getCurrentUser().saveTransactor({
        	updates: {
        		type: 0,
        		details: values
        	}
        })
        .fail(res => {
        	Store.getCurrentUser().validationError = true;
        	Actions.okpAlert({body: res.responseJSON.message || 'Sorry there was an error'});
        });
	},
	_updateSelectedCard() {
		this.replaceState(this.getSelectedCard());
	},
    _removeMarker(e) {
    	let attr = $(e.currentTarget).attr('name');
        let markers = this.state.markers;
        markers[attr] = '';
        this.setState({ markers: markers });
    },
    hasErrors() {
    	let errors = {};
    	let state = this.state;
    	if (!state.card_number) {
            errors.card_number = 'Please enter a card number';
        }
        if (!state.exp_month) {
            errors.exp_month = 'Please enter a month';
        }
        if (!state.exp_year) {
            errors.exp_year = 'Please enter a year';
        }
        if (!state.cvc) {
            errors.cvc = 'Please enter an CVC/CVV';
        }
    	if (!state.line1) {
            errors.line1 = 'Please enter an address';
        }
        if (!state.city) {
            errors.city = 'Please enter a city';
        }
        if (!state.state || state.state.length !== 2) {
            errors.state = 'Please enter a state';
        }
        if (!state.postal_code) {
            errors.postal_code = 'Please enter a zip code';
        }
        if (!_.isEmpty(errors)) {
        	return errors;
        }
    }
});

module.exports = CreditCardView;
