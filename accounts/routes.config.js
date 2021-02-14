const AccountsController = require('./controllers/accounts.controller');
const TransactionsController = require('./controllers/accounts.controller');
const GroupsController = require('./controllers/groups.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/accounts', [
        AccountsController.insert
    ]);
    app.get('/accounts', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        AccountsController.list
    ]);
    app.get('/accounts/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        // PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        AccountsController.getById
    ]);
    app.patch('/accounts/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        AccountsController.patchById
    ]);
    app.delete('/accounts/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        AccountsController.removeById
    ]);
    app.post('/transactions', [
        TransactionsController.insert
    ]);
    app.get('/transactions', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        TransactionsController.list
    ]);
    app.get('/transactions/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        TransactionsController.getById
    ]);
    app.patch('/transactions/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        TransactionsController.patchById
    ]);
    app.delete('/transactions/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        TransactionsController.removeById
    ]);

    app.post('/groups', [
        GroupsController.insert
    ]);
    app.get('/groups', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        GroupsController.list
    ]);
    app.get('/groups/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        GroupsController.getById
    ]);
    app.patch('/groups/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        GroupsController.patchById
    ]);
    app.delete('/groups/:id', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        GroupsController.removeById
    ]);
};
