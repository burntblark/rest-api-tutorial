const mongoose = require('../../common/services/mongoose.service').mongoose;
const TreatmentModel = require('./treatments.model');
const Schema = mongoose.Schema;

const legSchema = new Schema({
    narration: {
        type: Schema.Types.String,
        required: true,
    },
    treatment: {
        type: TreatmentModel.schema,
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
    }
});

legSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
legSchema.set('toJSON', {
    virtuals: true
});

legSchema.findById = function (cb) {
    return this.model('Legs').find({ id: this.id }, cb);
};

const Leg = mongoose.model('Legs', legSchema);

exports.schema = legSchema;

exports.findById = (id) => {
    return Leg.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createLeg = (treatment, data) => {

    const { lines: linesData, ...legData } = data;

    data.treatment = treatment;

    const leg = new Leg(data);

    // leg.lines.addToSet(linesData);

    return leg.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Leg.find()
            .populate('lines')
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, legs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(legs);
                }
            })
    });
};

exports.patchLeg = (id, legData) => {
    return Leg.findOneAndUpdate({
        _id: id
    }, legData);
};

exports.removeById = (legId) => {
    return new Promise((resolve, reject) => {
        Leg.deleteMany({ _id: legId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

