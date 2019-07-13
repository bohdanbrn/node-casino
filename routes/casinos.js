"use strict";

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
router.get("", async (req, res) => {
    try {
        const casinos = await models.Casino.findAll();

        res.status(200).send({
            success: true,
            data: {
                casinos
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
 * Get Casino by id
 */
router.get("/:id", async (req, res) => {
    try {
        const casino = await models.Casino.findById(req.params.id);

        if (!casino) {
            res.status(404).send({
                success: false,
                error: "Casino is not found!"
            });
        }

        res.status(200).send({
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