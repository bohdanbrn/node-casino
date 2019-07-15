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
     * Play a game
     * @param {number} gameMoney 
     * @param {number} userId 
     */
    GameMachine.prototype.play = async function(gameMoney, userId) {
        const gMachine = this;

        const user = await sequelize.models.User.findOne({
            where: {
                id: userId
            }
        });

        try {
            if (gameMoney <= 0) {
                throw new Error("Money should be more than 0!");
            } else if (gameMoney > user.money) {
                throw new Error("You do not have enough money for play!");
            } else if ((gameMoney * 3) > gMachine.money) {
                const maxRate = Math.floor(gMachine.money / 3);
                throw new Error(`There is not enough money to play. Maximum rate is ${maxRate}`);
            }
        }
        catch(e) {
            return {
                validationError: e.message
            };
        }
        
        // set GameMachine as active now
        gMachine.active = true;
        // add money to GameMachine
        gMachine.money = parseFloat(gMachine.money) + gameMoney;
        // remove money from User
        user.money = parseFloat(user.money) - gameMoney;

        await gMachine.save();
        await user.save();

        let resultMessage = "";
        let winningAmount = 0;

        // generate a random 3-digit number for game
        const randNumb = gMachine.generateGameNumber();
        // number of identical digits
        const sameCount = gMachine.checkSameNumbers(randNumb);

        if (sameCount === 1) {
            resultMessage = "No luck, but you can try again.";
        } else {
            winningAmount = gameMoney * sameCount;
            resultMessage = `Congratulation, you won ${winningAmount}$!`;
        }

        // set GameMachine as not active now
        gMachine.active = false;
        // remove winningAmount from GameMachine
        gMachine.money -= winningAmount;
        await gMachine.save();

        // add money for User
        user.money += winningAmount;
        await user.save();

        return {
            resultMessage,
            randNumb,
            user
        };
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