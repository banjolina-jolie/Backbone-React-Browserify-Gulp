var Backbone = require('backbone');

var EventModel = Backbone.Model.extend({
    defaults: function () {
        return {
            guide: '',
            members: []
        };
    }
});

module.exports = EventModel;
