'use strict';

let Dispatcher = require('../dispatcher/Dispatcher');
let EventEmitter = require('events').EventEmitter;
let Constants = require('../constants/Constants');
let assign = require('object-assign');

// Events
let UI_CHANGE_EVENT = 'uiChange';
let SET_LOADING_EVENT = 'setLoading';
let SET_MESSAGES_EVENT = 'setMessages';
let FETCH_MESSAGES_EVENT = 'fetchMessages';

// Persisted Values
let _view = null;
let _loading = null;
let _viewData = {};
let _messageUrl = null;
let _messages = [];


// Persisted Value Modifiers

function changeUI(view, viewData) {
	_view = view;
	_viewData = viewData || {};
}

function setLoading(loading) {
	_loading = loading;
}

function setMessages(messages) {
	_messages = messages;
}

function setMessageUrl(messageUrl) {
	_messageUrl = messageUrl;
}

// Store Methods
let Store = assign({}, EventEmitter.prototype, {

	emitChange(evt) {
		this.emit(evt);
	},

	getLoading() {
		return _loading;
	},

	getView() {
		return {
			view: _view,
			data: _viewData
		}
	},

	getMessages() {
		return _messages;
	},

	getMessageUrl() {
		return _messageUrl;
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

	addSetMessagesListener(callback) {
		this.on(SET_MESSAGES_EVENT, callback);
	},

	removeSetMessagesListener(callback) {
		this.removeListener(SET_MESSAGES_EVENT, callback);
	},

	addFetchMessagesListener(callback) {
		this.on(FETCH_MESSAGES_EVENT, callback);
	},

	removeFetchMessagesListener(callback) {
		this.removeListener(FETCH_MESSAGES_EVENT, callback);
	}

});

// Register callback to handle all updates
Dispatcher.register(action => {

	switch(action.actionType) {

		case Constants.CHANGE_UI:
			changeUI(action.view, action.viewData);
			Store.emitChange(UI_CHANGE_EVENT);
		break;

		case Constants.SET_LOADING:
			setLoading(action.loading);
			Store.emitChange(SET_LOADING_EVENT);
		break;

		case Constants.SET_MESSAGES:
			setMessageUrl(action.msgUrl);
			setMessages(action.messages);
			Store.emitChange(SET_MESSAGES_EVENT);
		break;

		case Constants.FETCH_MESSAGES:
			Store.emitChange(FETCH_MESSAGES_EVENT);
		break;

		default:
			// no op
	}
});

module.exports = Store;
