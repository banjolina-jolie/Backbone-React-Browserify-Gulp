var React = require('react/addons');
var Store = require('../../stores/Store');

var ExperienceView = React.createClass({

	mixins: [React.addons.LinkedStateMixin],

    _getState: function () {
        var state = $.extend(true, {}, this.props.user.get('meta'));
        state.markers = {};
        return state;
    },
    _updateState: function () {
        this.setState(this._getState());
    },
    getInitialState: function () {
        return this._getState();
    },
    componentDidMount: function () {
        Store.addSaveProfileListener(this._onSaveProfile);
        Store.addSetCurrentUserListener(this._updateState);
        $('select').select2();
    },
    componentWillUnmount: function () {
        Store.removeSaveProfileListener(this._onSaveProfile);
        Store.removeSetCurrentUserListener(this._updateState);
    },
    render: function () {
        return (
            <form className="mb20 no-padding">
                <div className="form-group">
                    <label>Job Title</label>
                    <div className={'input-group input-with-label no-padding ' + this.state.markers.jobTitle}>
                        <input valueLink={this.linkState('jobTitle')} type="text" className="form-control" name="jobTitle" id="jobTitle" placeholder="Job title"/>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
                <div className="form-group">
                    <label>Employer/Institution</label>
                    <div className={'input-group input-with-label no-padding ' + this.state.markers.employer}>
                        <input valueLink={this.linkState('employer')} type="text" className="form-control" name="employer" id="employer" placeholder="Employer/Institution"/>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
            </form>
        );
    },
    _onSaveProfile: function () {
        var markers = {};
        var meta = this.props.user.get('meta');
        meta.employer = this.state.employer;
        meta.jobTitle = this.state.jobTitle;

        if (!meta.employer) {
            markers.employer = 'has-error';
        }
        if (!meta.jobTitle) {
            markers.jobTitle = 'has-error';
        }
        if (!_.isEmpty(markers)) {
            this.props.user.validationError = true;
            this.setState({ markers: markers }, function () {
                $('.has-error input').off();
                $('.has-error input').on('keyup', function () {
                    $(this).parents('.has-error').removeClass('has-error').off();
                });
            });
        } else {
            this.props.user.validationError = false;
            this.setState({ markers: {}}, function () {
                this.props.user.set({ meta: meta });
            }.bind(this));
        }
    }
});

module.exports = ExperienceView;
