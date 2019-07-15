"use strict";

const userAuth = require("../middleware/user-auth.js");
const {checkCasinoGameMachine} = require("../middleware/check-game-machine.js");
const models = require("../models");
const express = require("express");
const router = new express.Router();


/**
 * Create new Casino
 */
router.post("", async (req, res) => {
    try {
        const casino = await models.Casino.create({
            name: req.body.name,
        });

        return res.status(201).send({
            success: true,
            data: {
                casino
            }
        });
    } catch(e) {
        return res.status(500).send({
            success: false,
            error: e.message
        });
    }
});

/**
 * Get all Casinos
 */
router.get("", userAuth, async (req, res) => {
    try {
        const casinos = await models.Casino.findAll();

        return res.status(200).render("casinos", {
            headTitle: "Casinos",
            pageTitle: "Casinos",
            casinos: casinos,
            user: req.user
        });

    } catch(e) {
        return res.status(500).render("error", {
            headTitle: "Casinos",
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

/**
 * Get all Game Machines in Casino by id
 */
router.get("/:id", userAuth, async (req, res) => {
    try {
        const casino = await models.Casino.findOne({
            where: { id: req.params.id },
            include: [{
                model: models.GameMachine,
            }],
            order: [
                [models.GameMachine, "active", "asc"],
                [models.GameMachine, "money", "desc"]
            ]
        });

        // check if casino exist
        if (!casino) {
            return res.status(404).render("error", {
                statusCode: res.statusCode,
                headTitle: "Casino is not found!",
                error: "Casino is not found!"
            });
        }

        let title = "Casino";
        title += casino.name ? " \"" + casino.name + "\"" : "";

        // check if casino has GameMachines
        if (!casino.GameMachines || casino.GameMachines.length < 1) {
            return res.status(200).render("casino", {
                headTitle: title,
                pageTitle: title,
                error: "No game machines were found in the casino!",
                user: req.user
            });
        }

        return res.status(200).render("casino", {
            headTitle: title,
            pageTitle: title,
            casino: casino,
            user: req.user
        });

    } catch(e) {
        return res.status(500).render("error", {
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

/**
 * Get single Game Machine in Casino by id
 */
router.get("/:casinoId/:machineId", [userAuth, checkCasinoGameMachine], async (req, res) => {
    try {
        const gMachine = req.gMachine;
        
        let title = "Game Machine";
        title += gMachine.id ? " №" + gMachine.id : "";

        return res.status(200).render("game-machine", {
            headTitle: title,
            pageTitle: title,
            gMachine: req.gMachine,
            user: req.user
        });
        
    } catch(e) {
        return res.status(500).render("error", {
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

/**
 * Play a geme on Game Machine
 */
router.post("/:casinoId/:machineId", [userAuth, checkCasinoGameMachine], async (req, res) => {
    try {
        const gMachine = req.gMachine;
        const user = req.user;

        const gameMoney = parseFloat(req.body.gameMoney);

        // play a game
        const gameResult = await gMachine.play(gameMoney, user.id);

        let title = "Game Machine";
        title += gMachine.id ? " №" + gMachine.id : "";

        if (gameResult.validationError) {
            return res.status(200).render("game-machine", {
                headTitle: title,
                pageTitle: title,
                alertMessages: [gameResult.validationError],
                gMachine: gMachine
            });
        }

        return res.status(200).render("game-machine", {
            headTitle: title,
            pageTitle: title,
            alertMessages: [
                `Your number is ${gameResult.randNumb}`,
                gameResult.resultMessage,
            ],
            gMachine: gMachine,
            user: gameResult.user
        });
        
    } catch(e) {
        return res.status(500).render("error", {
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

/**
 * Delete Casino by id
 */
router.delete("/:id", async (req, res) => {
    try {
        const result = await models.Casino.destroy({
            where: {
                id: req.params.id
            }
        });

        const statusCode = result ? 200 : 404;

        return res.status(statusCode).send({
            success: result
        });
    } catch(e) {
        return res.status(500).send({
            success: false,
            error: e.message
        });
    }
});


module.exports = router;