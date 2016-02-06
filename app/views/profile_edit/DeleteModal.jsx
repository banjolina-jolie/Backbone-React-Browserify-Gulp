var React = require('react');

var DeleteModalView = React.createClass({

    render: function () {
        return (
            <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="deleteModalLabel">Delete Account</h4>
                        </div>
                        <div className="modal-body">
                    		<div className="mb20">Are you absolutely sure you want to delete your account?</div>
                            <div className="tar">
		                        <button type="button" data-dismiss="modal" className="btn btn-default btn-outline btn-grey inline-btn mr10">Cancel</button>
		                        <button type="button" onClick={this.deleteAccount} className="btn btn-default btn-outline btn-red inline-btn">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    deleteAccount: function () {
        this.props.user.destroy()
        .always(function () {
            window.location.href = '/';
        });
    }
});

module.exports = DeleteModalView;
