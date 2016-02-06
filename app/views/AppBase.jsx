var Store = require('../stores/Store');
var React = require('react/addons');
var uiConfig = require('../utils/uiConfig')();
var Actions = require('../actions/Actions');
var ContactUsModal = require('./ContactUsModal.jsx');
var ConfirmQuickStartModal = require('./meeting/ConfirmQuickStartModal.jsx');
var CheckListenerEmail = require('./meeting/CheckListenerEmail.jsx');
var Header = require('../views/Header.jsx');
var Footer = require('../views/Footer.jsx');


function getState() {
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

var AppBaseView = React.createClass({
	getInitialState: function () {
        return getState();
	},

	componentDidMount: function () {
	    Store.addUIChangeListener(this._onUIChange);
        Store.addSetLoadingListener(this._updateLoading);
        Store.addOkpAlertListener(this._showAlert);
        Store.addSetCurrentUserListener(this._onUIChange);
	},

	componentWillUnmount: function () {
        Store.removeUIChangeListener(this._onUIChange);
	    Store.removeLoadingListener(this._updateLoading);
        Store.removeOkpAlertListener(this._showAlert);
        Store.removeSetCurrentUserListener(this._onUIChange);
	},

    render: function () {
        var classes = 'spinner';
        var divStyle = { height: 0 };

        if (this.state.loading) {
            classes += ' loading';
            divStyle.height = $(window).height() + 'px';
        }

        return (
            <div className="app-view">
                <div className={classes} style={divStyle}></div>
                
                { this.renderHeader() }

                <div id="content"></div>
                
                <Footer />
                
                {this.renderAlertModal()}
                <ContactUsModal user={this.state.user}/>
                <ConfirmQuickStartModal user={this.state.user}/>
                <CheckListenerEmail user={this.state.user}/>
            </div>
        );
    },
    renderHeader: function () {
        if (this.state.header) {
            return ( <Header /> );
        }
    },
    renderAlertModal: function () {
        var alert = this.state.alert;
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

    renderAlertBody: function () {
        var alert = this.state.alert;
        if (_.isFunction(alert.body)) {
            return alert.body();
        } else {
            return alert.body;
        }
    },

    renderCancelBtn: function () {
        if (this.state.alert.cancel) {
            return (
                <button type="button" className="btn btn-default btn-outline btn-blue" data-dismiss="modal" onClick={this._clickAlertCancel}>Cancel</button>
            );
        }
    },

	_onUIChange: function () {
    	this.setState(getState(), function () {
            if (this.state.view) {
                React.render(React.createElement(this.state.view, this.state.viewData), document.getElementById('content'));
            }
        }.bind(this));
  	},

    _updateLoading: function () {
        this.setState({loading: Store.getLoading()});
    },

    _showAlert: function () {
        this.setState({alert: Store.getAlert()}, function () {
            $('#alertModal').modal('show');
            Actions.stopLoading();
        });
    },

    _clickAlertConfirm: function (e) {
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

    _clickAlertCancel: function (e) {
        e.preventDefault();

        $('#alertModal').modal('hide');

        if (_.isFunction(this.state.alert.cancel)) {
            this.state.alert.cancel();
        }
    }
});

module.exports = AppBaseView;
