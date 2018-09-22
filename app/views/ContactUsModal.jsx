'use strict';

let React = require('react/addons');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');

let ContactUsModal = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        $('#contactUsModal').on('shown.bs.modal', _ => {
            setTimeout(_ => {
                $('[name=email]').focus();
            }, 0);
        });
    },

    getInitialState() {
    	let user = Store.getCurrentUser();
        return {
            name: user.name ? user.name + ' ' + user.surname : '',
            email: user.email || '',
            content: ''
        };
    },

    render() {
        return (
            <div className="modal fade" id="contactUsModal" tabIndex="-1" role="dialog" aria-labelledby="contactUsModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="contactUsModalLabel">Contact Us</h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-xs-12">
                                    <form>
                                        <div className="form-group">
                                            <div className="input-group input-with-label">
                                                <input valueLink={this.linkState('name')} type="name" name="name" className="form-control" placeholder="Your name"/>
                                                <span className="input-group-title">
                                                    Name
                                                </span>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                    	<div className="form-group">
                                            <div className="input-group input-with-label">
                                                <input valueLink={this.linkState('email')} type="email" name="email" className="form-control" placeholder="Email"/>
                                                <span className="input-group-title">
                                                    Email
                                                </span>
                                                <i className="fa fa-times"></i>
                                                <i className="fa fa-check"></i>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group input-with-label">
                                                <textarea onKeyUp={this.login} valueLink={this.linkState('content')} type="content" name="content" className="form-control contact-us-content" placeholder="What's on your mind?"></textarea>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-outline btn-blue" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-default btn-solid btn-blue" onClick={this.send}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    send(e) {
        if (e.keyCode && e.keyCode !== 13) { return; }

        $.ajax({
            url: apiBaseUrl + '/contactUs',
            type: 'POST',
            data: {
            	name: this.state.name,
            	email: this.state.email,
            	content: this.state.content
            }
        })
        .done(data => {
            $('#contactUsModal').modal('hide');
            setTimeout(_ => {
            	Actions.appAlert({
            		body: 'Your message has been submitted. We will get back to you ASAP!'
            	});
            }, 0);
        });
    }
});

module.exports = ContactUsModal;
