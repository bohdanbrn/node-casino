"use strict";

module.exports = (sequelize, DataTypes) => {
    const Casino = sequelize.define("Casino", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            trim: true,
        }
    });

    /**
     * Create an association with tables
     * @param {object} models 
     */
    Casino.associate = (models) => {
        Casino.hasMany(models.GameMachine);
    };

    /**
     * Find Casino by id
     * @param {number} id 
     */
    Casino.findById = async (id) => {
        const casino = await Casino.findOne({
            where: {
                id
            }
        });

        return casino;
    };

    /**
     * Get money from all Casino's GameMachines
     */
    Casino.prototype.getMoney = async function() {
        const casino = this;

        const casinoMoney = await sequelize.models.GameMachine.findOne({
            where: {
                CasinoId: casino.id
            },
            attributes: [
                [sequelize.fn("sum", sequelize.col("money")), "total"]
            ]
        });

        return parseInt(casinoMoney.dataValues.total);
    };

    /**
     * Get GameMachines count in Casino
     */
    Casino.prototype.getGameMachinesCount = async function() {
        const casino = this;

        const gameMachineCount = await sequelize.models.GameMachine.findOne({
            where: {
                CasinoId: casino.id
            },
            attributes: [
                [sequelize.fn("count", sequelize.col("id")), "count"]
            ],
        });

        return parseInt(gameMachineCount.dataValues.count);
    };

    return Casino;
};