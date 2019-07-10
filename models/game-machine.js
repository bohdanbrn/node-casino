"use strict";

module.exports = (sequelize, DataTypes) => {
    const GameMachine = sequelize.define("GameMachine", {
        money: {
            type: DataTypes.FLOAT,
            trim: true,
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
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
    GameMachine.associate = function (models) {
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
            where: { id }
        });

        if (!gMachine) {
            throw new Error("Game machine is not found!");
        }

        return gMachine;
    };

    /**
   * Put money to GameMachine
   * @param {number} id 
   * @param {number} newMoney 
   */
    GameMachine.putMoney = async function(id, newMoney) {
        try {
            if (newMoney < 0) {
                throw new Error("Put the money please!");
            }

            const gMachine = await GameMachine.findById(id);

            gMachine.money += newMoney;

            gMachine.save().then(() => {
                return {
                    success: true
                };
            });
        } catch(err) {
            return {
                success: false,
                message: err.message
            };
        }
    
    };

    /**
   * Take money from GameMachine
   * @param {number} id 
   * @param {number} money 
   */
    GameMachine.takeMoney = async function(id, money) {
        try {
            if (money < 0) {
                throw new Error("Money should be more than 0!");
            }

            const gMachine = await GameMachine.findById(id);

            // check if there is enough money in the GameMachine
            if (gMachine.money - money < 0) {
                throw new Error("Sorry, but this game machine does not have enough money!");
            }

            gMachine.money -= money;

            gMachine.save().then(() => {
                return {
                    success: true
                };
            });
        } catch(err) {
            return {
                success: false,
                message: err.message
            };
        }
  
    };

    /**
   * Get the amount of money in GameMachine
   */
    GameMachine.prototype.getMoney = function() {
        return this.money;
    };

    /**
   * Play a game
   * @param {number} money 
   */
    GameMachine.prototype.play = function(money) {
        try {
            if (money < 0) {
                throw new Error("Money should be more than 0!");
            }

            const gMachine = this;

            gMachine.money += money;

            const randNumb = Math.floor(Math.random() * (999 - 100) + 100);
            const randNumbStr = randNumb.toString();
            const sameCount = 1;
            let resultMessage = "";
            let winningAmount = 0;

            // check the same numbers
            for (let i = 0; i < randNumbStr.length; i++) {
                for (let j = i+1; j < randNumbStr.length - 1; j++) {
                    if (randNumbStr[i] === randNumbStr[j]) {
                        sameCount++;
                    }
                }
            }

            if (sameCount === 1) {
                resultMessage = "No luck, but you can try again.";
            }
            else {
                resultMessage = `Congratulation, you won ${sameCount} times more!`;
                winningAmount = money * sameCount;

                // check if there is enough money in the GameMachine
                if (gMachine.money - winningAmount < 0) {
                    throw new Error("Sorry, but this game machine does not have enough money!");
                }
            }

            gMachine.save().then(() => {
                return {
                    success: true,
                    message: resultMessage,
                    data: {
                        winningAmount: winningAmount
                    }
                };
            });

        } catch(err) {
            return {
                success: false,
                message: err.message
            };
        }
    };

    return GameMachine;
};
