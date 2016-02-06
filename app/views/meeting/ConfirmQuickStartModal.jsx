var React = require('react/addons');
var Store = require('../../stores/Store');

var ConfirmQuickStartView = React.createClass({
    getInitialState: function () {
        return Store.getQuickStartOptions();
    },
	componentDidMount: function () {
		Store.addQuickStartListener(this._openModal);
	},
	componentWillUnmount: function () {
		Store.removeQuickStartListener(this._openModal);
	},
	render: function () {
		return (
			<div className="modal fade" id="confirmQuickStartModal" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="confirmQuickStartModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="confirmQuickStartModalLabel">Please verify your email address</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="form-group">
					                    <div className="input-group input-with-label">
					                        <input name="email" onKeyPress={this._checkEnter} id="quickStartEmail" className="form-control" placeholder="Type here" />
					                    </div>
					                    <div className="flash-msg-container">
					                    	<span className="confirm-quickstart-modal-flash flash-msg-error hidden">Sorry that email does not unlock this room.</span>
					                    </div>
					                </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-solid btn-blue" onClick={this._confirm}>OK</button>
                			<button type="button" className="btn btn-default btn-outline btn-blue" data-dismiss="modal" onClick={this._cancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
		);
	},
    renderLoginModal: function () {
        $('#confirmQuickStartModal').modal('hide');
        $('#loginModal').modal('show');
    },
	_confirm: function () {
        if (this.state.currentLead.toLowerCase() === $('#quickStartEmail').val().toLowerCase()) {
            if (!window.bc) {
                this.state.self.listenToOnce(this.state.self, 'bc:ready', this.state.renderMtg);
            } else {
                this.state.renderMtg();
            }
    		$('#confirmQuickStartModal').modal('hide');
        } else {
        	$('.flash-msg-error').toggleClass('hidden');
            setTimeout(function () {
                $('.flash-msg-error').toggleClass('hidden');
            }, 3000);
        }
	},
	_cancel: function () {
		$('#confirmQuickStartModal').modal('hide');
        Backbone.history.navigate('/users/' + this.state.userName, true);
    },
	_checkEnter: function (e) {
    	if (e && e.which === 13) {
    		this._confirm();
    	}
    },
    _openModal: function () {
    	this.setState(Store.getQuickStartOptions(), function () {
            $('#confirmQuickStartModal').modal('show');
        });
    }
});

module.exports = ConfirmQuickStartView;
