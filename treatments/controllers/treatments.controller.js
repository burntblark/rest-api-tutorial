const TreatmentModel = require('../models/treatments.model');

exports.insert = async (req, res, next) => {
    await TreatmentModel.createTreatment(req.body)
        .then((result) => {
            res.status(201).send({ id: result._id });
        }).catch(next);
};

exports.list = (req, res, next) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    TreatmentModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        }).catch(next);
};

exports.getById = (req, res, next) => {
    TreatmentModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        }).catch(next);
};
exports.patchById = (req, res, next) => {
    TreatmentModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        }).catch(next);
};

exports.removeById = (req, res, next) => {
    TreatmentModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        }).catch(next);
};