'use strict';

let Dispatcher = require('../dispatcher/Dispatcher');
let Constants = require('../constants/Constants');

let Actions = {
    startLoading() {
        this._setLoading(true);
    },
    stopLoading() {
        this._setLoading(false);
    },
    _setLoading(loading) {
        Dispatcher.dispatch({
            actionType: Constants.SET_LOADING,
            loading
        });
    },
    setMessageUrl(messageUrl) {
        Dispatcher.dispatch({
            actionType: Constants.SET_MESSAGE_URL,
            messageUrl
        });
    },
    setMessages(messages) {
        Dispatcher.dispatch({
            actionType: Constants.SET_MESSAGES,
            messages
        });
    },
    setUI(ui, view, viewData) {
        Dispatcher.dispatch({
            actionType: Constants.CHANGE_UI,
            ui,
            view,
            viewData
        });
    }
};

module.exports = Actions;
