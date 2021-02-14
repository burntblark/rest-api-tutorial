const TransactionModel = require('../../accounts/models/transactions.model');
const JournalEntry = require('../../accounts/models/journalEntries.model');

exports.insert = async (req, res, next) => {
    const {
        treatment,
        amount,
    } = req.params;

    const journalEntry = await JournalEntry.createJournalEntry({
        treatment, amount,
    })
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
    TransactionModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    TransactionModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    TransactionModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    TransactionModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        });
};