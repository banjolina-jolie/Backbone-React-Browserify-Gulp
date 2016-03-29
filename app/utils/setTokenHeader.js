'use strict';

module.exports = (token) => {
    $.ajaxSetup({
        beforeSend: (xhr, req) => {
            if (req.url.slice(0, apiBaseUrl.length) === apiBaseUrl) {
                xhr.setRequestHeader('x-session-token', token);
            }
        }
    });
};
