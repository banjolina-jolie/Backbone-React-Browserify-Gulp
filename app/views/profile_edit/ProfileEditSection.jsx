'use strict';

let React = require('react');
let Actions = require('../../actions/Actions');
let Store = require('../../stores/Store');

let Basic = require('./Basic.jsx');
let Bio = require('./Bio.jsx');
let ChangePassword = require('./ChangePassword.jsx');


let PaymentList = require('./PaymentList.jsx');

let profileEditConfig = {
    personal: {
    	basic: { view: Basic, title: 'Basic'},
    	bio: { view: Bio, title: 'Bio & Photo'},
        'change-password': { view: ChangePassword }
    },
    payments: {
        payments: { view: PaymentList, title: 'Payment Info'}
    }
};

let ProfileEditSections = React.createClass({
    componentDidMount() {
        $('#save-profile-edit').toggleClass('hidden', this.props.secondary === 'payments');
    },
    componentDidUpdate(prevProps, prevState) {
        $('#save-profile-edit').toggleClass('hidden', this.props.secondary === 'payments');
    },
    getSecondaryView() {
    	let secondaries = profileEditConfig[this.props.primary];
        return secondaries[this.props.secondary].view;
    },
    renderSecondary() {
        return (
            <div>
                { React.createElement(this.getSecondaryView()) }

                <button onClick={this.saveProfile} id="save-profile-edit" className="btn btn-default btn-solid btn-blue mb40">Save</button>
            </div>
        );
    },
    render() {
        var SecondaryView = this.getSecondaryView();
        let secondaries = $.extend(true, {}, profileEditConfig[this.props.primary]);
        delete secondaries['change-password'];

        if (Object.keys(secondaries).length > 1) {
            return (
                <div className="with-titles">
                    <ul className="profile-edit-secondary-header m0">
                        <div className="row m0">
                            {_.map(secondaries, (obj, key) => {
                                let classes = 'tab-link';
                                if (key === this.props.secondary) {
                                    classes += ' selected';
                                }
                                return (
                                    <li key={key} className="col-xs-6 no-padding">
                                        <a className={classes} href={'/account/' + key}>{obj.title}</a>
                                    </li>
                                );
                            })}
                        </div>
                    </ul>

                    <SecondaryView />

                    <button onClick={this.triggerSet} id="save-profile-edit" className="btn btn-default btn-solid btn-blue mb40">Save</button>
                </div>
            );
        } else {
        	return (
    	    	<div className="no-titles">

                    <SecondaryView />

                    <button onClick={this.triggerSet} id="save-profile-edit" className="btn btn-default btn-solid btn-blue mb40">Save</button>
    	        </div>
    		);
        }

	},
    triggerSet(e) {
        window.Store = Store;
        e.preventDefault();
        let user = Store.getCurrentUser();
        user.off('change', this.save);
        user.once('change', this.save);
        Actions.saveProfile();
    },
    save() {
        let user = Store.getCurrentUser();

        if (this.props.secondary !== 'payments') {
            if (!user.validationError) {
                Actions.startLoading();
        	    user.save()
                .done(_ => {
                    Actions.appAlert({body: 'Changes Saved'});
                    Actions.stopLoading();
                });
            }
        }
	}
});

module.exports = ProfileEditSections;
