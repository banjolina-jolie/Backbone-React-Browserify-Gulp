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
    renderPartnerInfo: require('../meeting/RenderPartnerInfo.jsx')
});

module.exports = UserProfileView;
