const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwtsecret = "thismakesabigstringwhichconfirmsencryption"

router.post("/CreateUser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 6 })]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secpassword = await bcrypt.hash(req.body.password, salt)
        try {
            await User.create({
                name: req.body.name,
                password: secpassword,
                email: req.body.email,
                location: req.body.location
            })
            res.json({ success: true });

        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 6 })]
    , async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;

        try {
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: "Try logging in with correct credentials" })
            }

            const pwdcompare = await bcrypt.compare(req.body.password, userData.password)
            if (!pwdcompare) {
                return res.status(400).json({ errors: "Try logging in with correct credentials" })
            }

            const data = {
                user: {
                    id:userData.id
                }
            }

            const authToken = jwt.sign(data, jwtsecret)

            return res.json({ success: true, authToken:authToken });
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

module.exports = router;