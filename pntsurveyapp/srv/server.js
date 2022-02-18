/*const proxy = require('@sap/cds-odata-v2-adapter-proxy')
const cds = require('@sap/cds')

const ORIGINS = { 'https://example.com': 1 }
cds.on('bootstrap', async (app) => {
    app.use(proxy())
    app.use((req, res, next) => {
        const { origin } = req.headers
        // standard request
        if (origin && ORIGINS[origin]) res.set('access-control-allow-origin', origin)
        // preflight request
        if (origin && ORIGINS[origin] && req.method === 'OPTIONS')
            return res.set('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE').end()
        next()
    })
})

//  cds.on('bootstrap', app => app.use(proxy()))
module.exports = cds.server*/

"use strict";

const cds = require("@sap/cds");
const cors = require("cors");

cds.on("bootstrap", app => app.use(cors()));

module.exports = cds.server;