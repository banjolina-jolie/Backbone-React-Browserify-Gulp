'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');
let ComposeModal = require('./ComposeModal.jsx');
let Seq = require('seq');

let MessagesView = React.createClass({

    _getState() {
        return {
            messages: Store.getMessages()
        }
    },

    getInitialState() {
        return this._getState()
    },

    componentDidMount() {
        // listen for fetch messages
        Store.addSetMessagesListener(this._updateState);
        // add token to all headers
        $.ajaxSetup({
            beforeSend: xhr => {
                xhr.setRequestHeader('x-session-token', localStorage.getItem('token'));
            }
        });

        this._fetchMessageUrl();
    },

    componentWillUnmount() {
        Store.removeSetMessagesListener(this._updateState);
    },

    render() {
        return (
            <div className="messages-list">

                <div onClick={this._logout} className="logout"></div>

                {this.state.messages.map( (message, idx) => {
                    return (
                        <div className="message-container" key={'message' + idx}>
                            <div className="message-author">
                                {message.author}
                            </div>
                            <div className="message-content">
                                {message.content}
                            </div>
                        </div>
                    );
                })}

                <div className="compose-container">
                    <div onClick={this._compose} className="compose-btn"></div>
                </div>

                <ComposeModal />
            </div>
        );
    },

    _updateState() {
        this.setState(this._getState())
    },

    _compose() {
        $('#composeModal').modal('show');
        $('#composeModal').on('hidden.bs.modal', _ => {
            this._fetchMessageUrl();
        });
    },

    _fetchMessageUrl() {
        let location = window.localStorage.getItem('location');

        $.ajax({
            url: apiBaseUrl + location,
            headers: {
                Accept: 'application/json; scheme=session; version=0'
            }
        })
        .done(this._fetchMessages);
    },

    _fetchMessages(data) {
        let msgUrl = data['messages-url'];
        Actions.setMessageUrl(msgUrl);

        $.ajax({
            url: apiBaseUrl + msgUrl,
            headers: {
                Accept: 'application/json; scheme=messages; version=0'
            }
        })
        .done(data => {
            Actions.setMessages(data.messages);
        });
    },

    _logout() {
        window.localStorage.removeItem('location');
        window.localStorage.removeItem('token');

        let loginView = require('./Login.jsx');
        Actions.setUI(loginView);
    }
});

module.exports = MessagesView;
