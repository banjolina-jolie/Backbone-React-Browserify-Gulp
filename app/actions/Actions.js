'use strict';

let Dispatcher = require('../dispatcher/Dispatcher');
let Constants = require('../constants/Constants');

let Actions = {
    setUI(view, viewData) {
        Dispatcher.dispatch({
            actionType: Constants.CHANGE_UI,
            view,
            viewData
        });
    },
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
    setMessages(msgUrl, messages) {
        Dispatcher.dispatch({
            actionType: Constants.SET_MESSAGES,
            msgUrl,
            messages
        });
    },
    fetchMessages() {
        Dispatcher.dispatch({
            actionType: Constants.FETCH_MESSAGES
        });
    }
};

module.exports = Actions;
