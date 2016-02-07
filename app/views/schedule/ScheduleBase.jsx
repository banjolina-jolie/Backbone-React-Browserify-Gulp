var React = require('react/addons');
var View = require('./EventsList.jsx');

var ScheduleBase = React.createClass({

    render: function () {
        return (
            <div className="container schedule-base">
                <div className="schedule-body-container">
                    <View user={this.props.user} profileEdit={true} />
                </div>
            </div>
        );
	}
});

module.exports = ScheduleBase;
