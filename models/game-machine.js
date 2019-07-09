'use strict';

module.exports = (sequelize, DataTypes) => {
  const GameMachine = sequelize.define('GameMachine', {
    money: DataTypes.FLOAT
  });

  GameMachine.associate = function (models) {
    models.GameMachine.belongsTo(models.Casino, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return GameMachine;
};
