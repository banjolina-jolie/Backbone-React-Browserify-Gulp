var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');
var Footer = require('./Footer.jsx');
var Header = require('./Header.jsx');


var responseFacebook = function (response) {
  console.log(response);
};

var LandingView = React.createClass({
    getInitialState() {
        return {
            user: Store.getCurrentUser()
        };
    },
    componentDidMount: function () {

    },
    render: function () {
        return (
            <div className="landing">
                {
                    //<Header />
                }

                <section className="intro">
                    <div className="container dashboard">


                    </div>
                </section>

                { this.renderLoginBtn() }

            </div>
        );
    },
    renderLoginBtn: function () {
        if (!this.state.user.id) {
            return (
                <button onClick={this.checkLoginState}>Log in</button>
            );
        }
    },
    checkLoginState: function () {
        FB.login(function () {
            FB.api('/me', {fields: 'name, picture, friends'}, function (user) {
                user.profile_pic = user.picture.data.url;
                delete user.picture;
                currentUser.set(user);
                Actions.setCurrentUser(currentUser);
            });
        });
    }
});

module.exports = LandingView;

