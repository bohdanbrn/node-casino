"use strict";

const adminAuth = require("../../middleware/user-auth.js");
const models = require("../../models");
const express = require("express");
const router = new express.Router();


/**
 * Get form for create GameMachine
 */
router.get("", adminAuth, async (req, res) => {
    const casinos = await models.Casino.findAll();

    return res.status(200).render("dashboard/createGameMachine", {
        headTitle: "Create Game Machine",
        pageTitle: "Create Game Machine",
        user: req.user,
        casinos: casinos
    });
});

/**
 * Create new GameMachine
 */
router.post("", adminAuth, async (req, res) => {
    try {
        const gMachine = await models.GameMachine.create({
            money: req.body.money,
            CasinoId: parseInt(req.body.CasinoId)
        });
        const casinos = await models.Casino.findAll();

        return res.status(200).render("dashboard/createGameMachine", {
            headTitle: "Create Game Machine",
            pageTitle: "Create Game Machine",
            gMachine: gMachine,
            alertMessages: ["Game machine successfully created."],
            user: req.user,
            casinos: casinos
        });
    } catch(e) {
        return res.status(500).render("dashboard/error", {
            headTitle: "Create Casino",
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

/**
 * Create new GameMachine
 */
router.post("", adminAuth, async (req, res) => {
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
    } catch(e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});

/**
 * Get all GameMachines
 */
router.get("", adminAuth, async (req, res) => {
    try {
        const gMachines = await models.GameMachine.findAll();

        res.status(200).send({
            success: true,
            data: {
                gMachines
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
 * Get GameMachine by id
 */
router.get("/:id", adminAuth, async (req, res) => {
    try {
        const gMachine = await models.GameMachine.findById(req.params.id);

        if (!gMachine) {
            res.status(404).send({
                success: false,
                error: "Game machine is not found!"
            });
        }

        res.status(200).send({
            success: true,
            data: {
                gMachine
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
 * Delete GameMachine by id
 */
router.delete("/:id", adminAuth, async (req, res) => {
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
    } catch(e) {
        res.status(500).send({
            success: false,
            error: e.message
        });
    }
});


module.exports = router;