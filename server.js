/////////////////////////////
// OAuth related functions //
/////////////////////////////

var OAuthEncryption = Package["oauth-encryption"] && Package["oauth-encryption"].OAuthEncryption;

var pinEncryptedFieldsToUser = function (serviceData, userId) {
	_.each(_.keys(serviceData), function (key) {
		var value = serviceData[key];
		if (OAuthEncryption && OAuthEncryption.isSealed(value)) {
			value = OAuthEncryption.seal(OAuthEncryption.open(value), userId);
		}
		serviceData[key] = value;
	});
};

var addOauthService = function (user, options) {
	check(options.oauth, {
		credentialToken: String,
		// When an error occurs while retrieving the access token, we store
		// the error in the pending credentials table, with a secret of
		// null. The client can call the login method with a secret of null
		// to retrieve the error.
		credentialSecret: Match.OneOf(null, String)
	});
	// Retrieve the pending credential object
	var result = OAuth.retrieveCredential(options.oauth.credentialToken, options.oauth.credentialSecret);
	if (!result) {
		// OAuth credentialToken is not recognized, which could be either
		// because the popup was closed by the user before completion, or
		// some sort of error where the oauth provider didn't talk to our
		// server correctly and closed the popup somehow.
		throw new Meteor.Error("No matching login attempt found");
	}
	if (result instanceof Error) {
		// We tried to login, but there was a fatal error. Report it back
		// to the user.
		throw result;
	}
	var serviceName = result.serviceName;
	var serviceData = result.serviceData;
	// Only allow external (oauth) services
	if (serviceName === "password" || serviceName === "resume") {
		throw new Meteor.Error("Can't use updateOrCreateUserFromExternalService with internal service " + serviceName);
	}
	// The user must not have used the service already
	if (user.services[serviceName]) {
		throw new Meteor.Error(serviceName + " already used");
	}
	// The service must provide an `id` field
	if (!_.has(serviceData, "id")) {
		throw new Meteor.Error("Service data for service " + serviceName + " must include id");
	}
	// If a user with this service user-id already exists, throw an error
	// XXX We can consider instead merging the two accounts
	var selector = {};
	var selectorKey = "services." + serviceName + ".id";
	selector[selectorKey] = serviceData.id;
	if (Meteor.users.findOne(selector)) {
		throw new Meteor.Error("User already exists");
	}

	pinEncryptedFieldsToUser(serviceData, user._id);
	
	// Add the service to the user object
	var modifier = {
		$set: {}
	};
	var serviceKey = "services." + serviceName;
	modifier.$set[serviceKey] = serviceData;
	Meteor.users.update(user._id, modifier);
	return user._id;
};



////////////////////////////////
// Password related functions //
////////////////////////////////

var addPasswordService = function (user, options) {
	// TODO wait for https://github.com/meteor/meteor/pull/2271 to resolve
};



//////////////////////////////
// `addLoginService` method //
//////////////////////////////

Meteor.methods({
	addLoginService: function (options) {
		var user = Meteor.user();
		// Ensure the user is logged in
		if (!user) {
			throw new Meteor.Error("Login required");
		}
		// Check arguments
		try {
			// Wrapping this in a try/catch block to avoid throwing
			// a Match.Error, which gets logged on the server console,
			// while a Meteor.Error doesn't
			check(options, Object);
		} catch (e) {
			throw new Meteor.Error("Match failed");
		}
		// Adding an oauth service
		if (options.oauth) {
			return addOauthService(user, options);
		}
		// Adding the password service
		if (options.password) {
			return addPasswordService(user, options);
		}
		throw new Meteor.Error("Bad request");
	}
});
