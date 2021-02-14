const TransactionModel = require('../../accounts/models/transactions.model');
const WalletModel = require('../models/wallets.model');
const PostModel = require('../posting/models/posts.model');

exports.index = (req, res) => {
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

exports.create = async (req, res, next) => {
    const {number: walletNumber} = req.params;

    if (!walletNumber) {
        return next(new Error('A wallet number is required!'));
    }

    const wallet = await WalletModel.findByNumber(walletNumber).catch(next);

    if (!wallet) {
        return next(new Error(`A wallet with number ${walletNumber} not found.`));
    }

    const reference = '';

    const post = await PostModel.create({
        amount,
        treatment,
        reference,
    });

    WalletPostModel.create(
        wallet,
        post,
    );
        
    return res.send(201).send(post);
};

exports.get = (req, res) => {
    const {number: walletNumber} = req.params;

    if (!walletNumber) {
        return next(new Error('A wallet number is required!'));
    }

    const wallet = await WalletModel.findByNumber(walletNumber).catch(next);

    WalletPostModel.findById(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.update = (req, res) => {
    TransactionModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.delete = (req, res) => {
    TransactionModel.removeById(req.params.userId)
        .then((result) => {
            res.status(204).send({});
        });
};