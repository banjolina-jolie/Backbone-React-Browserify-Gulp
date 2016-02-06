var React = require('react/addons');
var ProfileEditSection = require('./ProfileEditSection.jsx');

var sectionMapper = {
    personal: {
        title: 'Personal',
        sections: ['basic','bio', 'change-password']
    },
    experience: {
        title: 'Professional',
        sections: ['experience']
    },
    payments: {
        title: 'Payment',
        sections: ['payments', 'rate']
    }
};

var ProfileEditBase = React.createClass({
    renderLeftBarPrimaries: function (primary) {
        return _.map(sectionMapper, function (val, key) {
            var classes = primary === key ? 'active-primary' : '';
            return <li key={key} ><a className={classes} href={'/account/'+key}>{val.title}</a></li>;
        }.bind(this));
    },
    render: function () {
        var primary = this.props.primary || 'personal';
        var secondary = sectionMapper[primary].sections[0];

        if (this.props.section) {
            _.each(sectionMapper, function (val, key, obj) {
                if (_.contains(val.sections, this.props.section)) {
                    primary = key;
                    secondary = this.props.section;
                }
            }.bind(this));
        }

        return (
	        <section className="profile-edit">
	            <div className="container no-padding">
	                <div className="row mb20">
                        <h2 className="">Account</h2>
                    </div>
                    <div className="row">
                        <div className="col-xs-3 profile-edit-sections">
                            <ul>
                                { this.renderLeftBarPrimaries(primary) }
                            </ul>
                        </div>

                        <div className="col-xs-9 profile-edit-body no-padding">
                            <ProfileEditSection user={this.props.user} primary={primary} secondary={secondary} />
                        </div>

                    </div>
	            </div>
	        </section>
        );
    }
});

module.exports = ProfileEditBase;
