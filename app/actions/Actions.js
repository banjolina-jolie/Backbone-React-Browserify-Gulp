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
        setTimeout(_ => {
            Dispatcher.dispatch({
                actionType: Constants.SET_LOADING,
                loading: loading
            });
        }, 0);
    },
    setUI(ui, view, viewData) {
        Dispatcher.dispatch({
            actionType: Constants.CHANGE_UI,
            ui: ui,
            view: view,
            viewData: viewData
        });
    },
    setEnabledButton(enabled) {
        Dispatcher.dispatch({
            actionType: Constants.SET_ENABLE_BUTTON,
            enabled: enabled
        });
    },
    saveProfile() {
        Dispatcher.dispatch({
            actionType: Constants.SAVE_PROFILE
        });
    },
    setPaymentMethods(paymentMethods) {
        Dispatcher.dispatch({
            actionType: Constants.SET_PAYMENT_METHODS,
            paymentMethods: paymentMethods
        });
    },
    setSelectedCard(card) {
        Dispatcher.dispatch({
            actionType: Constants.SET_SELECTED_CARD,
            card: card
        });
    },
    appAlert(alert) {
        Dispatcher.dispatch({
            actionType: Constants.APP_ALERT,
            alert: alert
        });
    }
};

module.exports = Actions;
