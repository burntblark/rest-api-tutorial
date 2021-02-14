const AccountModel = require('../models/accounts.model');
const TransactionMondel = require('../models/transactions.model');

exports.insert = async (req, res) => {
    const { balance } = req.body;

    await AccountModel.createAccount(req.body)
        .then((result) => {
            res.status(201).send({ id: result._id });
        }).catch(error => {
            console.log(error.name);
            res.status(400).send(error);
        });

    if (balance > 0) {
        TransactionMondel.createTransaction({
            ref: (new Date).getTime().toString(),
            amount: balance,
            narration: 'Opening balance',
            date: Date.now()
        })
    }
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
    
    AccountModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    AccountModel.findById(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    AccountModel.patchUser(req.params.id, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    AccountModel.removeById(req.params.id)
        .then((result) => {
            res.status(204).send({});
        });
};