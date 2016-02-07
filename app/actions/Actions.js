var Dispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var Actions = {
    setCurrentUser: function (userModel) {
        Dispatcher.dispatch({
            actionType: Constants.SET_CURRENT_USER,
            userModel: userModel
        });
    },
    startLoading: function () {
        this._setLoading(true);
    },
    stopLoading: function () {
        this._setLoading(false);
    },
    _setLoading: function (loading) {
        setTimeout(function () {
            Dispatcher.dispatch({
                actionType: Constants.SET_LOADING,
                loading: loading
            });
        }, 0);
    },
    setUI: function (ui, view, viewData) {
        Dispatcher.dispatch({
            actionType: Constants.CHANGE_UI,
            ui: ui,
            view: view,
            viewData: viewData
        });
    },
    setEnabledButton: function (enabled) {
        Dispatcher.dispatch({
            actionType: Constants.SET_ENABLE_BUTTON,
            enabled: enabled
        });
    },
    saveProfile: function () {
        Dispatcher.dispatch({
            actionType: Constants.SAVE_PROFILE
        });
    },
    setSelectedUser: function (user) {
        Dispatcher.dispatch({
            actionType: Constants.UPDATE_CURRENT_SELECTED_USER,
            user: user
        });
    },
    setPaymentMethods: function (paymentMethods) {
        Dispatcher.dispatch({
            actionType: Constants.SET_PAYMENT_METHODS,
            paymentMethods: paymentMethods
        });
    },
    setSelectedCard: function (card) {
        Dispatcher.dispatch({
            actionType: Constants.SET_SELECTED_CARD,
            card: card
        });  
    },
    okpAlert: function (alert) {
        Dispatcher.dispatch({
            actionType: Constants.OKP_ALERT,
            alert: alert
        }); 
    }
};

module.exports = Actions;
