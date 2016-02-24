'use strict';

let React = require('react');

let FooterView = React.createClass({

    render() {
        let currentYear = new Date().getFullYear();

        return (
            <footer>
                <div className="container no-padding">
                    <div className="row">
                        <div className="col-xs-12 no-padding">
                            <div className="footer-bottom">
                                <div className="col-xs-7 no-padding pull-right">
                                    <ul className="clear-list footer-nav">
                                        <li><a href="/about">About</a></li>
                                        <li><a data-toggle="modal" data-target="#contactUsModal">Support</a></li>
                                        <li><a href="/terms">Terms</a></li>
                                        <li><a href="/privacy">Privacy</a></li>
                                    </ul>
                                </div>
                                <div className="col-xs-5 no-padding pull-right">
                                    <ul className="clear-list footer-copy">
                                        <li>&copy; {currentYear} AppName</li>
                                        <li>All rights reserved</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
});

module.exports = FooterView;
