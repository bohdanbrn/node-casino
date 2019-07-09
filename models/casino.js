'use strict';

module.exports = (sequelize, DataTypes) => {
  const Casino = sequelize.define('Casino', {
    name: DataTypes.STRING,
  });

  Casino.associate = function(models) {
    models.Casino.hasMany(models.GameMachine);
    models.Casino.hasMany(models.UserCasino);
  };

  return Casino;
};
