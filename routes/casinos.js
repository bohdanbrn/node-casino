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
                [models.GameMachine, "active", "desc"],
                [models.GameMachine, "money", "desc"]
            ]
        });

        if (!casino) {
            res.status(404).render("error", {
                headTitle: "Game Machines",
                success: false,
                error: "Casino is not found!"
            });
        }

        if (!casino.GameMachines) {
            res.status(400).render("casino", {
                headTitle: "Game Machines",
                success: false,
                error: "No game machines were found in the casino!"
            });
        }

        res.status(200).render("casino", {
            headTitle: "Game Machines",
            pageTitle: "Game Machines",
            success: true,
            casino: casino
        });

    } catch(e) {
        res.status(500).render("error", {
            headTitle: "Game Machines",
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