'use strict';

let React = require('react/addons');

let TermsView = React.createClass({

	componentDidMount() {
		$(window).scrollTop(0);
	},

    render() {
        return (
            <div className="container">

            </div>
        );
    }
});

module.exports = TermsView;
