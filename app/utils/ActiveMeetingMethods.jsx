var React = require('react/addons');
var Store = require('../stores/Store');
var $ = require('jquery');
var Messages = require('../views/meeting/Messages.jsx');
var Actions = require('../actions/Actions');
var MeetingModel = require('../models/MeetingModel');

module.exports = function (isQuickStart) {
    return {
        renderIcons: function () {
            var disableScreenShare = !bc.isScreenSharingCompatible();
            
            return (
                <div className="fr icons-container">
                    <button onClick={this.toggleMicMute} data-toggle="tooltip" title="mute microphone" className="btn btn-default btn-outline icon-btn">
                        <i className="fa fa-microphone"></i>
                    </button>
                    <button onClick={this.toggleWebcamMute} data-toggle="tooltip" title="mute webcam" className="btn btn-default btn-outline icon-btn">
                        <span className="glyphicon glyphicon-facetime-video"></span>
                    </button>
                    <button disabled={disableScreenShare} onClick={this.toggleScreenShare} data-toggle="tooltip" title="share screen" className="btn btn-default btn-outline icon-btn">
                        <i className="fa fa-desktop"></i>
                    </button>
                </div>
            );
        },
        quitRoom: function () {
            bc.signaling.quitRoom( this.room );
        },
        toggleMute: function (e) {
            $(e.currentTarget).toggleClass('btn-red');
            bc.muteAllSounds( !bc.isAllSoundsMuted() );
        },
        toggleMicMute: function (e) {
            $(e.currentTarget).toggleClass('btn-red');
            var isMuted = bc.isMicrophoneMuted();
            if (!isMuted) {
                $('#video_container_1').removeClass('fa-microphone');
                $('#video_container_1').addClass('fa fa-microphone-slash');
            } else {
                if (bc.isVideoMuted()) {
                    $('#video_container_1').addClass('fa fa-microphone');
                }
                $('#video_container_1').removeClass('fa-microphone-slash');
            }
            $('#video_container_1').toggleClass('audio-muted', !isMuted);
            bc.muteMicrophone( !isMuted );
        },
        toggleWebcamMute: function (e) {
            $(e.currentTarget).toggleClass('btn-red');
            var isMuted = bc.isVideoMuted();
            if (!bc.isMicrophoneMuted()) {
                $('#video_container_1').toggleClass('fa fa-microphone', !isMuted);
            }
            $('#video_container_1').toggleClass('muted', !isMuted);
            bc.muteVideo( this.localStream, !isMuted );
        },
        toggleHideMessages: function (e) {
            $(e.currentTarget).toggleClass('btn-red');
            $('.messages-container').toggleClass('hidden');
        },
        toggleScreenShare: function () {
            if (this.localScreenStream) {
                this.stopShareScreen();
            } else {
                this.startShareScreen();
            }
        },
        stopShareScreen: function () {
            var self = this;

            bc.stopStream( this.localScreenStream, function( stream, pid ){
                $target.removeClass('btn-red');
                bc.detachStream( stream );
                self.localScreenStream = undefined;
            });
        },
        startShareScreen: function () {
            var self = this;

            this.clearAllExpanded();
            $('#screen_share').addClass('expanded');
            
            bc.startStream( 'screen-sharing', function( stream, pid ) {
                self.localScreenStream = stream;
                
                bc.attachStream( stream, $( '#screen_share' )[ 0 ], { 'fullscreen': true } );
                
                _.each(self.members, function (member) {
                    bc.call( member.id, '__screen_' + self.room, { 'stream': stream, 'sendonly': true } );
                });
            });
        },
        goToFinished: function () {
            window.inActiveMeeting = false;
            clearInterval(this.timer);
            var view = require('../views/meeting/FinishedMeeting.jsx');
            return React.render(React.createElement(view, { user: this.props.user, meeting: this.props.meeting }), document.getElementById('content'));
        },
        sendP2PUpdate: function (mtg) {
            mtg = mtg || this.props.meeting;
            this.state.conferenceObj.sendChatMessage(JSON.stringify(mtg));
        },
        startLocalStream: function () {
            var self = this;
            
            bc.startStream(this.props.meeting.streamType || 'webcam-sd', function (stream) {
                if (!isQuickStart) {
                    // log activity
                    self.logStartStream();
                }
                // set localStream on view
                self.localStream = stream;
                // expand pane_1
                self.clearAllExpanded();
                // no clear float for panes
                $('.pane-1').addClass('expanded');
                
                // when webcam access has been granted, insert the local webcam stream into div#video_container node
                bc.attachStream(stream, $('#video_container_1')[0], { mirror: true });

                self.joinRoom();
            });
        },
        clearAllExpanded: function () {
            $('.messages-container').addClass('minimized');

            $('.expanded').removeClass('expanded');
        },
        expandDiv: function (e) {
            var $target = $(e.currentTarget);
            if (e && !$target.hasClass('expanded')) {
                // edge case for clicking send button when zoomed out
                e.preventDefault();
                e.stopPropagation();
            } 
            if ($target.hasClass('expanded') && $target.hasClass('pane')) {
                $target.toggleClass('full-screen');
                return;
            }

            this.clearAllExpanded();

            $target.removeClass('minimized').addClass('expanded');

            $('.conversation')[0].scrollTop = $('.conversation')[0].scrollHeight;
        }
    }
}