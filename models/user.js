"use strict";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            trim: true,
            allowNull: false
        }
    });

    /**
   * Create an association with tables
   * @param {object} models 
   */
    User.associate = function(models) {
        User.hasMany(models.UserCasino);
    };

    return User;
};
