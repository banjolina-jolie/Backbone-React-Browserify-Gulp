'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');
let ComposeModal = require('./ComposeModal.jsx');

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
        // set listeners
        Store.addFetchMessagesListener(this._fetchMessageUrl);
        Store.addSetMessagesListener(this._updateState);

        this._fetchMessageUrl();
    },

    componentWillUnmount() {
        Store.removeSetMessagesListener(this._updateState);
        Store.removeFetchMessagesListener(this._fetchMessageUrl);
    },

    render() {
        return (
            <div className="messages-list">

                <div onClick={this._logout} className="logout"></div>

                {this.state.messages.map( (message, idx) => {
                    return (
                        <div className="message-container" key={'message' + idx}>
                            {this._renderDot(idx)}
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

    _renderDot(idx) {
        if (!idx) {
            return (
                <img className="red-dot" src="/assets/img_dotRed@2x.png"/>
            );
        }
    },

    _updateState() {
        this.setState(this._getState());
    },

    _compose() {
        $('#composeModal').modal('show');
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

        $.ajax({
            url: apiBaseUrl + msgUrl,
            headers: {
                Accept: 'application/json; scheme=messages; version=0'
            }
        })
        .done(data => {
            Actions.setMessages(msgUrl, data.messages.reverse());
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
