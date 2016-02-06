var React = require('react');
var Actions = require('./actions/Actions');
var Store = require('./stores/Store');
var UserModel = require('./models/UserModel');
var Meeting = require('./models/MeetingModel');
var meetingStates = require('./utils/MeetingConstants.json');

// register views
var registerViews = {};
registerViews.step2 = require('./views/register/Register2.jsx');
registerViews.verify = require('./views/register/RegisterVerify.jsx');

// register finish views
var registerFinishViews = {};
registerFinishViews.payment = require('./views/register/RegisterPayment.jsx');
registerFinishViews.bio = require('./views/register/RegisterBio.jsx');

function parseQuery(qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

var router = Backbone.Router.extend({
    routes: {
        '': 'landing',
        'validator': 'validator',
        'register/:step': 'register',
        'register/:step/:type': 'register',
        'register-finish/:step': 'registerFinish',
        'login': 'login',
        'logout': 'logout',
        'signup/:type': 'signup',
        'account': 'profileEdit',
        'account/:section': 'profileEdit',
        'users/:userName': 'userProfile',
        'users/:userName/quickstart': 'quickStart',
        'schedule': 'schedule',
        'schedule/:page': 'schedule',
        'history': 'schedule',
        'meetings': 'schedule',
        'meetings/:id': 'meeting',
        'about': 'about',
        'terms': 'terms',
        'privacy': 'privacy',
        '*all': 'notFound'
    },
    initialize: function (options) {
        // set current user
        // Store.getCurrentUser() = options.currentUser;

        // TODO: remove before deploy
        window.currentUser = Store.getCurrentUser();
    },
    notFound: function () {
        // TODO: make nice 404 page
        this.navigate('/', { trigger: true });
    },
    about: function () {
        var view = require('./views/About.jsx');
        Actions.setUI('loggedIn', view);
    },
    validator: function (qString) {
        var keyVal = qString.split('=');
        var data = {};
        data.token = keyVal[1];

        $.ajax({
            url: apiBaseUrl + '/validator',
            type: 'POST',
            data: data
        })
        .done(function () {
            Backbone.history.navigate('/login', true);
        }.bind(this));
    },
    login: function () {
        var view = require('./views/Login.jsx');
        var data = { user: Store.getCurrentUser() };
        Actions.setUI('register', view, data);
    },
    logout: function () {
        $.ajax({
            url: apiBaseUrl + '/api/logout'
        })
        .done(function () {
            window.location.href= '/';
        });
    },
    schedule: function () {
        var data = { user: Store.getCurrentUser() };
        var view = require('./views/schedule/ScheduleBase.jsx');
        Actions.setUI('loggedIn', view, data);
    },
    roomLocked: function () {
        Actions.setUI('loggedIn');
        $('#content').html('<div class="container mt40"><h4>Sorry this room is locked</h4></div>');
    },
    meeting: function (meetingId, queryStr) {
        var self = this;
        var partnerId;
        var userIsListener = Store.getCurrentUser().isListener();
        var partnerRole = userIsListener ? 'presenter' : 'listener';
        var mtgCollection = new Backbone.Collection(Store.getCurrentUser().get('meetings'));
        
        if (queryStr && userIsListener) {
            // check if queryStr has right email to render active meeting
            var listener = parseQuery(queryStr).guest;
            Store.getCurrentUser().checkMtgListener(listener, meetingId)
            .done(function (mtg) {
                // email in queryStr was correct
                mtg = Meeting.prototype.parse(mtg);
                if (mtg.prompts[0] && mtg.prompts[0].answer) {
                    // listener has already submitted feedback
                    return self.roomLocked();
                }
                Store.getCurrentUser().set({ email: listener });
                renderValid.call(self, mtg.presenter.username, mtg);
            })
            .fail(function () {
                // email in queryStr was incorrect
                Actions.checkListenerEmail({
                    successCB: renderValid.bind(this),
                    meetingId: meetingId
                });
            });
        } else if (Store.getCurrentUser().isNew()) {
            Actions.checkListenerEmail({
                successCB: renderValid.bind(this),
                meetingId: meetingId
            });
        } else {
            var selectedMtg = mtgCollection.get(meetingId);
            partnerId = selectedMtg && selectedMtg.get(partnerRole).username;
            var meeting = Store.getCurrentUser().getMeeting(meetingId);
            if (!mtgCollection.get(meetingId)) {
                return this.roomLocked();
            }
            renderValid.call(this, partnerId, meeting);
        }

        function renderValid (partnerId, meeting) {
            if (Store.getCurrentUser().isListener() && meeting.presenter.username) {
                var partnerModel = new UserModel({id: meeting.presenter.username});
                partnerModel.fetch()
                .done(partnerFetched.bind(this));
            } else {
                partnerFetched.call(this);
            }
            function partnerFetched(res) {
                res = res || {email: meeting.listener.email};
                Actions.setSelectedUser(res);

                // just in case state comes back as string.
                meeting.state = parseInt(meeting.state, 10);
                
                var now = new Date();
                now = now.getTime();
                // check if now is 60 min earlier than start time?
                var activateStream = now > (meeting.startTime - (1000 * 60 * 60));

                var data = { user: Store.getCurrentUser(), meeting: meeting };

                meeting.feedback = meeting.feedback || {};
                // meeting has ended and needs feedback
                if (meeting.state >= meetingStates.ENDED_NO_FEEDBACK && meeting.state < meetingStates.CANCELLED) {
                    var view = require('./views/meeting/FinishedMeeting.jsx');
                    Actions.setUI('loggedIn', view, data);
                    return;
                }
            }
        }
    },
    landing: function () {
        var view = require('./views/Landing.jsx');
        var data = { user: Store.getCurrentUser() };
        Actions.setUI('loggedIn', view, data);
    },
    register: function (step) {

        Store.getCurrentUser().set({ type: 1 });
        var view = registerViews[step];
        var data = { user: Store.getCurrentUser() };

        Actions.setUI('register', view, data);
    },
    registerFinish: function (step) {
        var view = registerFinishViews[step];
        var data = { user: Store.getCurrentUser() };
        Actions.setUI('loggedIn', view, data);

    },
    profileEdit: function (section) {
        if (section === 'schedule') {
            this.schedule();
            return;
        }

        var view = require('./views/profile_edit/ProfileEditBase.jsx');
        var data = { user: Store.getCurrentUser(), section: section };
        Actions.setUI('loggedIn', view, data);
    },
    userProfile: function (userName, queryStr) {
        var args = arguments;
        var currentUser = Store.getCurrentUser();
        
        if (!currentUser.fetched) {
            this.listenToOnce(currentUser, 'sync', function () {
                this.userProfile.apply(this, args);
            }.bind(this));
            return;
        }

        if (userName === currentUser.get('username')) {
            return this.quickStart(userName);
        }

        if (queryStr) {
            var guest = parseQuery(queryStr).guest;
            currentUser.set({ email: guest, type: 0 });
            return this.quickStart(userName, guest);
        }

        var searchedUser = new UserModel({id: userName});
        searchedUser.fetch()
        .done(function (res) {
            var view = require('./views/users/UserProfile.jsx');
            var data = { user: Store.getCurrentUser(), searchedUser: searchedUser };
            Actions.setUI('loggedIn', view, data);
            Actions.setSelectedUser(res);
        }.bind(this));
    },
    quickStart: function (userName, guest) {
        var self = this;
        var meeting;

        if (Store.getCurrentUser().isNew() || Store.getCurrentUser().isListener()) {
            var partnerModel = new UserModel({id: userName});
            partnerModel.fetch()
            .done(function (res) {
                Actions.setSelectedUser(res);
                meeting = res.currentSession;
                meeting.presenter = $.extend(true, {}, res);
                delete meeting.presenter.currentSession;
                if (guest.toLowerCase() === res.currentSession.email.toLowerCase()) {
                    if (!window.bc) {
                        self.listenToOnce(self, 'bc:ready', renderMtg);
                    } else {
                        renderMtg();
                    }
                } else {
                    // Confirm email
                    Actions.setConfirmQuickStartOptions({
                        self: self,
                        userName: res.userName,
                        renderMtg: renderMtg,
                        currentLead: res.currentSession.email
                    });
                }
            });
        } else {
            meeting = Store.getCurrentUser().get('currentSession');
            meeting.presenter = {
                id: Store.getCurrentUser().id
            };

            if (!window.bc) {
                this.listenToOnce(this, 'bc:ready', renderMtg);
            } else {
                renderMtg();
            }
        }

        function renderMtg() {
            var view = require('./views/meeting/QuickStart.jsx');
            var data = { user: Store.getCurrentUser(), meeting: meeting };
            Actions.setUI('loggedIn', view, data);
        }
    },
    terms: function () {
        var view = require('./views/Terms.jsx');
        Actions.setUI('loggedIn', view);

    },
    privacy: function () {
        var view = require('./views/Privacy.jsx');
        Actions.setUI('loggedIn', view);

    }
});

module.exports = router;
