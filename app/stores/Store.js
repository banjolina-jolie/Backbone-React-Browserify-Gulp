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
let OKP_ALERT_EVENT = 'okpAlert';

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

function changeUI(view, viewData) {
	_view = view;
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

		case Constants.SET_LOADING:
			setLoading(action.loading);
			Store.emitChange(SET_LOADING_EVENT);
		break;

		default:
			// no op
	}
});

module.exports = Store;
