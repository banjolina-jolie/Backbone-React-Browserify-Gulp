var React = require('react/addons');
var View = require('./MeetingsList.jsx');

var ScheduleBase = React.createClass({

    render: function () {
        return (
            <div className="container schedule-base">
                <div className="row mb20">
                    <h2 className="">History</h2>
                </div>

                <div className="schedule-body-container">
                    <View user={this.props.user} profileEdit={true} />
                </div>
            </div>
        );
	}
});

module.exports = ScheduleBase;
