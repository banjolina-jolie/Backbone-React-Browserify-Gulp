var React = require('react');
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
    getInitialState: function () {
        return this._getState();
    },
    componentWillUnmount: function () {
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
                    <div className="fl">
                        <a className="brand" href="/">
                            <div className="brand-text dib">AppName</div>
                        </a>
                    </div>

                    {right}

                </div>
            </nav>
        );
    },
    renderLogged: function () {
        var links = ['account', 'logout'];

        return (
            <div className="dropdown user">
                <a className="dropdown-toggle fr p0i mt8" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                    <li className="fr ml10"><a data-toggle="modal" data-target="#registerModal" className="btn btn-default btn-solid btn-blue">Register</a></li>
                    <li className="fr"><a data-toggle="modal" data-target="#loginModal" className="btn btn-default btn-outline btn-white xs-border-blue">Sign in</a></li>
                </ul>
            </div>
        );
    }
});

module.exports = HeaderView;

