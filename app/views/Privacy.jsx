'use strict';

let React = require('react/addons');

let PrivacyView = React.createClass({

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

module.exports = PrivacyView;
