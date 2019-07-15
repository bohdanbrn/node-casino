"use strict";

const adminAuth = require("../../middleware/user-auth.js");
const models = require("../../models");
const express = require("express");
const router = new express.Router();


/**
 * Get form for create Casino
 */
router.get("", adminAuth, async (req, res) => {
    return res.status(200).render("dashboard/createCasino", {
        headTitle: "Create Casino",
        pageTitle: "Create Casino",
        user: req.user
    });
});

/**
 * Create new Casino
 */
router.post("", adminAuth, async (req, res) => {
    try {
        const casino = await models.Casino.create({
            name: req.body.name,
        });

        return res.status(200).render("dashboard/createCasino", {
            headTitle: "Create Casino",
            pageTitle: "Create Casino",
            casino: casino,
            alertMessages: ["Casino successfully created."],
            user: req.user
        });
    } catch(e) {
        return res.status(500).render("dashboard/error", {
            headTitle: "Create Casino",
            statusCode: res.statusCode,
            error: e.message
        });
    }
});

// /**
//  * Get all Casinos
//  */
// router.get("", adminAuth, async (req, res) => {
//     try {
//         const casinos = await models.Casino.findAll();

//         return res.status(200).render("casinos", {
//             headTitle: "Casinos",
//             pageTitle: "Casinos",
//             casinos: casinos,
//             user: req.user
//         });

//     } catch(e) {
//         return res.status(500).render("dashboard/error", {
//             headTitle: "Casinos",
//             statusCode: res.statusCode,
//             error: e.message
//         });
//     }
// });

// /**
//  * Get all Game Machines in Casino by id
//  */
// router.get("/:id", adminAuth, async (req, res) => {
//     try {
//         const casino = await models.Casino.findOne({
//             where: { id: req.params.id },
//             include: [{
//                 model: models.GameMachine,
//             }],
//             order: [
//                 [models.GameMachine, "active", "asc"],
//                 [models.GameMachine, "money", "desc"]
//             ]
//         });

//         // check if casino exist
//         if (!casino) {
//             return res.status(404).render("dashboard/error", {
//                 statusCode: res.statusCode,
//                 headTitle: "Casino is not found!",
//                 error: "Casino is not found!"
//             });
//         }

//         let title = "Casino";
//         title += casino.name ? " \"" + casino.name + "\"" : "";

//         // check if casino has GameMachines
//         if (!casino.GameMachines || casino.GameMachines.length < 1) {
//             return res.status(200).render("casino", {
//                 headTitle: title,
//                 pageTitle: title,
//                 error: "No game machines were found in the casino!",
//                 user: req.user
//             });
//         }

//         return res.status(200).render("casino", {
//             headTitle: title,
//             pageTitle: title,
//             casino: casino,
//             user: req.user
//         });

//     } catch(e) {
//         return res.status(500).render("dashboard/error", {
//             statusCode: res.statusCode,
//             error: e.message
//         });
//     }
// });

// /**
//  * Delete Casino by id
//  */
// router.delete("/:id", adminAuth, async (req, res) => {
//     try {
//         const result = await models.Casino.destroy({
//             where: {
//                 id: req.params.id
//             }
//         });

//         const statusCode = result ? 200 : 404;

//         return res.status(statusCode).send({
//             success: result
//         });
//     } catch(e) {
//         return res.status(500).send({
//             success: false,
//             error: e.message
//         });
//     }
// });


module.exports = router;