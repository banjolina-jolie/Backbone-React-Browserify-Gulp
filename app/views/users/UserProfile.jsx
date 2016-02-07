var React = require('react/addons');
var Actions = require('../../actions/Actions');
var EmailModel = require('../../models/EmailModel');
var vsBinding = require('../../utils/vsBinding');

var UserProfileView = React.createClass({
    getInitialState: function () {      
        return {};        
    },
    componentDidMount: function () {
        $('[data-toggle="tooltip"]').tooltip();
    },
    render: function () {
    	var user = this.props.searchedUser.toJSON();

        return (
        	<div>
	            <section className="container user-profile">
                    <div className="row">
                        <div className="col-xs-7 no-padding">

                            { this.renderPartnerInfo(user) }

                            <div className="profile-text mt40">
                                { this.renderTextWithLines(user.meta.bio) }
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        );
    },
    renderTextWithLines: function (text) {
        text = text || '';
        var lines = text.split('\n');
        return lines.map(function (line) {
            return (<div className="text-line">{line}</div>);
        });
    },
    renderPartnerInfo: function (meetingPartner) {
        meetingPartner = meetingPartner || {};
        if (meetingPartner.meta) {
            meetingPartner.city = meetingPartner.meta.address.city
            meetingPartner.state = meetingPartner.meta.address.state
            meetingPartner.employer = meetingPartner.meta.employer;
            meetingPartner.jobTitle = meetingPartner.meta.jobTitle;
        }
        if (!meetingPartner.meta) {
            return (
                <h3 className="row partner-info fwnormal">
                    {meetingPartner.email}
                    <span title={this.state.partnerStatus} className={'partner-status non-member ' + this.state.partnerStatus}></span>
                </h3>
            );
        }
        return (
            <div className="row partner-info">
                <div className="col-xs-4 col-xs-4 no-padding">
                    <div className="user-profile-image">
                        <div className="profile-icon clearfix">
                            <div id="profile-img" className="icon-preview" style={{backgroundImage: 'url(https://s3.amazonaws.com/okprecious/' + meetingPartner.id + '/profile_pic)'}}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-8 col-xs-8 no-padding">
                    <a href={'/users/' + meetingPartner.username} className="profile-name">{meetingPartner.name} {meetingPartner.surname}</a>
                    <span className="username ml6">{meetingPartner.username}</span>
                    <span title={this.state.partnerStatus} className={'partner-status ' + this.state.partnerStatus}></span>
                    <div className="profile-attrs">
                        <div className=" attr prof">
                            <span className="icon">
                                <i className="fa fa-user"></i>
                            </span>
                            {meetingPartner.employer}
                        </div>
                        <div className="attr">
                            <span className="icon">
                                <i className="fa fa-briefcase"></i>
                            </span>
                            <span className="employer">{meetingPartner.jobTitle}</span>
                        </div>
                        <div className="attr location">
                            <span className="icon">
                                <i className="fa fa-map-marker"></i>
                            </span>
                            {meetingPartner.city}, {meetingPartner.state}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = UserProfileView;
