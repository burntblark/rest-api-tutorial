const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        required: true
    },
}, {
    timestamps: true
});

transactionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
transactionSchema.set('toJSON', {
    virtuals: true
});

transactionSchema.findById = function (cb) {
    return this.model('Transactions').find({id: this.id}, cb);
};

const Transaction = mongoose.model('Transactions', transactionSchema);

exports.schema = transactionSchema;

exports.findByRef = (ref) => {
    return Transaction.find({ref});
};

exports.findById = (id) => {
    return Transaction.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createTransaction = (accountData) => {
    const account = new Transaction(accountData);
    return account.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Transaction.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, accounts) {
                if (err) {
                    reject(err);
                } else {
                    resolve(accounts);
                }
            })
    });
};

exports.patchTransaction = (id, accountData) => {
    return Transaction.findOneAndUpdate({
        _id: id
    }, accountData);
};

exports.removeById = (accountId) => {
    return new Promise((resolve, reject) => {
        Transaction.deleteMany({_id: accountId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

