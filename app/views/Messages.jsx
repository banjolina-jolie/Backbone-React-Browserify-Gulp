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
        Store.addSetMessagesListener(this._updateState);
    },

    componentWillUnmount() {
        Store.removeSetMessagesListener(this._updateState);
    },

    render() {
        return (
            <div className="messages-list">

                <div className="logout"></div>

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
    }

});

module.exports = MessagesView;
