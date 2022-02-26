const approuter = require("@sap/approuter");
const jwtDecode = require("jwt-decode");

let ar = approuter();

ar.beforeRequestHandler.use("/user", (req, res) => {
    if (!req.user) {
        res.statusCode = 403;
        res.end("Missing JWT Token");
    }

    res.statusCode = 200;
    let decodedJWTToken = jwtDecode(req.user.token.accessToken);

    let aRoleCollections;
    try {
        aRoleCollections = decodedJWTToken['xs.system.attributes']['xs.rolecollections'];
    } catch (error) {
        aRoleCollections = [];
    }

    res.end(JSON.stringify({
        id: decodedJWTToken.user_name,
        rolecollections: aRoleCollections,
        scopes: decodedJWTToken.scope,
        given_name: decodedJWTToken.given_name,
        family_name: decodedJWTToken.family_name,
        email: decodedJWTToken.email,
        origin: decodedJWTToken.origin
    }));
});

ar.start();