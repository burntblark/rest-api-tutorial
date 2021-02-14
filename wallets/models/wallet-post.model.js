const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const journalEntrySchema = new Schema({
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
}, {
    timestamps: true
});

journalEntrySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
journalEntrySchema.set('toJSON', {
    virtuals: true
});

journalEntrySchema.findById = function (cb) {
    return this.model('JournalEntry').find({ id: this.id }, cb);
};

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

exports.schema = journalEntrySchema;

exports.findById = (id) => {
    return JournalEntry.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createJournalEntry = (groupData) => {
    const group = new JournalEntry(groupData);
    return group.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        JournalEntry.find()
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

exports.patchJournalEntry = (id, groupData) => {
    return JournalEntry.findOneAndUpdate({
        _id: id
    }, groupData);
};

exports.removeById = (groupId) => {
    return new Promise((resolve, reject) => {
        JournalEntry.deleteMany({ _id: groupId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

