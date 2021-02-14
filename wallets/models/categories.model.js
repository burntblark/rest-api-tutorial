const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
}, {
    timestamps: true
});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
categorySchema.set('toJSON', {
    virtuals: true
});

categorySchema.findById = function (cb) {
    return this.model('Wallets').find({id: this.id}, cb);
};

const Wallet = mongoose.model('Wallets', categorySchema);


exports.findByNumber = (number) => {
    return Wallet.find({number: number});
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

exports.createWallet = (categoryData) => {
    const category = new Wallet(categoryData);
    return category.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Wallet.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, categorys) {
                if (err) {
                    reject(err);
                } else {
                    resolve(categorys);
                }
            })
    });
};

exports.patchWallet = (id, categoryData) => {
    return Wallet.findOneAndUpdate({
        _id: id
    }, categoryData);
};

exports.removeById = (categoryId) => {
    return new Promise((resolve, reject) => {
        Wallet.deleteMany({_id: categoryId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

