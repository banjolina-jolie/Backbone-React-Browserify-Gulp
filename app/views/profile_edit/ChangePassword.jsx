'use strict';

let React = require('react/addons');
let Store = require('../../stores/Store');

let ChangePassword = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        Store.addSaveProfileListener(this._onSaveProfile);
    },

    componentWillUnmount() {
        Store.removeSaveProfileListener(this._onSaveProfile);
    },

    getInitialState() {
        return {};
    },

    render() {
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

    _onSaveProfile() {
        let values = _.clone(this.state);

        if (values.newPassword) {
            if (values.newPassword !== values.retype_newPassword) {
                Actions.appAlert({body:'The new password fields do not match.'});
                return;
            }

            if (!values.oldPassword) {
                Actions.appAlert({body:'Please provide your existing password in the "old password" field'});
                return;
            }

            delete values.retype_newPassword;

            Store.getCurrentUser().set(values);
            Backbone.history.navigate('/account', {trigger: true});
        }
    }
})

module.exports = ChangePassword;
