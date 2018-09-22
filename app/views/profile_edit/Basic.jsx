'use strict';

let React = require('react/addons');
let _ = require('lodash');
let Store = require('../../stores/Store');
let Email = require('../../models/EmailModel');
let DeleteModal = require('./DeleteModal.jsx');

let PersonalBasic = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

    _getState() {
        let user = Store.getCurrentUser();
        let obj = user.toJSON();
        obj.markers = {};
        obj.user = user;
        if (obj.address) {
            _.extend(obj, obj.address);
            delete obj.address;
        }
        return obj;
    },
    _updateState() {
        this.setState(this._getState());
    },
    getInitialState() {
        return this._getState();
    },
    componentDidMount() {
        Store.addSetCurrentUserListener(this._updateState);
        Store.addSaveProfileListener(this._onSaveProfile);
    },
    componentWillUnmount() {
        Store.removeSetCurrentUserListener(this._updateState);
        Store.removeSaveProfileListener(this._onSaveProfile);
    },
    renderMessages() {
        let output = {};

        for (let name in this.state.errors) {
            output[name] = <div className="error-msg">{this.state.errors[name]}</div>;
        }
        return output;
    },
    render() {
    	let messages = this.renderMessages();
        let baseClass = 'no-padding';
        let sizeClass = ' col-xs-12';
        let firstNameClasses = baseClass + sizeClass + ' mb20';
        let lastNameClasses = baseClass + sizeClass;

        if (this.state.user.id) {
            let sizeClass = ' col-xs-6 ';
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
    renderDangerZone() {
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
    renderUnchangeableInputs() {
        let messages = this.renderMessages();


        return (
            <div className="form-group">
                <div className={'input-group input-with-label ' + this.state.markers.email}>
                    <input onKeyUp={this._removeMarker} id="email" valueLink={this.linkState('email')} onFocus={this.removeError} type="email" name="email" className={'form-control ' + (this.state.markers.email || '')} placeholder="Email"/>
                    <span className="input-group-title">
                        Email
                    </span>
                    <i className="fa fa-times"></i>
                    <i className="fa fa-check"></i>
                    {messages.email}
                </div>
            </div>
        );

    },
    renderPasswordInputs() {
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
    renderAddressInputs() {
        if (this.state.user.id) {
        	return (
        		<div>
    	    		<div className="form-group">
    		            <div className={'input-group input-with-label ' + this.state.markers.line1}>
    		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('line1')} type="text" name="line1" className="form-control" placeholder="Address Line 1"/>
                            <span className="input-group-title">
                                Address Line 1
                            </span>
                            <i className="fa fa-times"></i>
    		                <i className="fa fa-check"></i>
    		            </div>
    		        </div>
    		        <div className="form-group">
    		            <div className={'input-group input-with-label ' + this.state.markers.line2}>
    		                <input onKeyUp={this._removeMarker} valueLink={this.linkState('line2')} type="text" name="line2" className="form-control" placeholder="Address Line 2"/>
                            <span className="input-group-title">
                                Address Line 2
                            </span>
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
    removeError(e) {
    	let attr = $(e.currentTarget).attr('name');
    	let markers = this.state.markers;
    	delete markers[attr];

    	this.setState({ markers: markers });
    },
    _onSaveProfile() {
		let markers = {};
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
       	let attrsToDelete = ['line1','line2','city','state','postal_code','markers','errors', 'user'];
       	attrsToDelete.forEach(attr => {
       		delete values[attr];
       	});
    	this.state.user.set(values);

    	if (!this.state.user.isValid()) {
    		for (let key in this.state.user.validationError) {
    			markers[key] = 'has-error';
    		}
        }
        this.setState({ markers: markers });
    },
    _removeMarker(e) {
    	let attr = $(e.currentTarget).attr('name');
        let markers = this.state.markers;
        markers[attr] = '';
        this.setState({ markers: markers });
    }
});

module.exports = PersonalBasic;
