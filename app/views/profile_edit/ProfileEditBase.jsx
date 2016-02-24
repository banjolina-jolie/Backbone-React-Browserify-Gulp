'use strict';

let React = require('react/addons');
let ProfileEditSection = require('./ProfileEditSection.jsx');

let sectionMapper = {
    personal: {
        title: 'Personal',
        sections: ['basic','bio', 'change-password']
    },
    payments: {
        title: 'Payment',
        sections: ['payments', 'rate']
    }
};

let ProfileEditBase = React.createClass({
    renderLeftBarPrimaries(primary) {
        return _.map(sectionMapper, (val, key) => {
            let classes = primary === key ? 'active-primary' : '';
            return <li key={key} ><a className={classes} href={'/account/'+key}>{val.title}</a></li>;
        });
    },
    render() {
        let primary = this.props.primary || 'personal';
        let secondary = sectionMapper[primary].sections[0];

        if (this.props.section) {
            _.each(sectionMapper, (val, key, obj) => {
                if (_.contains(val.sections, this.props.section)) {
                    primary = key;
                    secondary = this.props.section;
                }
            });
        }

        return (
	        <section className="profile-edit">
	            <div className="container no-padding">
                    <div className="row">
                        <div className="col-xs-3 profile-edit-sections">
                            <ul>
                                { this.renderLeftBarPrimaries(primary) }
                            </ul>
                        </div>

                        <div className="col-xs-9 profile-edit-body no-padding">
                            <ProfileEditSection primary={primary} secondary={secondary} />
                        </div>

                    </div>
	            </div>
	        </section>
        );
    }
});

module.exports = ProfileEditBase;
