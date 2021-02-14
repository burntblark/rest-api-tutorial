const mongoose = require('../../common/services/mongoose.service').mongoose;

const Schema = mongoose.Schema;

const treatmentSchema = new Schema({
    code: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    legs: {
        type: [{
            narration: {
                type: Schema.Types.String,
                required: true,
            },
            lines: {
                type: [{
                    rate: {
                        type: Schema.Types.Number,
                        required: true,
                    },
                    flat: {
                        type: Schema.Types.Boolean,
                        required: true,
                    },
                    accountKey: {
                        type: Schema.Types.String,
                        required: true,
                    }
                }],
                required: true,
            },
        }],
        required: true
    }
}, {
    timestamps: true
});

treatmentSchema.pre('save', function (next) {
    if (!this.legs || this.legs.length <= 0)
        next(new Error('Treatment requires at least a transaction leg.'));

    next();
});

treatmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
treatmentSchema.set('toJSON', {
    virtuals: true
});

treatmentSchema.findById = function (cb) {
    return this.model('Treatments').find({ id: this.id }, cb);
};

const Treatment = mongoose.model('Treatments', treatmentSchema);

exports.schema = treatmentSchema;

exports.findByCode = (code) => {
    return Treatment.findOne({ code });
};

exports.findById = (id) => {
    return Treatment.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createTreatment = (treatmentData) => {
    const treatment = new Treatment(treatmentData);
    return treatment.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Treatment.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, treatments) {
                if (err) {
                    reject(err);
                } else {
                    resolve(treatments);
                }
            })
    });
};

exports.patchTreatment = (id, treatmentData) => {
    return Treatment.findOneAndUpdate({
        _id: id
    }, treatmentData);
};

exports.removeById = (treatmentId) => {
    return new Promise((resolve, reject) => {
        Treatment.deleteMany({ _id: treatmentId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

