'use strict';

var mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({

    title: {type: String, lowercase: false, trim: true, required: true},
    lastAnswer: {},
    numberOfViews: {type: Number, default: 0},
    categoryId: {type: String, lowercase: true, trim: true, required: true},
    creator: {_id: String, name: String},
    _createdAt: {type: Date, default: Date.now},
    _updatedAt: {type: Date, default: Date.now}
}, {
    timestamps: true
});

/**
 * Methods
 */

ThreadSchema.methods = {


    /**
     * addView - add a visit to thread
     *
     * @api public
     */
    addView: function() {
        if (this.numberOfViews) {
            this.numberOfViews++;
        } else {
            this.numberOfViews = 1;
        }
    }
};

module.exports = mongoose.model('Thread', ThreadSchema);
