var React = require('react/addons');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');
var meetingStates = require('../../utils/MeetingConstants.json');

var MeetingsListView = React.createClass({
    _getState: function () {
        return {
            mtgs: _.sortBy(this.props.user.get('meetings'), function(mtg) {
                return mtg.startTime;
            })
        };
    },
    _updateState: function () {
        this.setState(this._getState());
    },
    getInitialState: function () {
        return this._getState();
    },
    componentDidMount: function () {
        // $('[data-toggle="tooltip"]').tooltip();
        Store.addSetCurrentUserListener(this._updateState);
    },
    componentWillUnmount: function() {
        Store.removeSetCurrentUserListener(this._updateState);
    },
    renderAction: function () {
        if (this.props.user.isPresenter()) {
            return (
                <button onClick={this._startSession} className="btn btn-default btn-outline btn-grey ps4 block ma">Start a session</button>
            );
        }
    },
    renderMeetings: function () {
        var currentUser = this.props.user;
        var clientRole = currentUser.isListener() ? 'presenter' : 'listener';

        if (!this.props.user.isActive()) {
            return (
                <tr>
                    <td colSpan="5">
                        <div className="meetings-list-empty mt40 mb20">
                            This feature is currently disabled while your account is pending activation. Thank you for your patience!
                        </div>
                    </td>
                </tr>
            );
        }

        if (!this.state.mtgs.length) {
            return (
                <tr>
                    <td colSpan="5">
                        <div className="meetings-list-empty mt40 mb20">
                            Your meeting list is empty
                        </div>
                        { this.renderAction() }
                    </td>
                </tr>
            );
        }

        return this.state.mtgs.map(function(mtg) {
            return (
                <tr key={mtg.id}>
                    <td className="name">
                        {/*<div className="avatar" style={{backgroundImage: 'url(https://s3.amazonaws.com/okprecious/' + mtg[clientRole].id + '/profile_pic)'}}></div>*/}
                        { this.renderListName(mtg, clientRole) }
                    </td>
                    <td className="start-time">
                        {mtg.formattedStartTime}
                    </td>
                    <td className="start-time">{Math.ceil(mtg.duration / 60)} min</td>
                    <td className="meeting-state">{mtg.displayState}</td>
                    <td className="cta">
                        <a className="fr pr10" href={'/meetings/' + mtg.id}>view</a>
                        { this.renderMailIcon(mtg) }
                    </td>
                </tr>
            );
        }.bind(this));
    },
    renderListName: function (mtg, clientRole) {
        if (mtg[clientRole].name) {
            var name = mtg[clientRole].name;
            if (mtg[clientRole].company) {
                name += ' - ' + mtg[clientRole].company;
            }
            return (
                <span>{name}</span>
            );
        } else {
            // mtg[clientRole] is listener's email
            return (
                <span className="">{mtg[clientRole]}</span>
            );
        }
    },
    render: function () {
        return (
            <div>
                <table className="meetings-list">
                    <thead>
                        <tr>
                            <th onClick={this._sortTable} data-attr={'name'} className="name">Name <i className="fa fa-caret-down"></i></th>
                            <th onClick={this._sortTable} data-attr={'startTime'} className="start-time">Start Date <i className="fa fa-caret-down"></i></th>
                            <th onClick={this._sortTable} data-attr={'duration'} className="mtg-duration">Duration <i className="fa fa-caret-down"></i></th>
                            <th onClick={this._sortTable} data-attr={'state'} className="status start-time">Status <i className="fa fa-caret-down"></i></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr></tr>
                        { this.renderMeetings() }
                    </tbody>
                </table>
            </div>
        );
    },
    renderMailIcon: function (mtg) {
        if (mtg['new_message_for_' + this.props.user.role()] && mtg.state < meetingStates.ENDED_NO_FEEDBACK) {
            return (
                <i data-toggle="tooltip" className="mail-icon fa fa-envelope" title="unread messages"></i>
            );
        }
    },
    _startSession: function () {
        Backbone.history.navigate('/users/'+this.props.user.get('username'), {trigger: true});
    },
    _sortTable: function (e) {
        var partner = this.props.user.partnerRole();
        var attr = $(e.currentTarget).data('attr');
        var mtgs = $.extend([], this.state.mtgs);

        if (this.sortBy === attr) {
            this.reverseOrder = !this.reverseOrder;
        } else {
            this.reverseOrder = false;
            this.sortBy = attr;
        }

        if (attr === 'username' || attr === 'name') {
            mtgs = _.sortBy(mtgs, function(mtg) {
                return (mtg[partner][attr] && mtg[partner][attr].toLowerCase()) || mtg[partner].email.toLowerCase();
            }.bind(this));
        } else if (attr === 'state' ) {
            mtgs = _.sortBy(mtgs, function(mtg) {
                return mtg.displayState;
            }.bind(this));
        } else {
            mtgs = _.sortBy(mtgs, function(mtg) {
                return mtg[attr];
            }.bind(this));
        }
        if (this.reverseOrder) { mtgs.reverse(); }
        
        this.setState({mtgs: mtgs});
    }
});

module.exports = MeetingsListView;
