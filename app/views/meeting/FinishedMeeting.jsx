var React = require('react/addons');
var Store = require('../../stores/Store');
var $ = require('jquery');
var Messages = require('./Messages.jsx');
var Actions = require('../../actions/Actions');
var MeetingModel = require('../../models/MeetingModel');
var vsBinding = require('../../utils/vsBinding');
var meetingStates = require('../../utils/MeetingConstants.json');


var FinishedMeetingView = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function () {
        var userIsListener = this.props.user.isListener();
        var feedbackProp = userIsListener ? 'listener_feedback' : 'presenter_feedback';
        var otherPartyFeedback = !userIsListener ? 'listener_feedback' : 'presenter_feedback';

        var ratePerMinute = this.props.meeting.rate;
        var effectiveMins = Math.floor(this.props.meeting.duration / 60);

        var prompts = this.props.meeting.prompts;
        prompts = _.filter(prompts, function (feedback) {
            return feedback.text;
        });

        var hasAnswers = _.some(this.props.meeting.prompts, function (promptObj) {
            return promptObj.answer;
        });

        return {
            hasSubmitted: this.props.meeting[feedbackProp],
            partnerHasSubmitted: hasAnswers,
            customPrompts: prompts,
            thankYou: false
        };
    },
    render: function () {
        var meetingPartner = Store.getSelectedUser();

        if (this.state.thankYou) {
            return (
                <div className="mt40">
                    <h3 className="tac">Thank you for your feedback!</h3>
                </div>
            );
        }

        return (
            <div className="meeting">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-5 col-xs-5 col-sm-5 no-padding mb20">

                            { this.renderPartnerInfo(meetingPartner, true) }

                        </div>
                        <div className="col-xs-7 col-xs-7 col-sm-7 no-padding mb20">
                            { this.renderArchiveBtn() }
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        { this.renderDuration() }
                        { this.renderPresenterView() }
                        { this.renderListenerView() }
                    </div>
                </div>
            </div>
        );
    },
    renderPresenterView: function () {
        if (this.props.user.isPresenter()) {
            if (this.state.partnerHasSubmitted) {
                return (
                    <div>
                        { this.renderCustomPromptAnswers() }
                        { this.renderMessages() }
                    </div>
                );
            } else {
                return (
                    <div>
                        { this.renderWaiting() }
                        { this.renderMessages() }
                    </div>
                );
            }
        }
    },
    renderListenerView: function () {
        if (this.props.user.isListener()) {
            if (this.state.hasSubmitted) {
                return (
                    <div>
                        { this.renderCustomPromptAnswers() }
                    </div>
                );
            } else {
                return (
                    <div>
                        <div>
                            { this.renderInputs() }
                        </div>
                        { this.renderSubmitBtn() }
                    </div>

                );
            }
        }
    },
    renderDuration: function () {
        var mtg = this.props.meeting;
        if (this.props.user.isPresenter()) {
            return (
                <div className="mb20">
                    <label className="mr4 block">Duration</label>
                    {Math.ceil(mtg.duration / 60) + ' min'}
                </div>

            );
        }
    },
    renderSubmitBtn: function () {
        if (this.props.user.isListener() && !this.state.hasSubmitted) {
            return (
                <button disabled={this._disableSubmit()} onClick={this._submitBtnClick} className="btn btn-default btn-solid btn-blue mt40 block clearfix">Submit</button>
            );
        }
    },
    renderMessages: function () {
        return (
            <div className="col-xs-7 no-padding mt20 mb20">
                <label>Message thread</label>
                <Messages user={this.props.user} meeting={this.props.meeting} activeMeeting={false}/>
            </div>
        );
    },
    renderYourFeedback: function () {
        var otherParty = this.props.user.isListener() ? 'presenter' : 'listener';
        
        if (this.state.hasSubmitted) {
            return (
                <div className="col-xs-7 no-padding mb40">
                    {'Your feedback for ' + this.props.meeting[otherParty].name}
                    <div className="feedback-text">
                        { this.renderTextWithLines(this.state.hasSubmitted.user_feedback) }
                    </div>
                </div>
            );
        }
    },
    renderTextWithLines: function (text) {
        text = text || '';
        var lines = text.split('\n');
        return lines.map(function (line, idx) {
            return (<div key={line + idx} className="text-line">{line}</div>);
        });
    },
    renderPartnersFeedback: function () {
        var otherParty = this.props.user.isListener() ? 'presenter' : 'listener';
        var name = this.props.meeting[otherParty].name || this.props.meeting[otherParty].email;
        var msg;

        if (this.state.partnerHasSubmitted) {
            msg = this.renderTextWithLines(this.state.partnerHasSubmitted.user_feedback);
            return (
                <div className="col-xs-7 no-padding mt20 mb20">
                    {name + '\'s feedback for you'}
                    <div className="feedback-text">
                        {msg}
                    </div>
                </div>
            );
        }
    },
    renderWaiting: function () {
        var otherParty = this.props.user.isListener() ? 'presenter' : 'listener';
        var partnerName = this.props.meeting[otherParty].name;
        var message = partnerName ? 'Waiting on feedback from ' + partnerName : 'Waiting on partner\'s feedback';
        
        return (
            <div className="col-xs-7 no-padding">
                <div className="clearfix">
                    <div>
                        {message}
                    </div>
                </div>
            </div>
        );
    },
    renderInputs: function () {
        var otherParty = this.props.user.isListener() ? 'presenter' : 'listener';
        var name = this.props.meeting[otherParty].name || this.props.meeting[otherParty].email;

        if (!this.state.hasSubmitted) {
            return (
                <div className="col-xs-7 no-padding mb20">
                    
                    { this.renderCustomPromptInputs() }

                </div>
            );
        }
    },
    renderCustomPromptAnswers: function () {
        if (this.props.user.isPresenter() || this.state.hasSubmitted) {
            return this.state.customPrompts.map(function (prompt, idx) {
                if (!isNaN(prompt.answer)) {
                    return (
                        <div className="col-xs-7 no-padding mt20 mb20">
                            {prompt.text + ' (' + prompt.type + ')'}
                            <div className="feedback-number">
                                {prompt.answer}
                            </div>
                        </div>
                    );
                } else if (prompt.type === 'yes/no') {
                    return (
                        <div className="col-xs-7 no-padding mt20 mb20">
                            {prompt.text}
                            <div className="feedback-number">
                                {prompt.answer}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="col-xs-7 no-padding mt20 mb20">
                            {prompt.text}
                            <div className="feedback-text mt4">
                                {this.renderTextWithLines(prompt.answer) || (<i className="text-light">Partner has not yet submitted feedback</i>)}
                            </div>
                        </div>
                    );
                }
            }.bind(this))
        }
    },
    renderInput: function (prompt, idx) {
        if (prompt.type === 'text') {
            return (
                <textarea id={'prompt'+idx} data-idx={idx} placeholder="Type here..." onChange={this._promptAnswerChange} value={prompt.answer} rows="10" className="form-control"></textarea>
            );
        }
        if (prompt.type === 'rate 1-5') {
            return (
                <div className="clearfix">
                    { this.renderOneToXRadios(idx, 5) }
                </div>
            );
        }
        if (prompt.type === 'rate 1-10') {
            return (
                <div className="clearfix">
                    { this.renderOneToXRadios(idx, 10) }
                </div>
            );
        }
        if (prompt.type === 'yes/no') {
            return (
                <div className="clearfix">
                    { this.renderYesNoRadios(idx, 10) }
                </div>
            );
        }
    },
    renderCustomPromptInputs: function () {
        var self = this;
        if (this.props.user.isListener()) {
            return this.state.customPrompts.map(function (prompt, idx) {
                return (
                    <div>
                        <label htmlFor={'prompt'+idx} className="mt20 block">{prompt.text}</label>
                        <div>
                            { self.renderInput(prompt, idx) }
                        </div>
                    </div>
                );
            }.bind(this))
        }
    },
    renderYesNoRadios: function (idx) {
        return (
            <div>
                <input id="yes" type="radio" data-idx={idx} value="yes" onChange={this._promptAnswerChange} />
                <label htmlFor="yes" className="ml4 fwnormal mr10">yes</label>
                <input id="no" type="radio" data-idx={idx} value="no" onChange={this._promptAnswerChange} />
                <label htmlFor="no" className="ml4 fwnormal">no</label>
            </div>
        );
        var radios = [];
        radios.push();
        radios.push();
        return radios;
    },
    renderOneToXRadios: function (idx, limit) {
        var radios = [];
        for (var i = 1; i <= limit; i++) {
            radios.push(
                <span className="one-to-ten-radio-container">
                    <input type="radio" data-idx={idx} value={i} onChange={this._promptAnswerChange} />
                    <div>{i}</div>
                </span>
            );
        }
        return radios;
    },
    renderArchiveBtn: function () {
        if (this.state.hasSubmitted && this.state.partnerHasSubmitted) {
            return (
                <button onClick={this._archive} className="btn btn-default btn-outline fr">Archive</button>
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
        } else {
            var listener = this.props.meeting.listener;

            return (
                <div className="row partner-info">
                    <span className="profile-name lead mr6">{ listener.name || listener.email }</span>
                    {function () {
                        if (listener.company) {
                            return (
                                <span className="username lead ms6">{listener.company}</span>
                            );
                        }
                    }()}
                    {function () {
                        if (listener.name) {
                            return (
                                <span className="">{listener.email}</span>
                            );
                        }
                    }()}
                </div>
            );
        }
    },
    _disableSubmit: function () {
        return _.some(this.state.customPrompts, function (prompt) {
            return !prompt.answer;
        });
    },
    _promptAnswerChange: function (e) {
        var $target = $(e.currentTarget);
        var idx = $target.data().idx;
        var customPrompts = this.state.customPrompts;
        customPrompts[idx].answer = $target.val();
        this.setState({ customPrompts: customPrompts });
    },
    submitFeedback: function () {
        var user = this.props.user;
        var userIsListener = user.isListener();
        var feedbackProp = userIsListener ? 'listener_feedback' : 'presenter_feedback';
        var otherPartyFeedback = !userIsListener ? 'listener_feedback' : 'presenter_feedback';
        var saveObj = {};
        saveObj.state = meetingStates.LISTENER_ACCEPTS_PAYMENT;
        saveObj.prompts = this.state.customPrompts;

        this._saveMeeting(saveObj).done(function (res) {
            if (user.get('username')) {
                // edge case for when a current member has been invited as a listener
                user.set({type: 1});
            }
            this.setState({thankYou: true});
            this.setState({
                hasSubmitted: res[feedbackProp],
                partnerHasSubmitted: res[otherPartyFeedback]
            });
        }.bind(this));
    },
    _submitBtnClick: function () {
        this.submitFeedback();
    },
    _archive: function () {
        this.props.meeting[this.props.user.role() + '_archive'] = true;
        this._saveMeeting()
        .done(function (res) {
            Backbone.history.navigate('/schedule', { trigger: true });
        });
    },
    _saveMeeting: function (props) {
        props = props || {};
        var mtg = new MeetingModel(this.props.meeting);
        return mtg.save(props);
    }
});

module.exports = FinishedMeetingView;
