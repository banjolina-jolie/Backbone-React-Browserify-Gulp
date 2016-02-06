var Backbone = require('backbone');
var meetingStatusMap = require('../utils/MeetingStatusMap.json');
var meetingStates = require('../utils/MeetingConstants.json');

var model = Backbone.Model.extend({
    defaults: {
        googleEventId: null,
        streamType: 'webcam-sd',
        activityLog: {},
        listener_archive: false,
        presenter_archive: false
    },
    urlRoot: function () {
        var Store = require('../stores/Store');
        var currentUser = Store.getCurrentUser();
		return currentUser.isNew() ? apiBaseUrl + '/meetings' : apiBaseUrl + '/api/meetings';
	},
	parse: function (res) {
		if (res._id) {
			res.id = res._id;
			delete res._id;
		}
		if (res.startTime) {
            res.startTime = Number(res.startTime) * 1000;
		} else {
            res.startTime = 0;
        }
		res.state = parseInt(res.state, 10);
		res.rate = parseFloat(res.rate, 10);
		res.duration = parseInt(res.duration, 10);

		var now = new Date().getTime();
        var today = moment(now).format('MMM Do');
        var endTime = res.startTime + (res.duration * 1000);
        var startDay = moment(res.startTime).format('MMM Do');

        if (res.startTime) {
            res.formattedStartTime = today === startDay ? 'Today - ' + moment(res.startTime).format('h:mma') : moment(res.startTime).format('MMM Do - h:mma');
        } else {
            res.formattedStartTime = 'Not yet chosen';
        }
        
        res.displayState = meetingStatusMap[res.state];

        if ((res.state === meetingStates.PENDING_ON_LISTENER_CONFIRM && res.userIsListener) ||
            (res.state === meetingStates.PENDING_ON_PRESENTER_CONFIRM && !res.userIsListener)) {
            res.displayState = 'Awaiting your reply';
        }
        if ((res.state === meetingStates.PENDING_ON_LISTENER_CONFIRM || res.state === meetingStates.PENDING_ON_PRESENTER_CONFIRM) && res.startTime && now > res.startTime) {
            res.displayState = 'Invitation Expired';
        }
        if (now > res.startTime && now < endTime && (res.state === meetingStates.ONGOING || res.state === meetingStates.PLANNED)) {
            res.displayState = 'Active';
        }
        if (res.state === meetingStates.PLANNED && now > endTime) {
            res.displayState = 'Meeting Never Started';
            res.state = 0;
        }
        // Listener has not given feedback
        if (res.state === meetingStates.ENDED_NO_FEEDBACK) {
            if (res.userIsListener) {
                res.displayState = 'Feedback received';
            } else {
                res.displayState = 'Awaiting partner\'s feedback';
            }
        }

        // Listener has given feedback but presenter has not
        if (res.state > meetingStates.ENDED_NO_FEEDBACK && !res.presenter_feedback) {
            if (res.userIsListener) {
                res.displayState = 'Awaiting partner\'s feedback';
            } else {
                res.displayState = 'Feedback received';
            }
        }

		return res;
	},
	save: function (props) {
        props = $.extend(true, {}, props);

        if (!isNaN(props.startTime)) {
            props.startTime = Math.floor(props.startTime / 1000);
        }
        var startTime = Math.floor(this.get('startTime') / 1000);
		this.set({ startTime: startTime });
        

        var Store = require('../stores/Store');
        var currentUser = Store.getCurrentUser();
        
        // special save for non-auth'd user
        if (currentUser.isNew()) {
            this.set(props);
            return currentUser.noAuthSaveMtg(this);
        }
        
        return Backbone.Model.prototype.save.apply(this, arguments);
	},
	logActivity: function (now, action) {
		var data = {
			timestamp: now,
			action: action
		};

		return $.ajax({
			url: apiBaseUrl + '/api/meetings/logActivity/' + this.id,
			method: 'POST',
			data: data
		});
	}
});

module.exports = model;
