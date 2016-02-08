var React = require('react/addons');
var Actions = require('../../actions/Actions');
var Store = require('../../stores/Store');

var EventsListView = React.createClass({
    _getState: function () {
        return {
            events: _.sortBy(this.props.user.get('events'), function(evt) {
                return evt.startTime;
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
    renderEvents: function () {
        var currentUser = this.props.user;

        if (!this.props.user.isActive()) {
            return (
                <tr>
                    <td colSpan="5">
                        <div className="events-list-empty mt40 mb20">
                            This feature is currently disabled while your account is pending activation. Thank you for your patience!
                        </div>
                    </td>
                </tr>
            );
        }

        if (!this.state.events.length) {
            return (
                <tr>
                    <td colSpan="5">
                        <div className="events-list-empty mt40 mb20">
                            Your event list is empty
                        </div>
                        { this.renderAction() }
                    </td>
                </tr>
            );
        }

        return this.state.events.map(function(evt) {
            return (
                <tr key={evt.id}>
                    <td className="name">
                        {/*<div className="avatar" style={{backgroundImage: 'url(https://'}}></div>*/}
                        { /*name*/ }
                    </td>
                    <td className="start-time">
                        {evt.formattedStartTime}
                    </td>
                    <td className="start-time">{Math.ceil(evt.duration / 60)} min</td>
                    <td className="event-state">{evt.displayState}</td>
                    <td className="cta">
                        <a className="fr pr10" href={'/events/' + evt.id}>view</a>
                    </td>
                </tr>
            );
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <table className="events-list">
                    <thead>
                        <tr>
                            <th onClick={this._sortTable} data-attr={'name'} className="name">Name <i className="fa fa-caret-down"></i></th>
                            <th onClick={this._sortTable} data-attr={'startTime'} className="start-time">Start Date <i className="fa fa-caret-down"></i></th>
                            <th onClick={this._sortTable} data-attr={'duration'} className="evt-duration">Duration <i className="fa fa-caret-down"></i></th>
                            <th onClick={this._sortTable} data-attr={'state'} className="status start-time">Status <i className="fa fa-caret-down"></i></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr></tr>
                        { this.renderEvents() }
                    </tbody>
                </table>
            </div>
        );
    },
    _startSession: function () {
        Backbone.history.navigate('/users/'+this.props.user.get('username'), {trigger: true});
    },
    _sortTable: function (e) {
        var partner = this.props.user.partnerRole();
        var attr = $(e.currentTarget).data('attr');
        var events = $.extend([], this.state.events);

        if (this.sortBy === attr) {
            this.reverseOrder = !this.reverseOrder;
        } else {
            this.reverseOrder = false;
            this.sortBy = attr;
        }

        if (attr === 'username' || attr === 'name') {
            events = _.sortBy(events, function(evt) {
                return (evt[partner][attr] && evt[partner][attr].toLowerCase()) || evt[partner].email.toLowerCase();
            }.bind(this));
        } else if (attr === 'state' ) {
            events = _.sortBy(events, function(evt) {
                return evt.displayState;
            }.bind(this));
        } else {
            events = _.sortBy(events, function(evt) {
                return evt[attr];
            }.bind(this));
        }
        if (this.reverseOrder) { events.reverse(); }
        
        this.setState({events: events});
    }
});

module.exports = EventsListView;
