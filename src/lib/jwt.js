// Import the `sign` and `verify` functions from the `jsonwebtoken` library
const { sign, verify } = require('jsonwebtoken');

// Export an object containing the `sign` and `verify` functions, which use the `jsonwebtoken` library and the secret key to create and verify JSON Web Tokens (JWTs)
module.exports = {
	// The `sign` function takes a payload (e.g. user ID, email, etc.) and returns a signed JWT
	sign: (payload) => sign(payload, process.env.JWTSECRETKEY),
	// The `verify` function takes a JWT and verifies its signature, returning the decoded payload if the signature is valid
	verify: (token) => verify(token, process.env.JWTSECRETKEY),
};