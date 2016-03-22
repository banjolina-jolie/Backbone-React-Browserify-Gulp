'use strict';

let Store = require('../stores/Store');
let React = require('react/addons');
let Actions = require('../actions/Actions');
let ContactUsModal = require('./ContactUsModal.jsx');
let LoginModal = require('./LoginModal.jsx');
let RegisterModal = require('./register/RegisterModal.jsx');
let Header = require('../views/Header.jsx');
let Footer = require('../views/Footer.jsx');


let getState = _ => {
    return {
        user: Store.getCurrentUser(),
        header: Store.getHeader(),
        footer: Store.getFooter(),
        loading: false,
        alert: {},
        view: Store.getView().view,
        viewData: Store.getView().data
    };
}

let AppBaseView = React.createClass({
    getInitialState() {
        return getState();
    },

    componentDidMount() {
        Store.addUIChangeListener(this._onUIChange);
        Store.addSetLoadingListener(this._updateLoading);
        Store.addOkpAlertListener(this._showAlert);
        Store.addSetCurrentUserListener(this._onUIChange);
    },

    componentWillUnmount() {
        Store.removeUIChangeListener(this._onUIChange);
        Store.removeLoadingListener(this._updateLoading);
        Store.removeOkpAlertListener(this._showAlert);
        Store.removeSetCurrentUserListener(this._onUIChange);
    },

    render() {
        let classes = 'spinner';
        let divStyle = { height: 0 };

        if (this.state.loading) {
            classes += ' loading';
            divStyle.height = $(window).height() + 'px';
        }

        return (
            <div className="app-view">
                <div className={classes} style={divStyle}></div>

                { this.renderHeader() }

                <div id="content"></div>

                {this.renderAlertModal()}

                <ContactUsModal />

                { this.renderRegisterModal() }

                <LoginModal />
            </div>
        );
    },
    renderRegisterModal() {
        if (!this.state.user.id) {
            return (<RegisterModal />);
        }
    },
    renderHeader() {
        if (this.state.header) {
            return ( <Header /> );
        }
    },
    renderAlertModal() {
        let alert = this.state.alert;
        return (
            <div className="modal fade" id="alertModal" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="alertModalLabel">{alert.title}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    { this.renderAlertBody() }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-solid btn-blue" onClick={this._clickAlertConfirm}>OK</button>

                            { this.renderCancelBtn() }

                        </div>
                    </div>
                </div>
            </div>
        );
    },

    renderAlertBody() {
        let alert = this.state.alert;
        if (_.isFunction(alert.body)) {
            return alert.body();
        } else {
            return alert.body;
        }
    },

    renderCancelBtn() {
        if (this.state.alert.cancel) {
            return (
                <button type="button" className="btn btn-default btn-outline btn-blue" data-dismiss="modal" onClick={this._clickAlertCancel}>Cancel</button>
            );
        }
    },

    _onUIChange() {
        this.setState(getState(), _ => {
            if (this.state.view) {
                React.render(React.createElement(this.state.view, this.state.viewData), document.getElementById('content'));
            }
        });
    },

    _updateLoading() {
        this.setState({loading: Store.getLoading()});
    },

    _showAlert() {
        this.setState({alert: Store.getAlert()}, _ => {
            $('#alertModal').modal('show');
            Actions.stopLoading();
        });
    },

    _clickAlertConfirm(e) {
        e.preventDefault();

        if (!this.state.alert.keepOpen) {
            $('#alertModal').modal('hide');
        }

        if (_.isFunction(this.state.alert.ok)) {
            this.state.alert.ok();
        } else {
            $('#alertModal').modal('hide');
        }
    },

    _clickAlertCancel(e) {
        e.preventDefault();

        $('#alertModal').modal('hide');

        if (_.isFunction(this.state.alert.cancel)) {
            this.state.alert.cancel();
        }
    }
});

module.exports = AppBaseView;
