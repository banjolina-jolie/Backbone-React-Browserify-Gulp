var React = require('react/addons');
var Store = require('../../stores/Store');
var Actions = require('../../actions/Actions');
var MeetingModel = require('../../models/MeetingModel');

var MessagesView = React.createClass({
    
    mixins: [React.addons.LinkedStateMixin],

    getCurrentMessages: function () {
        return Store.getCurrentMtg().messages;
    },
    getInitialState: function () {
        return {
            messages: this.props.meeting.messages || []
        };
    },
    scrollToBottom: function () {
        if (this.props.activeMeeting) {
            var objDiv = document.getElementsByClassName("conversation")[0];
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    },
    componentDidMount: function () {
        Store.addupdateCurrentMtgListener(this._updateMessages);
        this.scrollToBottom();
        this.clearUnreadFlag();
    },
    componentDidUpdate: function () {
        this.scrollToBottom();
    },
    render: function () {
        if (!this.props.activeMeeting && !this.state.messages.length) {
            return (
                <div className="mb25">
                    { this.renderText('No messages') }
                </div>
            );
        }
        if (!this.props.activeMeeting) {
            return (
                <div className="row messages-container expanded">
                    <div className="col-xs-12 no-padding">
                        <div className="conversation mb25">
                            { this.renderMessages() }
                        </div>
                    </div>
                </div>
            );    
        }
        return (
            <div className="row messages-container expanded">
                <div className="col-xs-12 no-padding">
                    <div className="conversation mb25">
                        { this.renderMessages() }
                    </div>
                    <textarea onKeyDown={this.sendMessage} valueLink={this.linkState('message')} placeholder="Compose message..." maxLength="500" className="compose-message"></textarea>
                </div>
                <div className="col-xs-12 no-padding">
                    <button type="button" onClick={this.sendMessage} className="btn btn-small btn-solid btn-blue p0 pr10 pl10 fr mt20">Send</button>
                    {function () {
                        if (this.props.user.isPresenter()) {
                            return (
                                <button type="button" onClick={this.clearMessages} className="btn btn-small btn-outline btn-blue p0 pr10 pl10 fr mt20 mr10">Clear Thread</button>
                            );
                        }
                    }.call(this)}
                </div>
            </div>
        );
    },
    renderMessages: function () {
        var currentUser = this.props.user;
        var currentUserName = currentUser.get('name') + ' ' + currentUser.get('surname');

        return this.state.messages.map(function(msg) {
            var textClasses = 'message-text';
            var timeClasses = 'message-time';
            
            if (msg.author === currentUserName) {
                textClasses += ' current-user-msg';
                timeClasses += ' text-right';
            }

            return (
                <div key={msg.timestamp} className="row m0 mb12 message-row">
                    <div className="message-container">
                        <div className={timeClasses}>
                            {moment(msg.timestamp * 1000).format('MMM DD - h:mma')}
                        </div>
                        <div className={textClasses}>
                            { this.renderText(msg.text) }
                        </div>
                    </div>
                </div>
            );
        }.bind(this));
    },
    renderText: function (text) {
        if (!text) { return; }

        // check for a url in the message and create anchor tag
        // TODO: keep checking for more regex matches
        var regExMatches = text.match(/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/);
        var url = regExMatches && regExMatches[0];

        if (url) {
            var splitStr = text.split(url)
            text = function () {
                return (
                    <span>
                        {splitStr[0]}
                            <a className="ttn" href={url} target="_blank">{url}</a>
                        {splitStr[1]}
                    </span>
                );
            }
        }

        if (_.isFunction(text)) {
            return (
                <div className="text-line">
                    { text() }
                </div>
            );
        } else {
            var lines = text.split('\n');
            return lines.map(function (line, idx) {
                return (<div key={line+idx} className="text-line">{line}</div>);
            });
        }
    },
    clearUnreadFlag: function () {
        var mtg = this.props.meeting;
        
        if (!mtg.id) { return; }

        if (mtg['new_message_for_' + this.props.user.role()]) {
            mtg['new_message_for_' + this.props.user.role()] = false;
            mtg.newMsgEmailSent = false;
            mtg = new MeetingModel(mtg);
            mtg.save();
        }
    },
    clearMessages: function () {
        var self = this;
        var mtg = this.props.meeting;
        mtg.messages = [];
        var currentSession = self.props.user.get('currentSession');
        currentSession.messages = [];
        self.props.user.set({currentSession: currentSession});

        Actions.updateCurrentMtg(mtg);

        self.props.user.save()
        .done(function () {
            if (self.props.conferenceObj && bc.getRoomMembers(mtg.id).length) {
                self.props.conferenceObj.sendChatMessage(JSON.stringify(mtg));
            }
        });
    },
    sendMessage: function (e) {
        if (!this.state.message) { return; }

        if (e.type !== 'click') {
            if ((e && e.keyCode && e.keyCode !== 13) || (e.metaKey || e.ctrlKey)) {
                // TODO: Figure out why new lines dont work in messages.
                if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
                    var message = this.state.message;
                    message += '\n';
                    this.setState({message: message})
                }
                return;
            }
        }

        e.preventDefault();
        e.stopPropagation();

        var mtg = this.props.meeting;
        var now = new Date();
        now = Math.floor(now.getTime() / 1000);

        var message = {
            timestamp: now,
            author: this.props.user.get('name') + ' ' + this.props.user.get('surname'),
            text: this.state.message
        };
        mtg.messages.push(message);

        if (this.props.conferenceObj && bc.getRoomMembers(mtg.id).length) {
            this.props.conferenceObj.sendChatMessage(JSON.stringify(this.props.meeting));
        }
        
        mtg = new MeetingModel(mtg);
        var self = this;

        
        this.setState({
            message: ''
        }, function () {
            if (self.props.user.isPresenter()) {
                var currentSession = self.props.user.get('currentSession');
                currentSession.messages = mtg.get('messages');
                self.props.user.set({currentSession: currentSession});
                self.props.user.save()
                .done(function () {
                    Actions.updateCurrentMtg(mtg.toJSON());
                });
            } else {
                Actions.updateCurrentMtg(mtg.toJSON());
            }
        });
    },
    _updateMessages: function () {
        this.setState({messages: this.getCurrentMessages()});
    }
});

module.exports = MessagesView;
