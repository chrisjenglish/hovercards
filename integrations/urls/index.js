var _   = require('underscore');
var url = require('url');

var hostnames_to_urls = {};

// HACK Can't use require.context because of mocha and node
_.each([require('../imgur/urls'),
        require('../instagram/urls'),
        require('../reddit/urls'),
        require('../soundcloud/urls'),
        require('../twitter/urls'),
        require('../youtube/urls')], function(api_urls) {
	_.each(api_urls.hostnames_parsed, function(hostname_parsed) {
		hostnames_to_urls[hostname_parsed] = hostnames_to_urls[hostname_parsed] || [];
		hostnames_to_urls[hostname_parsed].push(api_urls);
	});
});

var urls = {};

urls.parse = function(url_string) {
	if (_.isEmpty(url_string)) {
		return;
	}
	var url_object;
	try {
		url_object = url.parse(url_string, true, true);
	} catch (e) {
		if (e instanceof URIError) {
			return;
		}
		throw e;
	}

	if (url_object.hostname === 'l.facebook.com') {
		return urls.parse(url_object.query.u);
	}
	return _.chain(hostnames_to_urls[url_object.hostname]).invoke('parse', url_object).compact().first().value();
};

urls.represent = function(identity, comment) {
	return require('../' + identity.api + '/urls').represent(identity, comment);
};

urls.print = function(identity, comment) {
	if (!identity) {
		return identity;
	}
	return (urls.represent(identity, comment) || [])[0];
};

module.exports = urls;
