"use strict";

const userAuth = require("../middleware/user-auth.js");
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

        res.status(201).send({
            success: true,
            data: {
                casino
            }
        });
    } catch(e) {
        res.status(500).send({
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

        res.status(200).render("casinos", {
            headTitle: "Casinos",
            pageTitle: "Casinos",
            casinos: casinos
        });

    } catch(e) {
        res.status(500).render("error", {
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
                success: false,
                headTitle: title,
                pageTitle: title,
                error: "No game machines were found in the casino!"
            });
        }

        res.status(200).render("casino", {
            success: true,
            headTitle: title,
            pageTitle: title,
            casino: casino
        });

    } catch(e) {
        res.status(500).render("error", {
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

/**
 * Get all Game Machines in Casino by id
 */
router.get("/:casinoId/:machineId", userAuth, async (req, res) => {
    try {
        const gMachine = await models.GameMachine.findById(req.params.machineId);

        if (!gMachine || (gMachine.CasinoId && (gMachine.CasinoId != req.params.casinoId))) {
            return res.status(404).render("error", {
                statusCode: res.statusCode,
                headTitle: "Game Machine is not found!",
                error: "Game Machine is not found!"
            });
        }

        let title = "Game Machine";
        title += gMachine.id ? " № \"" + gMachine.id + "\"" : "";

        if (gMachine.active) {
            return res.status(200).render("game-machine", {
                success: false,
                headTitle: title,
                pageTitle: title,
                error: "This machine is active now! Please try another one."
            });
        }

        res.status(200).render("game-machine", {
            success: true,
            headTitle: title,
            pageTitle: title,
            gMachine: gMachine
        });
        
    } catch(e) {
        res.status(500).render("error", {
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

        res.status(statusCode).send({
            success: result
        });
    } catch(e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});


module.exports = router;