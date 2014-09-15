var next = function (fn) {
	var n = 0;
	return function () {
		var self = this;
		var args = arguments;
		setTimeout(function () {
			fn.apply(self, args);
		}, n++ * 1000);
	};
};

/*
 *	mondora:connect-with - the `addLoginService` method should throw if the caller is not a logged in user
 */
Tinytest.addAsync("mondora:connect-with - the `addLoginService` method should throw if the caller is not a logged in user", next(function (test, done) {
	Meteor.logout(function () {
		Meteor.call("addLoginService", {}, function (error) {
			test.instanceOf(error, Meteor.Error);
			test.equal(error.error, "Login required");
			done();
		});
	});
}));

/*
 *	mondora:connect-with - the `addLoginService` method should throw if the argument passed to it is not an object
 */
Tinytest.addAsync("mondora:connect-with - the `addLoginService` method should throw if the argument passed to it is not an object", next(function (test, done) {
	Meteor.call("addUser", function () {
		Meteor.loginWithPassword("pscanf", "pscanf", function () {
			Meteor.call("addLoginService", "notAnObject", function (error) {
				test.instanceOf(error, Meteor.Error);
				test.equal(error.error, "Match failed");
				done();
			});
		});
	});
}));

/*
 *	mondora:connect-with - the `addLoginService` method should connect the existing user with the profile returned by the oauth provider
 */
Tinytest.addAsync("mondora:connect-with - the `addLoginService` method should connect the existing user with the profile returned by the oauth provider", next(function (test, done) {
	Meteor.call("addUser", function () {
		Meteor.call("addPendingCredentials", function () {
			Meteor.loginWithPassword("pscanf", "pscanf", function () {
				var credentials = {
					oauth: {
						credentialToken: "1234",
						credentialSecret: "1234"
					}
				};
				Meteor.call("addLoginService", credentials, function (error) {
					test.equal(error, undefined);
					Meteor.call("checkServiceData", function (error, result) {
						test.isTrue(result);
						done();
					});
				});
			});

		});
	});
}));

/*
 *	mondora:connect-with - the `listLoginServices` method should throw if the caller is not a logged in user
 */
Tinytest.addAsync("mondora:connect-with - the `listLoginServices` method should throw if the caller is not a logged in user", next(function (test, done) {
	Meteor.logout(function () {
		Meteor.call("listLoginServices", {}, function (error) {
			test.instanceOf(error, Meteor.Error);
			test.equal(error.error, "Login required");
			done();
		});
	});
}));

/*
 *	mondora:connect-with - the `listLoginServices` method should throw if the argument passed to it is not an object
 */
Tinytest.addAsync("mondora:connect-with - the `addLoginService` method should return the list of login services used by the user", next(function (test, done) {
	Meteor.call("addUser", function () {
		Meteor.call("addPendingCredentials", function () {
			Meteor.loginWithPassword("pscanf", "pscanf", function () {
				var credentials = {
					oauth: {
						credentialToken: "1234",
						credentialSecret: "1234"
					}
				};
				Meteor.call("addLoginService", credentials, function (error) {
					test.equal(error, undefined);
					Meteor.call("listLoginServices", function (error, result) {
						test.equal(error, undefined);
						test.equal(result.sort(), ["password", "google"].sort());
						done();
					});
				});
			});

		});
	});
}));
