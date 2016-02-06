var React = require('react');
var LoginModal = require('./LoginModal.jsx');
var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

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
        var right;
        if (this.state.user.isFetched) {
            var right = (this.state.user.id ? this.renderLogged() : this.renderNotLogged());
        }

        return (
			<nav className="navbar navbar-default" role="navigation">
                <div className="container no-padding">
                    <div className="fl fs28">
                        <a className="brand" href="/">
                            <img className="logo mr10" src="/images/logo.png" alt="okpitch logo"/>
                            GoodLife
                        </a>
                    </div>
                    <div>
                        {right}
                    </div>
                </div>
                {
                    // <LoginModal user={this.state.user} />
                }
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
                        {this.state.user.get('first_name')}
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
            <div className="fr">
                <ul className="navbar-buttons">
                    <li><a onClick={this.FBLogin} className="btn btn-default btn-outline btn-white xs-border-blue">Log in <i className="fa fa-facebook-square ml4"></i></a></li>
                </ul>
            </div>
        );
    },
    renderHeaderItems: function () {
        return (
            <ul className="nav navbar-nav navbar-links">
            </ul>
        );
    },
    FBLogin: function () {
        FB.login(function () {
            FB.api('/me', {fields: 'first_name, last_name, picture, friends'}, function (user) {
                user.profile_pic = user.picture.data.url;
                delete user.picture;
                currentUser.set(user);
                Actions.setCurrentUser(currentUser);
            });
        });
    }
});

module.exports = HeaderView;

