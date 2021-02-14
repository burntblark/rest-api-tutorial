const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    number: {
        type: Schema.Types.String,
        required: true,
    },
    salesAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: true,
    },
    cashAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: true,
    },
    liabilityAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: true,
    },
    expenseAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: true,
    },
    equityAccount: {
        type: Schema.Types.ObjectId,
        ref: 'Accounts',
        required: true,
    },
    balance: {
        type: Schema.Types.Number,
        default: 0,
        required: true,
    },
    // accounts: {
    //     type: {
    //         tag: {
    //             type: Schema.Types.String,
    //             required: true,
    //         },
    //         account: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Accounts',
    //             required: true,
    //         },
    //     },
    //     required: true,
    // },

}, {
    timestamps: true
});

walletSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
walletSchema.set('toJSON', {
    virtuals: true
});

walletSchema.findById = function (cb) {
    return this.model('Wallets').find({ id: this.id }, cb);
};

const Wallet = mongoose.model('Wallets', walletSchema);


exports.findByNumber = (number) => {
    return Wallet.findOne({ number });
};

exports.findById = (id) => {
    return Wallet.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createWallet = (walletData) => {
    const wallet = new Wallet(walletData);
    return wallet.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Wallet.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, wallets) {
                if (err) {
                    reject(err);
                } else {
                    resolve(wallets);
                }
            })
    });
};

exports.patchWallet = (id, walletData) => {
    return Wallet.findOneAndUpdate({
        _id: id
    }, walletData);
};

exports.removeById = (walletId) => {
    return new Promise((resolve, reject) => {
        Wallet.deleteMany({ _id: walletId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

