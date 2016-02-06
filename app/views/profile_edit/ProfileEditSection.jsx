var React = require('react');
var Actions = require('../../actions/Actions');

var Basic = require('./Basic.jsx');
var Bio = require('./Bio.jsx');
var ChangePassword = require('./ChangePassword.jsx');

var Experience = require('./Experience.jsx');

var PaymentList = require('./PaymentList.jsx');

var profileEditConfig = {
    personal: {
    	basic: { view: Basic, title: 'Basic'},
    	bio: { view: Bio, title: 'Bio & Photo'},
        'change-password': { view: ChangePassword }
    },
    experience: {
    	experience: { view: Experience }
    },
    payments: {
        payments: { view: PaymentList, title: 'Payment Info'}
    }
};

var ProfileEditSections = React.createClass({
    componentDidMount: function () {
        $('#save-profile-edit').toggleClass('hidden', this.props.secondary === 'payments');
    },
    componentDidUpdate: function (prevProps, prevState) {
        $('#save-profile-edit').toggleClass('hidden', this.props.secondary === 'payments');
    },
    getSecondaryView: function () {
    	var secondaries = profileEditConfig[this.props.primary];

        return secondaries[this.props.secondary].view;
    },
    renderSecondary: function () {
        return (
            <div>
                { React.createElement(this.getSecondaryView(), { user: this.props.user, profileEdit: true }) }

                <button onClick={this.saveProfile} id="save-profile-edit" className="btn btn-default btn-solid btn-blue mb40">Save</button>
            </div>
        );
    },
    render: function () {
        var secondaries = $.extend(true, {}, profileEditConfig[this.props.primary]);
        delete secondaries['change-password'];

        if (Object.keys(secondaries).length > 1) {
            return (
                <div className="with-titles">
                    <ul className="profile-edit-secondary-header m0">
                        <div className="row m0">
                            {_.map(secondaries, function (obj, key) {
                                var classes = 'tab-link';
                                if (key === this.props.secondary) {
                                    classes += ' selected';
                                }
                                return (
                                    <li key={key} className="col-xs-6 no-padding">
                                        <a className={classes} href={'/account/' + key}>{obj.title}</a>
                                    </li>
                                );
                            }.bind(this))}
                        </div>
                    </ul>

                    { React.createElement(this.getSecondaryView(), { user: this.props.user, profileEdit: true }) }

                    <button onClick={this.saveProfile} id="save-profile-edit" className="btn btn-default btn-solid btn-blue mb40">Save</button>
                </div>


            );
        } else {
        	return (
    	    	<div className="no-titles">
    	            { React.createElement(this.getSecondaryView(), { user: this.props.user, profileEdit: true }) }

                    <button onClick={this.saveProfile} id="save-profile-edit" className="btn btn-default btn-solid btn-blue mb40">Save</button>
    	        </div>
    		);
        }

	},
	saveProfile: function (e) {
        e.preventDefault();
        
        Actions.saveProfile();

        if (this.props.secondary !== 'payments') {
            // wait for set to be done
            setTimeout(function() {
                if (!this.props.user.validationError) {
                    Actions.startLoading();
            	    this.props.user.save()
                    .done(function () {
                        Actions.okpAlert({body: 'Changes Saved'});
                        Actions.stopLoading();
                    });
                }
            }.bind(this), 50);
        }
	}
});

module.exports = ProfileEditSections;
