var React = require('react/addons');
var _ = require('lodash');
var Store = require('../../stores/Store');
var Email = require('../../models/EmailModel');
var DeleteModal = require('./DeleteModal.jsx');

var PersonalBasic = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

    _getState: function () {
        var user = Store.getCurrentUser();
        var obj = user.toJSON();
        obj.markers = {};
        obj.user = user;
        return obj;
    },
    _updateState: function () {
        this.setState(this._getState());
    },
    getInitialState: function () {
        return this._getState();
    },
    componentDidMount: function () {
        Store.addSetCurrentUserListener(this._updateState);
        Store.addSaveProfileListener(this._onSaveProfile);
    },
    componentWillUnmount: function () {
        Store.removeSetCurrentUserListener(this._updateState);
        Store.removeSaveProfileListener(this._onSaveProfile);
    },
    renderMessages: function () {
        var output = {};

        for(var name in this.state.errors) {
            output[name] = <div className="error-msg">{this.state.errors[name]}</div>;
        }
        return output;
    },
    render: function () {
    	var messages = this.renderMessages();
        var baseClass = 'no-padding';
        var sizeClass = ' col-xs-12';
        var firstNameClasses = baseClass + sizeClass + ' mb20';
        var lastNameClasses = baseClass + sizeClass;

        if (this.state.user.id) {
            var sizeClass = ' col-xs-6 ';
            firstNameClasses = baseClass + sizeClass + 'pr10';
            lastNameClasses = baseClass + sizeClass + 'pl10';
        }

        return (
		    <form className="basic-form with-border">
		        <div className="form-group inline row">
		            <div className={firstNameClasses}>
		                <div className={'input-group input-with-label ' + this.state.markers.name}>
		                    <input onKeyUp={this._removeMarker} valueLink={this.linkState('first_name')} type="text" className="form-control" name="name" placeholder="First Name"/>
		                    <span className="input-group-title">
		                        First Name
		                    </span>
			                <i className="fa fa-times"></i>
		                </div>
		            </div>
		            <div className={lastNameClasses}>
		                <div className={'input-group input-with-label ' + this.state.markers.surname}>
		                    <input onKeyUp={this._removeMarker} valueLink={this.linkState('last_name')} type="text" className="form-control" name="surname" placeholder="Last Name"/>
		                    <span className="input-group-title ml10">
		                        Last Name
		                    </span>
			                <i className="fa fa-times"></i>
		                </div>
		            </div>
		        </div>

	        	{ 
                    this.renderUnchangeableInputs()
                }

		        { this.renderPasswordInputs() }

		        { this.renderAddressInputs() }

				<div className="mb20"> { this.renderDangerZone() } </div>
		        
		        <DeleteModal user={this.state.user}/>
		    </form>
        );
    },
    renderDangerZone: function () {
        if (!this.state.user.isNew()) {
            return (
                <div className="dropdown">
                    <button className="btn btn-default dropdown-toggle danger-dropdown-toggle fr p0" type="button" id="dangerZoneDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        danger zone
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu danger-dropdown" aria-labelledby="dangerZoneDropdown">
                        {/*<li><a data-toggle="modal" data-target="#deleteModal">Delete Account</a></li>*/}
                        <li><a href="/account/change-password">Change Password</a></li>
                    </ul>
                </div>
            );
        }
    },
    renderUnchangeableInputs: function () {
        var disableEmail = this.state.user.get('email') ? 'disabled' : null;
        var messages = this.renderMessages();
        

        if (this.state.user.isNew()) {
            return (
                <div className="form-group">
                    <div className={'input-group input-with-label ' + this.state.markers.email}>
                        <input disabled={disableEmail} onKeyUp={this._removeMarker} id="email" valueLink={this.linkState('email')} onFocus={this.removeError} type="email" name="email" className={'form-control ' + (this.state.markers.email || '')} placeholder="Email"/>
                        <i className="fa fa-times"></i>
                        <i className="fa fa-check"></i>
                    {messages.email}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="unchangeables">
                    <div className="row">
                        <div className="col-xs-12 no-padding">
                            <div className="form-group">{this.state.email}</div>
                        </div>
                    </div>
                </div>
            );
        }
    },
    renderPasswordInputs: function () {
        if (this.state.user.isNew()) {
            return (
                <div>
                    <div className="form-group">
                        <div className={'input-group input-with-label ' + this.state.markers.password}>
                            <input onKeyUp={this._removeMarker} valueLink={this.linkState('password')} type="password" className="form-control" name="password" placeholder="Password" autoComplete="off" />
                            <span className="input-group-title">
                                Password
                            </span>
                            <i className="fa fa-times"></i>
                            <i className="fa fa-check"></i>
                        </div>
                    </div>
                    {/*<div className="form-group">
                        <div className={'input-group input-with-label ' + this.state.markers.reEnterPassword}>
                            <input onKeyUp={this._removeMarker} valueLink={this.linkState('reEnterPassword')} type="password" id="" className="form-control" name="reEnterPassword" placeholder="Re-enter Password"/>
                            <span className="input-group-title">
                                Re-enter Password
                            </span>
                            <i className="fa fa-times"></i>
                            <i className="fa fa-check"></i>
                        </div>
                    </div>*/}
                </div>
            );
        }
    },
    renderAddressInputs: function () {
        if (this.state.user.id) {
        	return (
        		<div>
    	    		<div className="form-group">
    		            <div className={'input-group input-with-label ' + this.state.markers.line1}>
    		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('line1')} type="text" name="line1" className="form-control" placeholder="Address Line 1"/>
    		                <i className="fa fa-times"></i>
    		                <i className="fa fa-check"></i>
    		            </div>
    		        </div>
    		        <div className="form-group">
    		            <div className={'input-group input-with-label ' + this.state.markers.line2}>
    		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('line2')} type="text" name="line2" className="form-control" placeholder="Address Line 2"/>
    		                <i className="fa fa-times"></i>
    		                <i className="fa fa-check"></i>
    		            </div>
    		        </div>
    		        <div className="row">
    			        <div className="form-group col-xs-6 no-padding">
    			            <div className={'input-group input-with-label ' + this.state.markers.city}>
    			                <input onKeyUp={this._removeMarker} valueLink={this.linkState('city')} type="text" name="city" className="form-control" placeholder="City"/>
    			                <span className="input-group-title">
    			                    City
    			                </span>
    			                <i className="fa fa-times"></i>
    			                <i className="fa fa-check"></i>
    			            </div>
    			        </div>
    			        <div className="form-group col-xs-3 ps20">
    			            <div className={'input-group input-with-label ' + this.state.markers.state}>
    			                <input onKeyUp={this._removeMarker} valueLink={this.linkState('state')} type="text" name="state" className="form-control" placeholder="State" maxLength="2" />
    			                <span className="input-group-title">
    			                    State
    			                </span>
    			                <i className="fa fa-times"></i>
    			                <i className="fa fa-check"></i>
    			            </div>
    			        </div>
    			        <div className="form-group col-xs-3 no-padding">
    			            <div className={'input-group input-with-label ' + this.state.markers.postal_code}>
    			                <input onKeyUp={this._removeMarker} valueLink={this.linkState('postal_code')} type="text" name="postal_code" className="form-control" placeholder="Zip"/>
    			                <span className="input-group-title">
    			                    Zip Code
    			                </span>
    			                <i className="fa fa-times"></i>
    			                <i className="fa fa-check"></i>
    			            </div>
    			        </div>
    	        	</div>
        		</div>
    		);
        }
    },
    removeError: function (e) {
    	var attr = $(e.currentTarget).attr('name');
    	var markers = this.state.markers;
    	delete markers[attr];

    	this.setState({ markers: markers });
    },
    _onSaveProfile: function () {
		var markers = {};
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
        }

        values.address = {
        	line1: values.line1,
        	line2: values.line2,
        	city: values.city,
        	state: values.state,
        	postal_code: values.postal_code
        };

        // delete stuff from values
        // TODO: MAKE BETTER
       	var attrsToDelete = ['line1','line2','city','state','postal_code','markers','errors', 'user'];
       	attrsToDelete.forEach(function (attr) {
       		delete values[attr];
       	});

    	this.state.user.set(values);

    	if (!this.state.user.isValid()) {
    		for (var key in this.state.user.validationError) {
    			markers[key] = 'has-error';
    		}
        }
        this.setState({ markers: markers });
    },
    _removeMarker: function (e) {
    	var attr = $(e.currentTarget).attr('name');
        var markers = this.state.markers;
        markers[attr] = '';
        this.setState({ markers: markers });
    }
});

module.exports = PersonalBasic;
