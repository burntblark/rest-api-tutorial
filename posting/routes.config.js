const EntriesController = require('./controllers/entries.controller');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/entries', [
        EntriesController.insert
    ]);
    app.get('/entries', [
        ValidationMiddleware.validJWTNeeded,
        EntriesController.list
    ]);
    app.get('/entries/:id', [
        ValidationMiddleware.validJWTNeeded,
        EntriesController.getById
    ]);
    app.patch('/entries/:id', [
        ValidationMiddleware.validJWTNeeded,
        EntriesController.patchById
    ]);
    app.delete('/entries/:id', [
        ValidationMiddleware.validJWTNeeded,
        EntriesController.removeById
    ]);
};
