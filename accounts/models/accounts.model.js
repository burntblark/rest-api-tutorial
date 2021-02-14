const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    number: {
        type: Schema.Types.String,
        required: true,
    },
    balance: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    type: {
        type: Schema.Types.String,
        required: true,
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
}, {
    timestamps: true
});

accountSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
accountSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

accountSchema.findById = function (cb) {
    return this.model('Accounts').find({ id: this.id }, cb);
};

const Account = mongoose.model('Accounts', accountSchema);

exports.schema = accountSchema;

exports.findByNumber = (number) => {
    return Account.find({ number: number }).then(results => {
        return results.map(result => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;

            return result;
        });
    });
};

exports.findById = (id) => {
    return Account.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createAccount = (accountData) => {
    const account = new Account(accountData);
    return account.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Account.find()
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

exports.patchAccount = (id, accountData) => {
    return Account.findOneAndUpdate({
        _id: id
    }, accountData);
};

exports.removeById = (accountId) => {
    return new Promise((resolve, reject) => {
        Account.deleteMany({ _id: accountId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

