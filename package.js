Package.describe({
	summary: "Connect other oauth accounts with an existing one",
	version: "0.1.0",
	git: "https://github.com/mondora/mondora-connect-with.git"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@0.9.0");

	// Server dependencies
	api.use("oauth", "server");
	api.use("oauth-encryption", "server");

	// Client dependencies
	api.use("oauth", "client");
	api.use("accounts-oauth", "client");
	api.use("facebook", "client");
	api.use("google", "client");

	api.addFiles("server.js", "server");
	api.addFiles("client.js", "client");
});
