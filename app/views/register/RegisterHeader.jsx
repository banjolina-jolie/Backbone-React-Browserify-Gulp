var React = require('react');

var RegisterHeaderView = React.createClass({
    render: function () {
        return (
            <nav className="navbar navbar-default" role="navigation">
	            <div className="container">
	                <div className="navbar-header">
	                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
	                        <span className="sr-only">Toggle navigation</span>
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                        <span className="icon-bar"></span>
	                    </button>
	                    <a className="navbar-brand ttn" href="/">
	                        <img className="logo" src="/images/logo.png" alt="okpitch logo"/>
	                        OKPitch
	                    </a>
	                </div>

	                <div className="collapse navbar-collapse navbar-ex1-collapse">
	                    <ul className="nav navbar-nav navbar-links">
	                        <li><a href="/about">About</a></li>
	                    </ul>
	                </div>
	            </div>
	        </nav>
        );
    }
});

module.exports = RegisterHeaderView;
