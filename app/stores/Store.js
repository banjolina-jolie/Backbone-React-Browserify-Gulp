'use strict';

let Dispatcher = require('../dispatcher/Dispatcher');
let EventEmitter = require('events').EventEmitter;
let Constants = require('../constants/Constants');
let assign = require('object-assign');
let User =  require('../models/UserModel');

// Events
let UI_CHANGE_EVENT = 'uiChange';
let SAVE_PROFILE_EVENT = 'saveProfile';
let SET_CURRENT_USER_EVENT = 'setCurrentUser';
let SET_ENABLE_BUTTON_EVENT = 'setEnableButton';
let SET_PAYMENT_METHODS_EVENT = 'setPaymentMethods';
let SET_SELECTED_CARD_EVENT = 'setSelectedCard';
let SET_LOADING_EVENT = 'setLoading';
let APP_ALERT_EVENT = 'appAlert';

// Persisted Values
let _currentUser = new User();
let _header = null;
let _footer = null;
let _buttonEnableState = null;
let _paymentMethods = null;
let _selectedCard = null;
let _loading = null;
let _alert = null;
let _checkListenerSuccessCB = {};
let _view = null;
let _viewData = { user: _currentUser };


// Persisted Value Modifiers
function setCurrentUser(model) {
	_currentUser = model;
}

function changeUI(ui, view, viewData) {
	_buttonEnableState = null;
	_header = ui;
	_footer = ui;

	if (view) {
		_view = view;
	}

	_viewData = viewData || {};
}

function changeEnableButton(enabled) {
	_buttonEnableState = enabled;
}

function setPaymentMethods(methods) {
	_paymentMethods = methods;
}

function setSelectedCard(card) {
	_selectedCard = card;
}

function setLoading(loading) {
	_loading = loading;
}

function updateCurrentMtg(mtg) {
	_currentMtg = mtg;
}

function setAlert(alert) {
	_alert = alert;
}


// Store Methods
let Store = assign({}, EventEmitter.prototype, {

	emitChange(evt) {
		this.emit(evt);
	},

	getCurrentUser() {
		return _currentUser;
	},

	getHeader() {
		return _header;
	},

	getFooter() {
		return _footer;
	},

	getButtonEnableState() {
		return _buttonEnableState;
	},

	getPaymentMethods() {
		return _paymentMethods;
	},

	getSelectedCard() {
		return _selectedCard;
	},

	getLoading() {
		return _loading;
	},

	getAlert() {
		return _alert;
	},

	getView() {
		return {
			view: _view,
			data: _viewData
		}
	},

	addUIChangeListener(callback) {
		this.on(UI_CHANGE_EVENT, callback);
	},

	removeUIChangeListener(callback) {
		this.removeListener(UI_CHANGE_EVENT, callback);
	},

	addSaveProfileListener(callback) {
		this.on(SAVE_PROFILE_EVENT, callback);
	},

	removeSaveProfileListener(callback) {
		this.removeListener(SAVE_PROFILE_EVENT, callback);
	},

	addEnableButtonListener(callback) {
		this.on(SET_ENABLE_BUTTON_EVENT, callback);
	},

	removeEnableButtonListener(callback) {
		this.removeListener(SET_ENABLE_BUTTON_EVENT, callback);
	},

	addSetPaymentMethodsListener(callback) {
		this.on(SET_PAYMENT_METHODS_EVENT, callback);
	},

	removeSetPaymentMethodsListener(callback) {
		this.removeListener(SET_PAYMENT_METHODS_EVENT, callback);
	},

	addSetSelectedCardListener(callback) {
		this.on(SET_SELECTED_CARD_EVENT, callback);
	},

	removeSetSelectedCardListener(callback) {
		this.removeListener(SET_SELECTED_CARD_EVENT, callback);
	},

	addSetLoadingListener(callback) {
		this.on(SET_LOADING_EVENT, callback);
	},

	removeSetLoadingListener(callback) {
		this.removeListener(SET_LOADING_EVENT, callback);
	},

	addSetCurrentUserListener(callback) {
		this.on(SET_CURRENT_USER_EVENT, callback);
	},

	removeSetCurrentUserListener(callback) {
		this.removeListener(SET_CURRENT_USER_EVENT, callback);
	},

	addAppAlertListener(callback) {
		this.on(APP_ALERT_EVENT, callback);
	},

	removeAppAlertListener(callback) {
		this.removeListener(APP_ALERT_EVENT, callback);
	}

});

// Register callback to handle all updates
Dispatcher.register(action => {

	switch(action.actionType) {

		case Constants.SET_CURRENT_USER:
			setCurrentUser(action.userModel);
			Store.emitChange(SET_CURRENT_USER_EVENT);
		break;

		case Constants.CHANGE_UI:
			changeUI(action.ui, action.view, action.viewData);
			Store.emitChange(UI_CHANGE_EVENT);
		break;

		case Constants.SAVE_PROFILE:
			Store.emitChange(SAVE_PROFILE_EVENT);
		break;

		case Constants.SET_ENABLE_BUTTON:
			changeEnableButton(action.enabled);
			Store.emitChange(SET_ENABLE_BUTTON_EVENT);
		break;

		case Constants.SET_PAYMENT_METHODS:
			setPaymentMethods(action.details);
			Store.emitChange(SET_PAYMENT_METHODS_EVENT);
		break;

		case Constants.SET_SELECTED_CARD:
			setSelectedCard(action.card);
			Store.emitChange(SET_SELECTED_CARD_EVENT);
		break;

		case Constants.SET_LOADING:
			setLoading(action.loading);
			Store.emitChange(SET_LOADING_EVENT);
		break;


		case Constants.APP_ALERT:
			setAlert(action.alert);
			Store.emitChange(APP_ALERT_EVENT);
		break;

		default:
			// no op
	}
});

module.exports = Store;
