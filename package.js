Package.describe({
	name: "mondora:connect-with",
	summary: "Connect other oauth accounts with an existing one",
	version: "0.1.2",
	git: "https://github.com/mondora/mondora-connect-with.git"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@0.9.0");
	// Server dependencies
	api.use("oauth", "server");
	api.use("oauth-encryption", "server", {weak: true});
	// Client dependencies
	api.use("oauth", "client");
	api.use("accounts-oauth", "client");
	// Package files
	api.addFiles("server.js", "server");
	api.addFiles("client.js", "client");
});

Package.onTest(function (api) {
	api.use("underscore");
	api.use("tinytest");
	api.use("oauth");
	api.use("accounts-password");
	api.use("accounts-google");
	api.use("mondora:connect-with");
	// Test files
	api.addFiles("server-tests.js", "server");
	api.addFiles("client-tests.js", "client");
});
