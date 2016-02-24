'use strict';

let React = require('react');
let Store = require('../stores/Store');
let Actions = require('../actions/Actions');

let HeaderView = React.createClass({
    _getState() {
        return {
            user: Store.getCurrentUser()
        }
    },
    _updateState() {
        this.setState(this._getState);
    },
    getInitialState() {
        return this._getState();
    },
    componentWillUnmount() {
        let Store = require('../stores/Store');
        Store.removeSetCurrentUserListener(this._updateState);
    },
    componentDidMount() {
        let Store = require('../stores/Store');
        Store.addSetCurrentUserListener(this._updateState);
        let avatar = React.findDOMNode(this.refs.avatar);

        if (avatar) {
            this.state.user.profilePic(avatar);
        }
    },
    componentDidUpdate() {
        let avatar = React.findDOMNode(this.refs.avatar);

        if (avatar) {
            this.state.user.profilePic(avatar);
        }
    },
    render() {
        let right;
        if (this.state.user.isFetched) {
            let right = (this.state.user.id ? this.renderLogged() : this.renderNotLogged());
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
    renderLogged() {
        let links = ['account', 'logout'];

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
    renderNotLogged() {
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

