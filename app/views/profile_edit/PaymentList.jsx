var React = require('react/addons');
var Store = require('../../stores/Store');
var Actions = require('../../actions/Actions');
var NewPayment = require('./NewPayment.jsx');

var PaymentListView = React.createClass({
    getPaymentMethods: function () {
        return Store.getPaymentMethods();
    },
    getInitialState: function () {
        var state = this.getPaymentMethods() || {methods: []};
        state.addNew = false;
        return state;
    },
    componentWillUnmount: function () {
        $('#save-profile-edit').removeClass('hidden');
    },
    render: function () {
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
                        {function () {
                            if (!this.state.methods || !this.state.methods.length) {
                                return (
                                    <div className="mb20">
                                        <div className="mb20">
                                        You have no payment methods on file
                                        </div>
                                    </div>
                                );
                            }
                        }.call(this)}
                        
                        {this.state.methods.map(function (method, idx) {
                            var text = method.bankName || method.brand;
                            text += ' ( ...ending with ' + method.last4 + ')';

                            return (
                                <div className="" key={idx} data-idx={idx} onClick={this._setSelectedCard}>
                                    {text}
                                </div>
                            );
                        }.bind(this))}
                    </div>
                    <div className="col-xs-12 mt40 no-padding">
                        <button className="btn btn-default btn-solid btn-blue" onClick={this._setAddNew}>{this._addOrChange()}</button>
                    </div>
    	        </div>
            );
        }
    },
    _addOrChange: function () {
        // render text
        return this.state.methods.length ? 'Change' : 'Add';
    },
    _updateMethods: function () {
        var state = this.getPaymentMethods() || {methods: []};
        this.setState(state);
    },
    _removePaymentMethod: function (e) {
        Actions.startLoading();
        var pmId = $(e.currentTarget).data('pmid');
        this.props.user.removePaymentMethod(pmId)
        .always(function () {
            Actions.stopLoading();
        });
    },
    _setListView: function () {
        this.setState({ addNew: false });
    },
    _setSelectedCard: function (e) {
        var idx = e.currentTarget.dataset.idx;
        Actions.setSelectedCard(this.state.methods[idx]);
    },
    _setAddNew: function () {
        this.setState({ addNew: true });
    }
});

module.exports = PaymentListView;
