var Backbone = require('backbone');

var Mail = Backbone.Model.extend({
    constructor: function (mail) {
        mail = mail || '';
        this.mail = mail.trim();
        Backbone.Model.apply(this, arguments);
    },
    validate: function () {
        if(this.mail.length == 0) {
            return Mail.empty;
        }
        var splittedAt = this.mail.split('@');
        if(splittedAt.length < 2) {
            return Mail.noAt;
        } else if (splittedAt.length == 2 && (splittedAt[0].length==0 || splittedAt[1].length==0)) {
            return Mail.atInMiddle;
        } else if (splittedAt.length > 2) {
            return Mail.tooManyAts;
        }
        if (!_.contains(splittedAt[1], '.')) {
            return Mail.noTLD;
        }
    },
    toString: function () {
        return this.mail;
    }
});
Mail.empty = 'E-mail address cannot be empty';
Mail.noAt = 'E-mail address has to contain \'@\' character';
Mail.tooManyAts = 'E-mail address has to contain exactly one \'@\' character';
Mail.atInMiddle = 'E-mail should contain \'@\' character somewhere in middle';
Mail.noTLD = 'E-mail needs top level domain';

module.exports = Mail;
