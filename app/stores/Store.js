var Dispatcher = require('../dispatcher/Dispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');
var User =  require('../models/UserModel');

// Events
var UI_CHANGE_EVENT = 'uiChange';
var SAVE_PROFILE_EVENT = 'saveProfile';
var SET_CURRENT_USER_EVENT = 'setCurrentUser';
var SET_ENABLE_BUTTON_EVENT = 'setEnableButton';
var SET_PAYMENT_METHODS_EVENT = 'setPaymentMethods';
var SET_SELECTED_CARD_EVENT = 'setSelectedCard';
var SET_LOADING_EVENT = 'setLoading';
var OKP_ALERT_EVENT = 'okpAlert';

// Persisted Values
var _currentUser = new User();
var _header = null;
var _footer = null;
var _buttonEnableState = null;
var _paymentMethods = null;
var _selectedCard = null;
var _loading = null;
var _alert = null;
var _checkListenerSuccessCB = {};
var _view = null;
var _viewData = { user: _currentUser };


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
var Store = assign({}, EventEmitter.prototype, {

	emitChange: function (evt) {
		this.emit(evt);
	},

	getCurrentUser: function () {
		return _currentUser;
	},

	getHeader: function () {
		return _header;
	},

	getFooter: function () {
		return _footer;
	},

	getButtonEnableState: function () {
		return _buttonEnableState;
	},

	getPaymentMethods: function () {
		return _paymentMethods;
	},

	getSelectedCard: function () {
		return _selectedCard;
	},

	getLoading: function () {
		return _loading;
	},

	getAlert: function () {
		return _alert;
	},

	getView: function () {
		return {
			view: _view,
			data: _viewData
		}
	},

	addUIChangeListener: function (callback) {
		this.on(UI_CHANGE_EVENT, callback);
	},

	removeUIChangeListener: function (callback) {
		this.removeListener(UI_CHANGE_EVENT, callback);
	},

	addSaveProfileListener: function (callback) {
		this.on(SAVE_PROFILE_EVENT, callback);
	},

	removeSaveProfileListener: function (callback) {
		this.removeListener(SAVE_PROFILE_EVENT, callback);
	},

	addEnableButtonListener: function (callback) {
		this.on(SET_ENABLE_BUTTON_EVENT, callback);
	},

	removeEnableButtonListener: function (callback) {
		this.removeListener(SET_ENABLE_BUTTON_EVENT, callback);
	},

	addSetPaymentMethodsListener: function (callback) {
		this.on(SET_PAYMENT_METHODS_EVENT, callback);
	},

	removeSetPaymentMethodsListener: function (callback) {
		this.removeListener(SET_PAYMENT_METHODS_EVENT, callback);
	},

	addSetSelectedCardListener: function (callback) {
		this.on(SET_SELECTED_CARD_EVENT, callback);
	},

	removeSetSelectedCardListener: function (callback) {
		this.removeListener(SET_SELECTED_CARD_EVENT, callback);
	},

	addSetLoadingListener: function (callback) {
		this.on(SET_LOADING_EVENT, callback);
	},

	removeSetLoadingListener: function (callback) {
		this.removeListener(SET_LOADING_EVENT, callback);
	},

	addSetCurrentUserListener: function (callback) {
		this.on(SET_CURRENT_USER_EVENT, callback);
	},

	removeSetCurrentUserListener: function (callback) {
		this.removeListener(SET_CURRENT_USER_EVENT, callback);
	},

	addOkpAlertListener: function (callback) {
		this.on(OKP_ALERT_EVENT, callback);
	},

	removeOkpAlertListener: function (callback) {
		this.removeListener(OKP_ALERT_EVENT, callback);
	}

});

// Register callback to handle all updates
Dispatcher.register(function (action) {

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


		case Constants.OKP_ALERT:
			setAlert(action.alert);
			Store.emitChange(OKP_ALERT_EVENT);
		break;

		default:
			// no op
	}
});

module.exports = Store;
