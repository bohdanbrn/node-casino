"use strict";

const models = require("../models");

const checkCasinoGameMachine = async(req, res, next) => {
    try {
        const gMachine = await models.GameMachine.findById(req.params.machineId);

        if (!gMachine || (gMachine.CasinoId && (gMachine.CasinoId != req.params.casinoId))) {
            return res.status(404).render("error", {
                statusCode: res.statusCode,
                headTitle: "Game Machine is not found!",
                error: "Game Machine is not found!"
            });
        }

        if (gMachine.active) {
            let title = "Game Machine";
            title += gMachine.id ? " №" + gMachine.id : "";

            return res.status(400).render("game-machine", {
                statusCode: res.statusCode,
                headTitle: title,
                error: "This machine is active now! Please try another one."
            });
        }

        // set variable with Game Machine data
        req.gMachine = gMachine;
        
        next();
    } catch(e) {
        res.status(500).render("error", {
            statusCode: res.statusCode,
            error: e.message
        });
    }
};

module.exports = {checkCasinoGameMachine};