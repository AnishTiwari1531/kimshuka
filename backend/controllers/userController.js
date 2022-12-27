const userModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

//================================Validations=============================================================================

const isValidEmail = function (value) {
    return /^[a-zA-Z]{1}[A-Za-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/.test(value);
}

const isValidName = function (value) {
    return /^\w[a-zA-Z]*$/.test(value)
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


//=============================================SIGNUP API ============================================================
const signup = async (req, res) => {
    try {
        const data = req.body
        if (Object.keys(data).length == 0)
            return res.status(400).send("please give the all data")

        let { firstName, lastName, email, password } = data

        if (!(isValid(firstName) && isValidName(firstName)))
            return res.status(400).send({ status: false, message: "firstname is mandatory & it should be contain alphabets only" })
        if (!(isValid(lastName) && isValidName(lastName)))
            return res.status(400).send({ status: false, message: "lastName is a mandatory & it only contain alphabets " })
        if (!(isValid(email) && isValidEmail(email)))
            return res.status(400).send({ status: false, message: "email is a mandatory field & its should be in a valid format" })
        if (!(isValid(password) && !(password.length < 6 || password.length > 15)))
            return res.status(400).send({ status: false, message: "password is a mandatory field and it should be maximum minimum 6 and maximum 15." })

        const hash = bcrypt.hashSync(password, 10);


        const checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(400).send({ status: false, message: "Email-Id Already Registered " })

        let registerUser = { firstName, lastName, email, password: hash }

        let create = await userModel.create(registerUser)
        create = create.toObject();
        delete create.password;
        return res.status(201).send({ status: true, message: "User Created Successfully", data: create })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
};


//=============================================LOGIN API ============================================================
const userLogin = async (req, res) => {
    try {
        const body = req.body
        const { email, password } = body

        console.log(body)
        if ((Object.keys(body).length == 0)) {
            return res.status(400).send({ status: false, message: "Please provide The Credential To Login" });
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please provide The Email-id" });
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please provide The password" });;
        }
        let user = await userModel.findOne({ email: email });
        if (user) {
            const Passwordmatch = bcrypt.compareSync(body.password, user.password);
            if (Passwordmatch) {
                const generatedToken = jwt.sign({
                    userId: user._id,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 3600 * 24
                }, 'Kimshuka')
                res.setHeader('Authorization', 'Bearer ' + generatedToken)
                return res.status(200).send({
                    "status": true,
                    message: "User login successfull",
                    data: {
                        user: user.firstName,
                        userId: user._id,
                        token: generatedToken,
                    }
                });
            } else {
                res.status(401).send({ status: false, message: "Password Is Inappropriate." });
            }
        } else {
            return res.status(400).send({ status: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
};


//==================================================================================

module.exports = { signup, userLogin }

//==================================================================================