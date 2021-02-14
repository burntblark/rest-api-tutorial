const TreatmentsModel = require('../models/treatments.model');
const LegsModel = require('../models/legs.model');

exports.insert = async (req, res) => {
    const { id } = req.params;

    // Make sure treatment exists
    const treatment = await TreatmentsModel.findById(id);

    if(!treatment) {
        // do something
    }

    await LegsModel.createLeg(treatment, req.body)
        .then((result) => {
            res.status(201).send({ id: result._id });
        }).catch(e => res.status(400).send(e));

};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    LegsModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.getById = (req, res) => {
    LegsModel.findById(req.params.userId).populate('lines')
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    LegsModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    LegsModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        });
};