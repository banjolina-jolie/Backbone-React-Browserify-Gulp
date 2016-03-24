'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');

let ComposeModal = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        $('#composeModal').on('shown.bs.modal', _ => {
            setTimeout(_ => {
                $('[name=email]').focus();
            }, 0);
        });
    },

    getInitialState() {
        return {
            content: ''
        };
    },

    render() {
        return (
            <div className="modal fade compose-modal" id="composeModal" tabIndex="-1" role="dialog" aria-labelledby="composeModalLabel" aria-hidden="true">
                <div className="modal-dialog new-message-content-container">
                    <textarea valueLink={this.linkState('content')} className="new-message-content" placeholder="What do you want to say?"></textarea>
                </div>
                <div className="modal-dialog submit-post-container">
                    <button onClick={this._publish} className="btn">Post</button>
                </div>
            </div>
        );
    },
    _publish() {
        $.ajax({
            url: apiBaseUrl + Store.getMessageUrl(),
            headers: {
                'Content-Type': 'application/json; scheme=message-content; version=0',
            },
            type: 'POST',
            data: JSON.stringify(this.state)
        })
        .done(_ => {
            this.setState({ content: '' });
            $('#composeModal').modal('hide');
        });
    }
});

module.exports = ComposeModal;
