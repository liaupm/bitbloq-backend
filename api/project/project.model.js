'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProjectSchema = new mongoose.Schema({
    creatorId: String,
    name: String,
    description: String,
    imageUrl: String,
    videoUrl: String,
    code: String,
    codeProject: Boolean,
    timesViewed: {type: Number, default: 0},
    timesAdded: {type: Number, default: 0},
    defaultTheme: {type: String, default: 'infotab_option_colorTheme'},
    hardware: {
        board: String,
        components: Array,
        connections: Array,
        robot: Array
    },
    software: {
        vars: {},
        setup: {},
        loop: {}
    },
    hardwareTags: Array,
    userTags: Array,
    _acl: {}
});

/**
 * Virtuals
 */

// Public profile information
ProjectSchema
    .virtual('profile')
    .get(function() {
        return {
            '_id': this._id,
            'name': this.name,
            'description': this.description,
            'imageUrl': this.imageUrl,
            'videoUrl': this.videoUrl,
            'timesViewed': this.timesViewed || 0,
            'timesAdded': this.timesAdded || 0
        };
    });


/**
 * Pre-save hook
 */
ProjectSchema
    .pre('save', function(next) {
        if (!thereIsAdmin(this)) {
            setUserAdmin(this, this.creatorId);
            next(this);
        } else {
            next();
        }
    });


/**
 * Private functions
 */


/**
 * thereIsAdmin - check if there is an admin
 * @param {Object} project
 * @api private
 * @return {Boolean}
 */
var thereIsAdmin = function(project) {
    var admin = false;
    if (project._acl) {
        var aux = project._acl;
        for (var item in project._acl) {
            if (project._acl[item].permission === 'ADMIN') {
                admin = true;
            }
        }

    }
    return admin;
};


/**
 * setUserAdmin - set an user admin
 * @param {Object} project
 * @param {String} userId
 * @api private
 */
var setUserAdmin = function(project, userId) {
    project._acl = project._acl || {};
    project._acl['user:' + userId] = {
        permission: 'ADMIN',
        properties: {}
    };
};


/**
 * Methods
 */

ProjectSchema.methods = {

    /**
     * SetPublic - set acl value to public access
     *
     * @api public
     */
    setPublic: function() {
        this._acl.ALL = {
            permission: 'READ',
            properties: {
                date: new Date()
            }
        }
    },


    /**
     * setPrivate - set acl value to private access
     *
     * @api public
     */
    setPrivate: function() {
        delete this._acl.ALL;
    },


    /**
     * addView - add a visit to project
     *
     * @api public
     */
    addView: function() {
        if (this.timesViewed) {
            this.timesViewed++;
        } else {
            this.timesViewed = 0;
        }
    },

    /**
     * share - project is shared with users
     *
     * @param {Object} user
     ** @param {String} user.id
     ** @param {String} user.email
     * @api public
     */
    share: function(user) {
        this._acl = this._acl || {};
        this._acl['user:' + user.id] = {
            permission: 'READ',
            properties: {
                email: user.email,
                date: new Date()
            }
        };
    },

    /**
     * resetShare - project acl is reset
     *
     * @api public
     */
    resetShare: function() {
        var newAcl = {};
        if(this._acl.ALL){
            newAcl = {
                'ALL': this._acl.ALL
            }
        }
        this._acl = newAcl;
        setUserAdmin(this, this.creatorId);
    },

    /**
     * share - project is shared with users
     *
     * @param {String} userId
     * @return {Boolean}
     * @api public
     */
    isOwner: function(userId) {
        var owner = false;
        if (this._acl['user:' + userId].permission === 'ADMIN') {
            owner = true;
        }
        return owner;
    }
};

module.exports = mongoose.model('Project', ProjectSchema);
