var React = require('react/addons');
var Store = require('../../stores/Store');

var ChangePassword = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount: function () {
        Store.addSaveProfileListener(this._onSaveProfile);
    },

    componentWillUnmount: function () {
        Store.removeSaveProfileListener(this._onSaveProfile);
    },

    getInitialState: function () {
        return {};
    },

    render: function () {
        return (
            <form className="basic-form mt20" id="change-pw">
                <div className="form-group">
                    <div className="input-group input-with-label">
                        <input valueLink={this.linkState('oldPassword')} type="password" className="form-control" placeholder="Old Password" autoComplete="off" />
                        <span className="input-group-title">
                            Old Password
                        </span>
                        <i className="fa fa-times"></i>
                        <i className="fa fa-check"></i>
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group input-with-label">
                        <input valueLink={this.linkState('newPassword')} type="password" className="form-control" placeholder="New Password" autoComplete="off" />
                        <span className="input-group-title">
                            New Password
                        </span>
                        <i className="fa fa-times"></i>
                        <i className="fa fa-check"></i>
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group input-with-label">
                        <input valueLink={this.linkState('retype_newPassword')} type="password" className="form-control" placeholder="Re-type New password" autoComplete="off" />
                        <span className="input-group-title">
                            Re-type New Password
                        </span>
                        <i className="fa fa-times"></i>
                        <i className="fa fa-check"></i>
                    </div>
                </div>
            </form>
        );
    },

    _onSaveProfile: function () {
        var values = _.clone(this.state);

        if (values.newPassword) {
            if (values.newPassword !== values.retype_newPassword) {
                Actions.okpAlert({body:'The new password fields do not match.'});
                return;
            }

            if (!values.oldPassword) {
                Actions.okpAlert({body:'Please provide your existing password in the "old password" field'});
                return;
            }

            delete values.retype_newPassword;

            this.props.user.set(values);
            Backbone.history.navigate('/account', {trigger: true});
        }
    }
})

module.exports = ChangePassword;
