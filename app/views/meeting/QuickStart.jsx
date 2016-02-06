var React = require('react/addons');
var Store = require('../../stores/Store');
var $ = require('jquery');
var EmailModel = require('../../models/EmailModel');
var Messages = require('./Messages.jsx');
var Actions = require('../../actions/Actions');
var activeMeetingMethods = require('../../utils/ActiveMeetingMethods.jsx');
var vsBinding = require('../../utils/vsBinding');
var meetingStates = require('../../utils/MeetingConstants.json');

var viewOptions = {
    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function () {
        this.room = this.props.room;
        this.members = this.props.members;
        var session = this.props.user.get('currentSession');
        var leadEmail = session.email;
        var leadName = session.name;
        var leadCompany = session.company;
        var conference = require('../../utils/conference.jsx');
        var feedbackPrompts = this.props.user.get('feedbackPrompts');

        return {
            status: bc.connected ? 'Start Stream' : 'Loading...',
            conferenceObj: conference(this),
            partnerStatus: !this.members ? 'none' : this.members.length >= 1 ? 'connected' : 'not-connected',
            streamType: 'webcam-sd',
            leadEmail: leadEmail,
            leadName: leadName,
            leadCompany: leadCompany,
            newSession: !leadEmail,
            activeMeeting: session.state === 1,
            feedbackPrompts: feedbackPrompts
        };
    },
    componentDidUpdate: function (prevProps, prevState) {
        Actions.stopLoading();

        $('.prompt-type').off();
        $('.prompt-type').on('change', this._promptTypeChanged);
        
        $('select').select2({
            minimumResultsForSearch: -1
        });

        $('[data-toggle="tooltip"]').tooltip('destroy');
        $('[data-toggle="tooltip"]').tooltip();
    },
    componentDidMount: function () {
        var self = this;
        $('footer').addClass('hidden');
        Store.addupdateCurrentMtgListener(this._updateMtg);

        setTimeout(function () {
            self.state.conferenceObj.setActiveMtgEventHandlers(self);
        }, 200);
        
        // clear jQuery listeners
        $('.pane').off();
        $('.messages-container').off();

        // set listeners
        $('.pane').on('click', this.expandDiv.bind(this));
        $('.screen-share-pane').on('click', this.expandDiv.bind(this));
        $('.messages-container').on('click', this.expandDiv.bind(this));


        $('select').select2();
        $('[data-toggle="tooltip"]').tooltip();

        // if user was already connected start stream
        if (bc.connected) {
            this.startLocalStream();
        }

        Actions.stopLoading();
    },
    componentWillUnmount: function () {
        Store.removeupdateCurrentMtgListener(this._updateMtg);
        this.quitRoom();
        $('footer').removeClass('hidden');
    },
    render: function () {        
        return (
            <div className="meeting active-meeting">
                <div className="container">

                    { this.renderNoLead() }

                    { this.renderWithLead() }
                                        
                    <div className="row mb20">

                        { this.renderIcons() }

                    </div>
                </div>
                <div className="container relative">
                        
                        <div id="video_container_1" className="pane pane-1"></div>
                        <div id="video_container_2" className="pane pane-2"></div>
                        <div id="screen_share" className="screen-share-pane"></div>

                        <Messages user={this.props.user} meeting={this.props.meeting} activeMeeting={true} conferenceObj={this.state.conferenceObj} />
                    
                </div>
            </div>
        );
    },
    renderNoLead: function () {
        if (this.state.newSession && this.props.user.isPresenter()) {
            return (
                <div className="row">
                    <h4>Enter {'lead\'s'} info and click "Save"</h4>
                    <div className="w90p no-padding dib">
                        { this.renderSessionInputs() }
                    </div>
                    <button disabled={!this.state.sessionChanged} onClick={this._saveNewSession} className="btn btn-outline btn-small btn-green next-meeting-btn fr save-new-lead">Save</button>
                </div>
            );
        } else if (this.props.user.isListener()) {
            return (
                <div className="row">
                    { this.renderPartnerInfo() }
                </div>
            );
        }
    },
    renderSharedLink: function () {
        if (this.state.partnerStatus === 'connected') { return; }

        var username = this.props.user.get('username');
        var leadEmail = this.state.leadEmail;
        var sharedLink = leadEmail ? 'https://okpitch.com/users/' + username + '?guest=' + leadEmail : 'Enter your lead\'s email to generate link';
        return (
            <div className="mb10 col-xs-9 no-padding">
                <label className="">Invite lead to:</label>
                <div>
                    <i>{sharedLink}</i>
                </div>
            </div>
        );
    },
    renderWithLead: function () {
        if (!this.state.newSession && this.props.user.isPresenter()) {
            var self = this;
            var username = this.props.user.get('username');
            var leadEmail = this.state.leadEmail;
            var sharedLink = leadEmail ? 'https://okpitch.com/users/' + username + '?guest=' + leadEmail : 'Enter your lead\'s email to generate link';

            return (
                <div className="row">

                    { this.renderStartStop() }

                    { this.renderSharedLink() }
                    
                    { this.renderPartnerInfo() }
                    
                    <label className="col-xs-12 no-padding">
                        <a onClick={this._toggleCurrentSessionForm} className="ttn session-details fwnormal">
                            <span className="session-details-text">Session details</span>
                            <i className="ml4 glyphicon glyphicon-triangle-bottom"></i>
                        </a>
                    </label>

                    <div className="next-meeting hidden feedback-prompts">
                        <label>{'Lead\'s info'}</label>
                        
                        { this.renderSessionInputs() }
                        
                        <label>Feedback prompts</label>
                        {this.state.feedbackPrompts.map(function (prompt, idx) {
                            return (
                                <div key={'edit-prompt' + idx} className="mt6 edit-prompt">
                                    <input type="checkbox" checked={prompt.checked} onChange={self._promptChanged} data-idx={idx} data-toggle="tooltip" title="include"/>
                                    <input className="ml6 form-control form-control-small" onChange={self._promptTextChange} data-idx={idx} value={prompt.text}/>
                                    <select value={prompt.type} className="prompt-type" data-idx={idx}>
                                        <option val="text">text</option>
                                        <option val="yes/no">yes/no</option>
                                        <option val="rate 1-5">rate 1-5</option>
                                        <option val="rate 1-10">rate 1-10</option>
                                    </select>
                                    <span className="ml6 sorting-arrows">
                                        <i onClick={self._reorderPrompt(1)} data-idx={idx} className="glyphicon glyphicon-triangle-top" data-toggle="tooltip" title="move up"></i>
                                        <i onClick={self._reorderPrompt(-1)} data-idx={idx} className="glyphicon glyphicon-triangle-bottom" data-toggle="tooltip" title="move down"></i>
                                    </span>
                                    <span data-idx={idx} onClick={self._removePrompt} className="ml6 glyphicon glyphicon-remove" data-toggle="tooltip" title="remove"></span>
                                </div>
                            );
                        })}
                        <label><a onClick={this._addPrompt} className="mt20 block ttn">+ Add prompt</a></label>
                        <div>
                            <button disabled={!this.state.sessionChanged} onClick={this._saveCurrentSession} className="btn btn-outline btn-small btn-green next-meeting-btn fr mr20 ml10">Save Changes</button>
                            <button onClick={this._cancelChanges} className="btn btn-outline btn-small btn-grey next-meeting-btn fr">Cancel</button>
                        </div>
                    </div>
                </div>
            );
        }
    },
    renderSessionInputs: function () {
        return (
            <div className="row mb20">
                <div className="col-xs-4 no-padding pr20">
                    <div className="form-group m0">
                        <div className="input-group input-with-label email-container">
                            <input disabled={this.state.activeMeeting} onKeyPress={this._checkForEnter} onChange={this._sessionInputChange} className="form-control" placeholder="Email (required)" name="leadEmail" value={this.state.leadEmail}/>
                            <span className="input-group-title">
                                Email
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-xs-4 no-padding pr20">
                    <div className="form-group m0">
                        <div className="input-group input-with-label">
                            <input onChange={this._sessionInputChange} className="form-control" placeholder="Name" name="leadName" value={this.state.leadName}/>
                            <span className="input-group-title">
                                Name
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-xs-4 no-padding pr20">
                    <div className="form-group m0">
                        <div className="input-group input-with-label">
                            <input onChange={this._sessionInputChange} className="form-control" placeholder="Company" name="leadCompany" value={this.state.leadCompany}/>
                            <span className="input-group-title">
                                Company
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    renderStartStop: function () {
        if (this.state.activeMeeting) {
            return (
                <button onClick={this._endSession} className="btn btn-outline btn-small btn-red next-meeting-btn m0 fr">End Session</button>
            );
        } else if (this.state.partnerStatus === 'connected') {
            return (
                <button disabled={this.state.partnerStatus !== 'connected'} onClick={this._startSession} className="btn btn-outline btn-small btn-green next-meeting-btn m0 fr">Start Session</button>
            );
        }
    },
    renderPartnerInfo: function () {
        if (this.props.user.isListener()) {
            var meetingPartner = Store.getSelectedUser() || {};
            if (meetingPartner.meta) {
                meetingPartner.city = meetingPartner.meta.address.city
                meetingPartner.state = meetingPartner.meta.address.state
                meetingPartner.employer = meetingPartner.meta.employer;
                meetingPartner.jobTitle = meetingPartner.meta.jobTitle;
            }
            return (
                <div className="row partner-info">
                    <a target="_blank" href={'/users/' + meetingPartner.username} className="profile-name mr6">{meetingPartner.name} {meetingPartner.surname}</a>
                    <span className="username">{meetingPartner.employer}</span>
                    <span title={this.state.partnerStatus} data-toggle="tooltip" className={'partner-status ml6 ' + this.state.partnerStatus}></span>
                </div>
            );
        } else if (this.state.partnerStatus === 'connected') {
            var state = this.state;
            return (
                <div className="row partner-info">
                    <span className="profile-name lead mr6">{state.leadName || state.leadEmail }</span>
                    {function () {
                        if (state.leadCompany) {
                            return (
                                <span className="username lead ms6">{state.leadCompany}</span>
                            );
                        }
                    }()}
                    <span title={this.state.partnerStatus} data-toggle="tooltip" className={'partner-status ml6 ' + this.state.partnerStatus}></span>
                </div>
            );
        }
    },
    joinRoom: function () {
        var roomToJoin = window.location.pathname.substr(7);
        roomToJoin = _.without(roomToJoin, '/').join('');
        var mtg = $.extend({}, this.props.meeting);
        mtg.id = roomToJoin;
        this.setProps({ meeting: mtg }, function () {
            bc.signaling.joinRoom( roomToJoin );
        });
    },
    _checkForEnter: function (e) {
        if (e && e.which === 13) {
            this._saveCurrentSession();
        }
    },
    _promptTextChange: function (e) {
        var $target = $(e.currentTarget);
        var idx = $target.data('idx');
        var prompts = $.extend(true, [], this.state.feedbackPrompts);
        prompts[idx].text = $target.val();
        this.setState({
            sessionChanged: true,
            feedbackPrompts: prompts
        });
    },
    _removePrompt: function (e) {
        var idx = $(e.currentTarget).data('idx');
        var prompts = $.extend(true, [], this.state.feedbackPrompts);
        prompts.splice(idx, 1);

        this.setState({
            sessionChanged: true,
            feedbackPrompts: prompts
        });
    },
    _savePrompt: function (e) {
        var idx = $(e.currentTarget).data('idx');
        var prompts = $.extend(true, [], this.state.feedbackPrompts);
        prompts[idx].edit = false;
        $('select').select2('destroy');

        if (!prompts[idx].text) {
            prompts.splice(idx, 1);
        }
        
        this.setState({
            feedbackPrompts: prompts
        });
    },
    _editPrompt: function (e) {
        var idx = $(e.currentTarget).data('idx');
        var prompts = $.extend(true, [], this.state.feedbackPrompts);
        prompts[idx].edit = true;
        this.setState({
            feedbackPrompts: prompts
        });
    },
    _addPrompt: function () {
        var prompts = $.extend(true, [], this.state.feedbackPrompts);
        prompts[prompts.length] = {
            text: '',
            type: 'text',
            checked: true,
            edit: true
        };
        this.setState({
            sessionChanged: true,
            feedbackPrompts: prompts
        });
    },
    _reorderPrompt: function (dir) {
        var self = this;
        var prompts = $.extend(true, [], this.state.feedbackPrompts);
        
        return function (e) {
            var idx = $(e.currentTarget).data('idx');
            if (idx > 0 && dir > 0) {
                var temp = prompts[idx];
                prompts[idx] = prompts[idx-1];
                prompts[idx-1] = temp;
            } else if (idx < prompts.length-1 && dir < 0) {
                var temp = prompts[idx];
                prompts[idx] = prompts[idx+1];
                prompts[idx+1] = temp;
            }
            $('select').select2('destroy');
            self.setState({
                sessionChanged: true,
                feedbackPrompts: prompts
            });
        };
    },
    _startSession: function () {
        var self = this;
        var user = this.props.user; 
        var mtg = user.get('currentSession');
        mtg.startTime = moment().unix();
        mtg.state = 1;

        this.setState({ activeMeeting: true }, function () {
            user.set({ currentSession: mtg });
            user.save();
        });
    },

    _endSession: function () {
        var self = this;
        var user = this.props.user; 
        
        user.resetCurrentSession(this)
        .done(function (res) {
            var meeting = user.get('currentSession');
            meeting.presenter = { username: self.props.user.username };

            Actions.updateCurrentMtg(meeting);
            self.setProps({
                user: user,
                meeting: meeting
            }, function () {
                self.setState({
                    leadEmail: '',
                    leadName: '',
                    leadCompany: '',
                    newSession: true,
                    activeMeeting: false
                });
            });
        });
    },

    _promptTypeChanged: function (e) {
        var feedbackPrompts = $.extend(true, [], this.state.feedbackPrompts);
        var $target = $(e.currentTarget);
        var idx = $target.data('idx');
        feedbackPrompts[idx].type = $target.val();

        this.setState({
            sessionChanged: true,
            feedbackPrompts: feedbackPrompts
        });
    },

    _promptChanged: function (e) {
        var feedbackPrompts = $.extend(true, [], this.state.feedbackPrompts);
        var $target = $(e.currentTarget);
        var checked = $target.prop('checked');
        var idx = $target.data('idx');
        feedbackPrompts[idx].checked = checked;

        this.setState({
            sessionChanged: true,
            feedbackPrompts: feedbackPrompts
        });
    },

    _sessionInputChange: function (e) {
        var attr = $(e.target).attr('name');
        var val = e.target.value;
        var change = {};
        change[attr] = val;
        change.sessionChanged = true;
        if (attr === 'leadEmail') {
            $('.email-container').removeClass('has-error');
        }
        this.setState(change);
    },

    _updateMtg: function () {
        var self = this;
        var mtg = Store.getCurrentMtg();
        this.setProps({ meeting: mtg }, function () {
            if (mtg.state === meetingStates.ENDED_NO_FEEDBACK) {
                self.goToFinished();
                Backbone.history.navigate('/meetings/' + mtg.id + '?guest=' + mtg.listener.email);
                return;
            }
            self.setState({ meeting: mtg }, function () {
                var user = self.props.user;
                if (user.isPresenter() && mtg.messages.length !== user.get('currentSession').length) {
                    var currentSession = user.get('currentSession');
                    currentSession.messages = mtg.messages;
                    user.set({ currentSession: currentSession });
                    user.save();
                }
            });
        });
    },
    _cancelChanges: function () {
        $('.next-meeting').addClass('hidden');

        var session = this.props.user.get('currentSession');
        var leadEmail = session.email;
        var leadName = session.name;
        var leadCompany = session.company;

        this.setState({
            sessionChanged: false,
            feedbackPrompts: this.props.user.get('feedbackPrompts'),
            leadEmail: leadEmail,
            leadName: leadName,
            leadCompany: leadCompany
        });
    },
    _saveCurrentSession: function () {
        var self = this;
        var emailModel = new EmailModel(this.state.leadEmail);
        if (this.state.leadEmail && !emailModel.isValid()) {
            $('.email-container').addClass('has-error');
            return;
        }
        var currentUser = this.props.user;
        var checkedPrompts = _.where(this.state.feedbackPrompts, {checked: true});

        var currentSession = {
            email: this.state.leadEmail,
            name: this.state.leadName,
            company: this.state.leadCompany,
            prompts: checkedPrompts,
            messages: currentUser.get('currentSession').messages
        };

        Actions.startLoading();

        currentUser.set({
            currentSession: currentSession,
            feedbackPrompts: this.state.feedbackPrompts            
        });
        return currentUser.save()
        .done(function () {
            $('.next-meeting').addClass('hidden');
            Actions.stopLoading();
            var change = { sessionChanged: false };
            // if user's currentSession has no email, it's a new session
            change.newSession = !currentUser.get('currentSession').email;
            self.setState(change);
        });
    },

    _saveNewSession: function () {
        var self = this;
        var emailModel = new EmailModel(this.state.leadEmail);
        if (emailModel.isValid()) {
            // if email is valid
            self.setState({ newSession: false, sessionChanged: false }, function () {
                self._saveCurrentSession();
            });
        } else {
            $('.email-container').addClass('has-error');
        }
    },

    _toggleCurrentSessionForm: function () {
        $('.next-meeting').toggleClass('hidden');
        
        function clickToClose(e) {
            var $target = $(e.target);
            if ($(e.target).parents('a').hasClass('session-details')) {
                $('body').off('click', clickToClose);
                return;
            }
            if (!$target.hasClass('next-meeting') && !$target.parents('.next-meeting').length) {
                $('.next-meeting').addClass('hidden');
                $('body').off('click', clickToClose);
            }
        }

        if (!$('.next-meeting').hasClass('hidden')) {
            $('body').off('click', clickToClose);
            $('body').on('click', clickToClose);
        }
    }
};

viewOptions = $.extend(true, viewOptions, activeMeetingMethods(true));

var QuickStartView = React.createClass(viewOptions);

module.exports = QuickStartView;
