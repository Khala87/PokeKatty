const { Router } = require('express');
const { getAllTypes } = require('../utils/utils.js');
const router = Router()


router.get("/", async (req, res) => {
        try {
            let info = await getAllTypes();
            res.status(200).send(info);

        } catch (error) {
            console.log("ERROR EN RUTA GET A /types", error);
        }
    });

module.exports = router;