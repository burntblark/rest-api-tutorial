const GroupModel = require('../models/groups.model');

exports.insert = (req, res) => {
    GroupModel.createGroup(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch(error => {
            console.log(error.name);
            res.status(400).send(error);
        });
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
    GroupModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    GroupModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    GroupModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    GroupModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};