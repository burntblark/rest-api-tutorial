const TransactionModel = require('../models/transactions.model');
const TreatmentModel = require('../../treatments/models/treatments.model');
const WalletModel = require('../../wallets/models/wallets.model');

exports.insert = async (req, res, next) => {
    const walletNumber = req.params.number;

    if (!walletNumber) {
        return next(new Error('A wallet number is required!'));
    }

    let wallet;

    wallet = await WalletModel.findByNumber(walletNumber).catch(next);

    if (!wallet) {
        return next(new Error(`A wallet with number ${walletNumber} not found.`));
    }

    const { treatment: treatmentCode, amount } = req.body;

    TreatmentModel.findByCode(treatmentCode).then((treatment) => {
        if (!treatment) {
            throw new Error('Treatment not found.');
        }

        const lineItems = [];

        const promises = treatment.legs.map((leg) => {
            const ref = '';
            const { narration, lines } = leg;

            lineItems = lines.map(line => {
                const { flat, rate, accountKey} = line;
                const lineAmount = flat ? rate : rate * amount;
                const account = wallet.accounts[accountKey];

                if (!account) {
                    throw new Error(`Account with key '${accountKey}' is missing from wallet.`);
                }

                return {
                    amount: lineAmount,
                    account,
                };
            });

            const sum = lineItems.map(lineItem => {
                return lineItem.amount;
            }).reduce((a, c) => (a + c));

            if (sum === 0) {
                throw new Error('Transaction not balanced.');
            }

            return TransactionModel.createTransaction({ ref, amount, narration, lineItems })
                .then((result) => result);
        });

        return Promise.all(promises).spread(results => results.map(result => result._id));
    }).then((transactons) => res.send(201).send(transactons)).catch(next);
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