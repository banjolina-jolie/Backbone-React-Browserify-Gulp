'use strict';

let Backbone = require('backbone');

let EventModel = Backbone.Model.extend({
    defaults() {
        return {
            guide: '',
            members: []
        };
    }
});

module.exports = EventModel;
