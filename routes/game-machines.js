const models = require("../models");
const express = require("express");
const router = new express.Router();


/**
 * Create new GameMachine
 */
router.post("", async (req, res) => {
    try {
        const gMachine = await models.GameMachine.create({
            money: req.body.money,
            active: req.body.active,
            CasinoId: req.body.CasinoId
        });

        res.status(201).send({
            success: true,
            data: {
                gMachine
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});

/**
 * Get all GameMachines
 */
router.get("", async (req, res) => {
    try {
        const gMachines = await models.GameMachine.findAll();

        res.status(200).send({
            success: true,
            data: {
                gMachines
            }
        });

    } catch (e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});

/**
 * Get GameMachine by id
 */
router.get("/:id", async (req, res) => {
    try {
        const gMachine = await models.GameMachine.findById(req.params.id);

        if (!gMachine) {
            res.status(404).send({
                success: false,
                error: "GameMachine is not found!"
            });
        }

        res.status(200).send({
            success: true,
            data: {
                gMachine
            }
        });

    } catch (e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});

/**
 * Delete GameMachine by id
 */
router.delete("/:id", async (req, res) => {
    try {
        const result = await models.GameMachine.destroy({
            where: {
                id: req.params.id
            }
        });

        const statusCode = result ? 200 : 404;

        res.status(statusCode).send({
            success: result
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});

/**
 * Start play
 */
router.post("/play/:machineId", async (req, res) => {
    try {
        const gMachine = await models.GameMachine.findById(req.params.machineId);
        const user = await models.User.findById(req.body.userId);
        const gameMoney = parseFloat(req.body.gameMoney);

        try {
            if (!gMachine) {
                throw new Error("GameMachine is not found!");
            } else if (!user) {
                throw new Error("User is not found!");
            } else if (gMachine.active) {
                throw new Error("Game machin is already used!");
            } else if (gameMoney <= 0) {
                throw new Error("Money should be more than 0!");
            } else if (gameMoney > user.money) {
                throw new Error("You do not have enough money for play!");
            } else if ((gameMoney * 3) > gMachine.money) {
                const maxRate = Math.floor(gMachine.money / 3);
                throw new Error(`There is not enough money to play. Maximum rate is ${maxRate}`);
            }
        } catch (e) {
            res.status(400).send({
                success: false,
                error: e.message
            });
        }

        if (!gMachine.money) gMachine.money = 0;
        if (!user.money) user.money = 0;

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
            resultMessage = `Congratulation, you won ${sameCount} times more!`;
            winningAmount = gameMoney * sameCount;

            // check if there is enough money in the GameMachine
            if (gMachine.money - winningAmount < 0) {
                throw new Error("Sorry, but this game machine does not have enough money!");
            }
        }

        // set GameMachine as not active now
        gMachine.active = false;
        // remove winningAmount from GameMachine
        gMachine.money -= winningAmount;
        await gMachine.save();

        // add money for User
        user.money += winningAmount;
        await user.save();

        res.status(200).send({
            success: true,
            data: {
                message: resultMessage,
                winningAmount: winningAmount,
                randNumb
            }
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});


module.exports = router;