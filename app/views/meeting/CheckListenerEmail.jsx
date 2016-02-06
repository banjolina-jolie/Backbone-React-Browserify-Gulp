var React = require('react/addons');
var Store = require('../../stores/Store');
var Actions = require('../../actions/Actions');
var Meeting = require('../../models/MeetingModel');

var CheckListenerEmail = React.createClass({
    getInitialState: function () {
        return Store.getCheckListenerSuccessCB();
    },
	componentDidMount: function () {
		Store.addSetCheckEmailSuccessListener(this._openModal);
	},
	componentWillUnmount: function () {
		Store.removeSetCheckEmailSuccessListener(this._openModal);
	},
	render: function () {
		return (
			<div className="modal fade" id="checkListenerModal" tabIndex="-1" data-backdrop="static" role="dialog" aria-labelledby="checkListenerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="checkListenerModalLabel">Please verify your email address</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="form-group">
					                    <div className="input-group input-with-label">
					                        <input name="email" onKeyPress={this._checkEnter} id="checkListenerEmail" className="form-control" placeholder="Type here" />
					                    </div>
					                    <div className="flash-msg-container">
					                    	<span className="check-listener-modal-flash flash-msg-error hidden">Sorry that email does not unlock this room.</span>
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
        $('#checkListenerModal').modal('hide');
        $('#loginModal').modal('show');
    },
	_confirm: function () {
		// send 
		var self = this;
        var listenerEmail = $('#checkListenerEmail').val().toLowerCase();
    	Actions.startLoading();

    	this.props.user.checkMtgListener(listenerEmail, this.state.meetingId)
    	.done(function (mtg) {
            mtg = Meeting.prototype.parse(mtg);
            self.props.user.set({ email: listenerEmail });
        	self.state.successCB(mtg.presenter.username, mtg);
    		$('#checkListenerModal').modal('hide');
    	})
    	.fail(function () {
        	$('.flash-msg-error').toggleClass('hidden');
            setTimeout(function () {
                $('.flash-msg-error').toggleClass('hidden');
            }, 3000);
    	});
	},
	_cancel: function () {
		$('#checkListenerModal').modal('hide');
        Backbone.history.navigate('/', true);
    },
	_checkEnter: function (e) {
    	if (e && e.which === 13) {
    		this._confirm();
    	}
    },
    _openModal: function () {
    	this.setState(Store.getCheckListenerSuccessCB(), function () {
            $('#checkListenerModal').modal('show');
        });
    }
});

module.exports = CheckListenerEmail;
