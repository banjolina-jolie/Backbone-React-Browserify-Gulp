'use strict';

let React = require('react/addons');
let Store = require('../../stores/Store');
let Actions = require('../../actions/Actions');
let NewPayment = require('./NewPayment.jsx');

let PaymentListView = React.createClass({
    getPaymentMethods() {
        return Store.getPaymentMethods();
    },
    getInitialState() {
        let state = this.getPaymentMethods() || {methods: []};
        state.addNew = false;
        return state;
    },
    componentWillUnmount() {
        $('#save-profile-edit').removeClass('hidden');
    },
    render() {
        if (this.state.addNew) {
            $('#save-profile-edit').removeClass('hidden');
            return (
                <div className="row mb20 basic-form pl0">
                    <div className="col-xs-12">
                        <NewPayment user={this.props.user} />
                        <button className="btn btn-default fr cancel-new-payment ml10" onClick={this._setListView}>{'Cancel'}</button>
                    </div>
                </div>
            );
        } else {
            $('#save-profile-edit').addClass('hidden');

            return (
                <div className="row mb20">
                    <div className="col-xs-6 no-padding">
                        { this.renderEmpty() }

                        {this.state.methods.map((method, idx) => {
                            let text = method.bankName || method.brand;
                            text += ' ( ...ending with ' + method.last4 + ')';

                            return (
                                <div className="" key={idx} data-idx={idx} onClick={this._setSelectedCard}>
                                    {text}
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-xs-12 mt40 no-padding">
                        <button className="btn btn-default btn-solid btn-blue" onClick={this._setAddNew}>{this._addOrChange()}</button>
                    </div>
    	        </div>
            );
        }
    },
    renderEmpty() {
        if (!this.state.methods || !this.state.methods.length) {
            return (
                <div className="mb20">
                    <div className="mb20">
                    You have no payment methods on file
                    </div>
                </div>
            );
        }
    },
    _addOrChange() {
        // render text
        return this.state.methods.length ? 'Change' : 'Add';
    },
    _updateMethods() {
        let state = this.getPaymentMethods() || {methods: []};
        this.setState(state);
    },
    _removePaymentMethod(e) {
        Actions.startLoading();
        let pmId = $(e.currentTarget).data('pmid');
        this.props.user.removePaymentMethod(pmId)
        .always(_ => {
            Actions.stopLoading();
        });
    },
    _setListView() {
        this.setState({ addNew: false });
    },
    _setSelectedCard(e) {
        let idx = e.currentTarget.dataset.idx;
        Actions.setSelectedCard(this.state.methods[idx]);
    },
    _setAddNew() {
        this.setState({ addNew: true });
    }
});

module.exports = PaymentListView;
