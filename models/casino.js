"use strict";

module.exports = (sequelize, DataTypes) => {
    const Casino = sequelize.define("Casino", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
            allowNull: false
        }
    });

    /**
   * Create an association with tables
   * @param {object} models 
   */
    Casino.associate = function(models) {
        Casino.hasMany(models.GameMachine);
        Casino.hasMany(models.UserCasino);
    };

    return Casino;
};
