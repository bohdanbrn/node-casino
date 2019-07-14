"use strict";

module.exports = (sequelize, DataTypes) => {
    const GameMachine = sequelize.define("GameMachine", {
        money: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });

    /**
     * Create an association with tables
     * @param {object} models 
     */
    GameMachine.associate = (models) => {
        GameMachine.belongsTo(models.Casino, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    /**
     * Find GameMachine by id
     * @param {number} id 
     */
    GameMachine.findById = async (id) => {
        const gMachine = await GameMachine.findOne({
            where: {
                id
            }
        });

        return gMachine;
    };

    /**
     * Put money to GameMachine
     * @param {number} id 
     * @param {number} newMoney 
     */
    GameMachine.putMoney = async (id, newMoney) => {
        if (newMoney < 0) {
            throw new Error("Put the money please!");
        }

        const gMachine = await GameMachine.findById(id);

        gMachine.money += newMoney;

        return await gMachine.save();
    };

    /**
     * Take money from GameMachine
     * @param {number} id 
     * @param {number} money 
     */
    GameMachine.takeMoney = async (id, money) => {
        if (money < 0) {
            throw new Error("Money should be more than 0!");
        }

        const gMachine = await GameMachine.findById(id);

        // check if there is enough money in the GameMachine
        if ((gMachine.money - money) < 0) {
            throw new Error("Sorry, but this game machine does not have enough money!");
        }

        gMachine.money -= money;

        return await gMachine.save();
    };

    /**
     * Get the amount of money in GameMachine
     */
    GameMachine.prototype.getMoney = function() {
        return this.money;
    };

    /**
     * Generate a random 3-digit number for game
     */
    GameMachine.prototype.generateGameNumber = function() {
        return Math.floor(Math.random() * (999 - 100) + 100);
    };

    /**
     * Check the number of identical digits
     */
    GameMachine.prototype.checkSameNumbers = function(gameNumber) {
        const randNumbStr = gameNumber.toString();
        let sameCount = 1;

        // check the same numbers
        for (let i = 0; i < randNumbStr.length; i++) {
            for (let j = i + 1; j < randNumbStr.length; j++) {
                if (randNumbStr[i] === randNumbStr[j]) {
                    sameCount++;
                }
            }
        }

        return sameCount;
    };


    return GameMachine;
};