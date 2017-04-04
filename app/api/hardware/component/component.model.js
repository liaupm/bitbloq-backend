'use strict';

var mongoose = require('mongoose');

var ComponentSchema = new mongoose.Schema({
    _id: {
        type: String,
        trim: true,
        required: true
    },
    manufacturer: String,
    category: String,
    type: String,
    width: Number,
    height: Number,
    dataReturnType: String,
    baudRate: Number,
    oscillator: Boolean,
    pin: {},
    pins: {},
    underDevelopment: Boolean,
    deleted: Boolean
}, {
    timestamps: true
});

/**
 * Pre hook
 */

function findNotDeletedMiddleware(next) {
    this.where('deleted').in([false, undefined, null]);
    next();
}

ComponentSchema.pre('find', findNotDeletedMiddleware);
ComponentSchema.pre('findOne', findNotDeletedMiddleware);
ComponentSchema.pre('findOneAndUpdate', findNotDeletedMiddleware);
ComponentSchema.pre('count', findNotDeletedMiddleware);


/**
 * Methods
 */

ComponentSchema.methods = {

    /**
     * delete - change deleted attribute to true
     *
     * @param {Function} next
     * @api public
     */
    delete: function(next) {
        this.deleted = true;
        this.save(next);
    }
};

module.exports = mongoose.model('hardware-component', ComponentSchema);