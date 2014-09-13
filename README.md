[![Build Status](https://travis-ci.org/mondora/mondora-connect-with.svg?branch=master)](https://travis-ci.org/mondora/mondora-connect-with)
#connect-with
Meteor package to connect multiple OAuth providers to a
single user account.

The user, after connecting multiple services (e.g. Google
and Facebook), can then login to his account using whichever
one he wants.

##Example
Setup:
```bash
# Add google and facebook authentication
meteor add accounts-google accounts-facebook
# Add this package
meteor add mondora:connect-with
```
Code:
```js
// The user must be already logged in with one service
// (in this example, google)
if (Meteor.user()) {
	Meteor.connectWith("facebook");
}
```
The customary oauth popup will open and the user will be
prompted to login to facebook. When the popup closes, the
google and facebook services will both be connected to the
user account.

##API

####Meteor.connectWith(serviceName, [options], [callback])
#####Arguments
* `serviceName` **string** *required*: the name of the
  service to connect (e.g. "facebook")
* `options` **object** *optional*: see
  [docs.meteor.com](http://docs.meteor.com/#meteor_loginwithexternalservice)
  for details
* `callback` **function** *optional*: called with no arguments on success,
  or with a single Error argument on failure.

##Future plans
All oauth services are supported. In the future I'd like to
add the possibility to set a pair of credentials (username
or email, and password) to an existing account connected via
oauth. To avoid polluting the package with code copy/pasted
from the `accounts-password` core package, I'm waiting for
[this pull request](https://github.com/meteor/meteor/pull/2271)
to resolve before adding the functionality.
