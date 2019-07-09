'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCasino = sequelize.define('UserCasino', {
    cashBalance: DataTypes.FLOAT
  });

  UserCasino.associate = function (models) {
    models.UserCasino.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.UserCasino.belongsTo(models.Casino, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return UserCasino;
};
