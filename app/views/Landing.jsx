'use strict';

let React = require('react');
let Actions = require('../actions/Actions');
let Store = require('../stores/Store');
let Footer = require('./Footer.jsx');
let Header = require('./Header.jsx');
let SearchBar = require('./search/SearchBar.jsx');

let LandingView = React.createClass({
    render() {
        return (
            <div className="landing">
                <a name="topmost"></a>
                <Header />

                <div></div>

                <section className="intro">
                    <div className="container dashboard">
                        <h2 className="tac mb40">Follow your bliss</h2>
                        <SearchBar />
                    </div>
                </section>
                    <a href="#topmost" data-bypass>BACK TO TOP</a>

            </div>
        );
    },
});

module.exports = LandingView;

