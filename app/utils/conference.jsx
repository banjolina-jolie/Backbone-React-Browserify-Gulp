/*
    JS library reference:
    http://developers.bistri.com/webrtc-sdk/js-library-reference
*/

var React = require('react/addons');
var _ = require('lodash');
var Seq = require('seq');
var Actions = require('../actions/Actions');

// evt handlers
function Handlers(type) {
    this.handlers = [];
    this.type = type;
}
var sigHandlers = new Handlers('signaling');
var streamHandlers = new Handlers('streams');
var channelHandlers = new Handlers('channels');

var dataChannels = {};
var obj;
var mtgView;

// when Bistri API client is ready, function 'onBistriConferenceReady' is invoked
module.exports = function (view) {
    mtgView = view;

    // test if the browser is WebRTC compatible
    if (!bc.isCompatible()) {
        // if the browser is not compatible, display an alert
        Actions.okpAlert({
            body: function () {
                return (
                    <span>Your browser is currently not WebRTC compatible. We strongly recommend using OKPitch on <a target="_blank" href="https://www.google.com/chrome/">Chrome</a> or <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>. If you are steadfast in using your current browser, then download and install the <a href="https://temasys.atlassian.net/wiki/display/TWPP/WebRTC+Plugins">Temasys Plugin</a>, then restart your browser.</span>
                );
            }
        });
        // then stop the script execution
        return;
    }
    
    if (!bc.connected) {
        // initialize API client with application keys
        bc.init({
            appId: '9550157b',
            appKey: '06fffc5e3e5122dda36e308171046e07',
            chromeExtensionId: 'oogddaogagjffbmjoidefgmjmlcfnpin',
            firefoxExtensionId: '344684',
            userName: view.props.user.id
        });
        // open a new session on the server
        bc.connect();
    }

    obj = {
        setActiveMtgEventHandlers: setActiveMtgEventHandlers,
        clearEventHandlers: clearEventHandlers,
        sendChatMessage: function(message) {
            for(var id in dataChannels) {
                // ... send a message
                dataChannels[ id ].send(message);
            }
        }
    };

    return obj;
};

function clearEventHandlers() {
    _.each([sigHandlers, streamHandlers, channelHandlers], function (obj) {
        _.each(obj.handlers, function (handler) {
            bc[obj.type].unbind(handler);
        });
        obj.handlers = [];
    });
}

function setActiveMtgEventHandlers(view) {
    // clear previous handlers
    clearEventHandlers();

    // when user is ready to join rooms
    sigHandlers.handlers.push(bc.signaling.bind('onConnected', function () {
        Actions.stopLoading();
        
        bc.startStream(view.props.meeting.streamType || 'webcam-sd', function (stream) {
            // log activity
            if (view.logStartStream) {
                view.logStartStream();
            }
            // set localStream on view
            view.localStream = stream;
            
            // when webcam access has been granted, insert the local webcam stream into div#video_container node
            bc.attachStream(stream, $('#video_container_1')[0], { mirror: true });
            view.joinRoom();
        });
    }));

    // when the user has joined a room
    sigHandlers.handlers.push(bc.signaling.bind('onJoinedRoom', function (data) {
        Actions.stopLoading();
        
        // if you've just joined the screen sharing room, don't do anything
        if (data.room.indexOf('__screen_') !== -1) { return; }

        
        // set the current room and members on the view
        view.room = data.room;
        view.members = data.members;

        // then, for every single members present in the room ...
        _.each(view.members, function (member) {
            window.inActiveMeeting = true;
            window.currentMtgUrl = window.location.pathname;

            // ... request a call
            bc.call(member.id, view.room, { 'stream': view.localStream });
            view.partnerPID = member.id;
            bc.openDataChannel( member.id, 'chat', view.room );
            
            if (view.props.meeting.streamType === 'pure-audio') {
                // add border stuff around audio el.
                $('#video_container_1').addClass('pure-audio');
            }
        });

        view.setState({
            partnerStatus: data.members.length >= 1 ? 'connected' : 'not-connected', // set partner's dot color
            status: view.props.meeting.state === 2 ? 'Start Now' : 'End Meeting'// change button text
        });
        // join screen share room
        bc.signaling.joinRoom('__screen_' + data.room);

    }));

    // when an error occured on the server side
    sigHandlers.handlers.push(bc.signaling.bind('onError', function (error) {
        // display an alert message
        console.log({body: error.text + ' (' + error.code + ')'});
    }));

    sigHandlers.handlers.push(bc.signaling.bind('onPeerJoinedRoom', function(data) {
        view.setState({partnerStatus: 'connected'});
        view.partnerPID = data.pid;
        window.inActiveMeeting = true;
        window.currentMtgUrl = window.location.pathname;

        // // when another member has joined the room, show them the screen-share if it exists
        // if (data.room.indexOf('__screen_') !== -1) {
        //     bc.call(data.pid, data.room, { 'stream': view.localScreenStream, 'sendonly': true });
        // }
    }));

    // change status of meeting partner
    sigHandlers.handlers.push(bc.signaling.bind('onPeerQuittedRoom', function(data) {
        view.setState({partnerStatus: 'not-connected'});
        window.inActiveMeeting = false;
    }));
    

    // when an error occurred while trying to join a room
    sigHandlers.handlers.push(bc.signaling.bind('onJoinRoomError', function (error) {
        // display an alert message
        console.log({body: error.text + ' (' + error.code + ')'});
    }));

    // when the local user has quitted the room
    sigHandlers.handlers.push(bc.signaling.bind('onQuittedRoom', function(room) {
        window.inActiveMeeting = false;
        console.log('ACTIVE MEETING - user quit room');
        // log activity
        if (view.logStopStream) {
            view.logStopStream();
        }

        $('.pure-audio').removeClass('pure-audio');
        bc.endCalls('__screen_' + view.room);
        bc.signaling.quitRoom('__screen_' + view.room);
        view.localScreenStream = undefined;
        // stop the local stream
        bc.stopStream(view.localStream, function() {
            // remove the stream from the page
            bc.detachStream(view.localStream);
            console.log('local stream detached');
        });
    }));

    // when a new remote stream is received
    streamHandlers.handlers.push(bc.streams.bind('onStreamAdded', function (remoteStream) {
        if (remoteStream.room && remoteStream.room.indexOf('__screen_') == 0) {
            // screen share
            $('#screen_share').removeClass('hidden');
            bc.attachStream(remoteStream, $('#screen_share')[0], { fullscreen: true });
        } else {
            $('#video_container_2').removeClass('hidden');
            // other party's webcam
            clearAllExpanded();
            $('#video_container_2').click();
            bc.attachStream(remoteStream, $('#video_container_2')[0], { });
        }
    }));

    // when a stream is muted
    streamHandlers.handlers.push(bc.streams.bind('onStreamMuteChange', function (streamStatus, pid) {
        if (view.partnerPID === pid) {
            $('#video_container_2').toggleClass('muted glyphicon glyphicon-volume-up', streamStatus);
        }
    }));

    // when a remote stream has been stopped
    streamHandlers.handlers.push(bc.streams.bind('onStreamClosed', function (stream) {
        // remove the stream from the page
        bc.detachStream(stream);
        
        if (stream.type === 'screen-sharing') {
            bc.endCalls('__screen_' + view.room);
            view.localScreenStream = undefined;
            $('#screen_share').html('');
            if ($('#screen_share').hasClass('expanded')) {
                setTimeout(function () {
                    $('#video_container_2').click();
                }, 20);
            }
        } else {
            $('#video_container_2').removeClass('muted glyphicon glyphicon-volume-up');
        }   
    }));

    // when a local stream cannot be retrieved
    streamHandlers.handlers.push(bc.streams.bind('onStreamError', function(error) {
        console.log(arguments);
        // switch (error.name) {
        //     case 'PermissionDeniedError':
        //         Actions.okpAlert({body: 'Webcam access has not been allowed'});
        //         bc.quitRoom(view.room);
        //         break;
        //     case 'DevicesNotFoundError':
        //         Actions.okpAlert({body: 'No webcam/mic found on this machine.'})
        //         bc.quitRoom(view.room);
        //         break;
        // }
    }));

    // when the local user has created a data channel, invoke "onDataChannel" callback
    channelHandlers.handlers.push(bc.channels.bind("onDataChannelCreated", onDataChannel));

    // when the remote user has created a data channel, invoke "onDataChannel" callback
    channelHandlers.handlers.push(bc.channels.bind("onDataChannelRequested", onDataChannel));

}

// when "onDataChannelCreated" or "onDataChannelRequested" are triggered
function onDataChannel(dataChannel, remoteUserId) {
    // when the data channel is open
    dataChannel.onOpen = function() {
        // set a couple id/dataChannel to "dataChannels" object
        console.log('dataChannel open');
        dataChannels[ remoteUserId ] = this;
    };

    // when the data channel is closed
    dataChannel.onClose = function() {
        // delete couple id/dataChannel from "dataChannels" object
        delete dataChannels[ remoteUserId ];
    };

    // when a message is received from the data channel
    dataChannel.onMessage = function(event) {
        // TODO: make better
        var data = JSON.parse(event.data);
        if (data && data.hasOwnProperty('messages')) {
            // having a messages attribute signifies that data object is a meeting model
            Actions.updateCurrentMtg(data);
        }
    };
}

function clearAllExpanded() {
    $('.messages-container').addClass('minimized');
    $('.expanded').removeClass('expanded');
}