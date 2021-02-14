const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Group",
    }
}, {
    timestamps: true
});

groupSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
groupSchema.set('toJSON', {
    virtuals: true
});

groupSchema.findById = function (cb) {
    return this.model('Groups').find({ id: this.id }, cb);
};

const Group = mongoose.model('Groups', groupSchema);

exports.schema = groupSchema;

exports.findById = (id) => {
    return Group.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createGroup = (groupData) => {
    const group = new Group(groupData);
    return group.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Group.find()
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

exports.patchGroup = (id, groupData) => {
    return Group.findOneAndUpdate({
        _id: id
    }, groupData);
};

exports.removeById = (groupId) => {
    return new Promise((resolve, reject) => {
        Group.deleteMany({ _id: groupId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

