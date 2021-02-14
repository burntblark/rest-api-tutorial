const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const Transaction = require('../../accounts/models/transactions.model');

const EntrySchema = new Schema({
    date: {
        type: Schema.Types.ObjectId,
        ref: "Treatment",
        required: true
    },
    number: {
        type: Schema.Types.String,
        required: true
    },
    transactions: [{
        type: Transaction.schema,
        required: true
    }],
}, {
    timestamps: true
});

EntrySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
EntrySchema.set('toJSON', {
    virtuals: true
});

EntrySchema.findById = function (cb) {
    return this.model('Entry').find({ id: this.id }, cb);
};

const Entry = mongoose.model('Entry', EntrySchema);

exports.schema = EntrySchema;

exports.findById = (id) => {
    return Entry.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.create = (data) => {
    const group = new Entry(data);
    return group.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Entry.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, groups) {
                if (err) {
                    reject(err);
                } else {
                    resolve(groups);
                }
            })
    });
};

exports.patch = (id, data) => {
    return Entry.findOneAndUpdate({
        _id: id
    }, data);
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Entry.deleteMany({ _id: id }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

