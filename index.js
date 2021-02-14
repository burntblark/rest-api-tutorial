const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');
const WalletsRouter = require('./wallets/routes.config');
const AccountsRouter = require('./accounts/routes.config');
const TreatmentsRouter = require('./treatments/routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());

AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
AccountsRouter.routesConfig(app);
WalletsRouter.routesConfig(app);
TreatmentsRouter.routesConfig(app);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    if (['ValidationError', 'Error'].includes(err.name)) {
        return res.status(400).send(err);
    }
    res.status(500).send('Something broke!');
});

app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
