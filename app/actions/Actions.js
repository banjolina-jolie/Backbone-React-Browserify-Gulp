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
    setMeetingsConfirm: function (mtgs) {
        Dispatcher.dispatch({
            actionType: Constants.SET_MEETINGS_CONFIRM,
            mtgs: mtgs
        });
    },
    setMeetingState: function (state) {
        Dispatcher.dispatch({
            actionType: Constants.SET_MEETING_STATE,
            state: state
        });  
    },
    setUsers: function (users) {
        Dispatcher.dispatch({
            actionType: Constants.SET_USERS,
            users: users
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
    updateCurrentMtg: function (mtg) {
        Dispatcher.dispatch({
            actionType: Constants.UPDATE_CURRENT_MTG,
            mtg: mtg
        });
    },
    okpAlert: function (alert) {
        Dispatcher.dispatch({
            actionType: Constants.OKP_ALERT,
            alert: alert
        }); 
    },
    setConfirmQuickStartOptions: function (options) {
        Dispatcher.dispatch({
            actionType: Constants.CONFIRM_QUICKSTART,
            options: options
        });
    },
    checkListenerEmail: function (successCB) {
        Dispatcher.dispatch({
            actionType: Constants.CHECK_LISTENER,
            successCB: successCB
        });  
    }
};

module.exports = Actions;
