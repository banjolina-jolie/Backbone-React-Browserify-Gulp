'use strict';

let Dispatcher = require('../dispatcher/Dispatcher');
let Constants = require('../constants/Constants');

let Actions = {
    setCurrentUser(userModel) {
        Dispatcher.dispatch({
            actionType: Constants.SET_CURRENT_USER,
            userModel: userModel
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
            loading: loading
        });
    },
    setUI(ui, view, viewData) {
        Dispatcher.dispatch({
            actionType: Constants.CHANGE_UI,
            ui: ui,
            view: view,
            viewData: viewData
        });
    }
};

module.exports = Actions;
