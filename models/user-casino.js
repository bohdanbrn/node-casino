'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserCasino = sequelize.define('UserCasino', {
    cashBalance: {
      type: DataTypes.FLOAT,
      trim: true,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 }
    }
  });

  /**
   * Create an association with tables
   * @param {object} models 
   */
  UserCasino.associate = function (models) {
    UserCasino.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    UserCasino.belongsTo(models.Casino, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };
  
  return UserCasino;
};
