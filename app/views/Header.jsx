var React = require('react');
var LoginModal = require('./LoginModal.jsx');
var Store = require('../stores/Store');

var HeaderView = React.createClass({
    _getState: function () {
        return {
            user: Store.getCurrentUser()
        }
    },
    _updateState: function () {
        this.setState(this._getState);
    },
    getInitialState() {
        return this._getState();
    },
    componentWillUnmount() {
        var Store = require('../stores/Store');
        Store.removeSetCurrentUserListener(this._updateState);
    },
    componentDidMount: function () {
        var Store = require('../stores/Store');
        Store.addSetCurrentUserListener(this._updateState);
        var avatar = React.findDOMNode(this.refs.avatar);

        if (avatar) {
            this.state.user.profilePic(avatar);
        }
    },
    componentDidUpdate: function () {
        var avatar = React.findDOMNode(this.refs.avatar);

        if (avatar) {
            this.state.user.profilePic(avatar);
        }
    },
    render: function () {
        var right = (this.state.user.id ? this.renderLogged() : this.renderNotLogged());

        return (
			<nav className="navbar navbar-default" role="navigation">
                <div className="container no-padding">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand ttn" href="/">
                            <img className="logo" src="/images/logo.png" alt="okpitch logo"/>
                            GoodLife
                        </a>
                    </div>
                    <div className="collapse navbar-collapse navbar-ex1-collapse">
                        <ul className="nav navbar-nav navbar-links">

                            { this.renderHeaderItems() }

                        </ul>

                        {right}
                    </div>
                </div>
                <LoginModal user={this.state.user} />
            </nav>
        );
    },
    renderLogged: function () {
        var links = ['account', 'history', 'logout'];

        return (
            <div className="dropdown user">
                <a className="dropdown-toggle fr p0i" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <div className="avatar" id="header-avatar" ref="avatar"></div>
                    <span className="firstName">
                        {this.state.user.get('name')}
                        <i className="ml4 glyphicon glyphicon-triangle-bottom"></i>
                    </span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {links.map(function (link) {
                        return (
                            <li key={link}><a href={'/' + link}>{link}</a></li>
                        );
                    })}
                </ul>
            </div>
        );
    },
    renderNotLogged: function () {
        return (
            <div>
                <ul className="nav navbar-nav navbar-right navbar-buttons">
                    <li><a data-toggle="modal" data-target="#loginModal" className="btn btn-default btn-outline btn-white xs-border-blue">Sign in</a></li>
                    <li><a href="/register/step1" className="btn btn-default btn-solid btn-blue">Register</a></li>
                </ul>
            </div>
        );
    },
    renderHeaderItems: function () {
        return (
            <ul className="nav navbar-nav navbar-links">
            </ul>
        );
    }
});

module.exports = HeaderView;

