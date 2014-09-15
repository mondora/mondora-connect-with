/*
 *	mondora:connect-with - registers the `addLoginService` method
 */
Tinytest.add("mondora:connect-with - registers the `addLoginService` method", function (test) {
	var methods = _.keys(Meteor.server.method_handlers);
	test.isTrue(_.contains(methods, "addLoginService"));
});

/*
 *	mondora:connect-with - registers the `listLoginServices` method
 */
Tinytest.add("mondora:connect-with - registers the `listLoginServices` method", function (test) {
	var methods = _.keys(Meteor.server.method_handlers);
	test.isTrue(_.contains(methods, "listLoginServices"));
});

/*
 *	Setup methods
 */
var pendingCredential = {
	"_id": "1234",
	"key": "1234",
	"credential": {
		"serviceName": "google",
		"serviceData": {
			"accessToken": "1234",
			"expiresAt": 1500000000000,
			"id": "1234",
			"email": "paolo.scanferla@mondora.com",
			"verified_email": true,
			"name": "Paolo Scanferla",
			"given_name": "Paolo",
			"family_name": "Scanferla",
			"picture": "http://goo.gl/UEjSp8",
			"locale": "en",
			"gender": "male"
		},
		"options": {
			"profile": {
				"name": "Paolo Scanferla"
			}
		}
	},
	"credentialSecret": "1234",
	"createdAt": "2014-01-01T00:00:00.000Z"
};

Meteor.methods({
	addUser: function () {
		Meteor.users.remove({});
		Accounts.createUser({
			username: "pscanf",
			password: "pscanf"
		});
	},
	addPendingCredentials: function () {
		OAuth._pendingCredentials.remove({});
		OAuth._pendingCredentials.insert(pendingCredential);
	},
	checkServiceData: function () {
		return _.isEqual(Meteor.user().services.google, pendingCredential.credential.serviceData);
	}
});
