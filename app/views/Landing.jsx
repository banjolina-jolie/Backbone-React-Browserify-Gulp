var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');
var Footer = require('./Footer.jsx');
var Header = require('./Header.jsx');
var SearchBar = require('./search/SearchBar.jsx');

var LandingView = React.createClass({
    render: function () {
        return (
            <div className="landing">

                <Header />

                <section className="intro">
                    <div className="container dashboard">
                        <h2 className="tac mb40">Follow your bliss</h2>
                        <SearchBar />
                    </div>
                </section>

            </div>
        );
    },
});

module.exports = LandingView;

