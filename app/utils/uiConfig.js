var Footer = require('../views/Footer.jsx');
var RegisterHeader = require('../views/register/RegisterHeader.jsx');
var LoggedInHeader = require('../views/Header.jsx');

var uiConfig = function () {
	return {
		landing: {
			header: null,
			footer: Footer
		},
		register: {
			header: RegisterHeader,
			footer: Footer
		},
		loggedIn: {
			header: LoggedInHeader,
			footer: Footer
		}
	};
};

module.exports = uiConfig;
