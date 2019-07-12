const models = require("../models");
const express = require("express");
const router = new express.Router();


/**
 * Create new User
 */
router.post("", async (req, res) => {
    try {
        const user = await models.User.create({
            name: req.body.name
        });

        res.status(201).send({
            success: true,
            data: {
                user
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
 * Get all Users
 */
router.get("", async (req, res) => {
    try {
        const users = await models.User.findAll();

        res.status(200).send({
            success: true,
            data: {
                users
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
 * Get User by id
 */
router.get("/:id", async (req, res) => {
    try {
        const user = await models.User.findById(req.params.id);

        if (!user) {
            res.status(404).send({
                success: false,
                error: "User is not found!"
            });
        }

        res.status(200).send({
            success: true,
            data: {
                user
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
 * Delete User by id
 */
router.delete("/:id", async (req, res) => {
    try {
        const result = await models.User.destroy({
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


module.exports = router;