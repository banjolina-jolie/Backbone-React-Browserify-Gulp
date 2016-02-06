var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');
var Footer = require('./Footer.jsx');
var Header = require('./Header.jsx');

var LandingView = React.createClass({
    getInitialState() {
        return {
            user: Store.getCurrentUser()
        };
    },
    componentDidMount: function () {

    },
    render: function () {
        return (
            <div className="landing">

                <Header />

                <section className="intro">
                    <div className="container dashboard">
                    </div>
                </section>

            </div>
        );
    },
});

module.exports = LandingView;

