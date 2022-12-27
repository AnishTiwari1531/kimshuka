const userModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const { uploadFile } = require("../aws/aws");
const aws = require("../aws/aws")
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

const validFormat = function (value) {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(value)
}


//=============================================SIGNUP API ============================================================
const signup = async (req, res) => {
    try {
        const data = req.body
        // let files = req.files;
        if (Object.keys(data).length == 0)
            return res.status(400).send("please give the all data")

        let { firstName, lastName, email, password } = data

        // if (files && files.length !== 0) {
        //     if (!isValid(files[0])) return res.status(400).send({ status: false, message: "invalid format of the profile image" });
        //     var profileImage = await uploadFile(files[0]);
        // }


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

        // let registerUser = { firstName, lastName, email, password: hash, profileImage }
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
                }, 'Fuerte')
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

//====================================Get APi=================================================

const getUserDetail = async function (req, res) {
    try {
        let userIdParams = req.params.userId

        if (!userIdParams || !userIdParams.trim()) return res.status(400).send({ status: false, message: "enter userId in url path" });
        if (!mongoose.isValidObjectId(userIdParams))
            return res.status(400).send({ status: false, message: "User Id is Not Valid" })
        const findUserDetail = await userModel.findOne({ _id: userIdParams }).select({ firstName: 1, lastName: 1, email: 1, profileImage: 1, _id: 0 })
        if (!findUserDetail) return res.status(404).send({ status: false, message: "No User Exist" })
        return res.status(200).send({ status: true, message: "User detail found", data: findUserDetail })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

//===================Update Api=====================================================

const updateUser = async (req, res) => {
    try {
        let userId = req.params.userId;
        let files = req.files;

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter valid ObjectId in params" });
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Nothing for update" });
        let { firstName, lastName, email, password } = data;

        let updatedData = {};


        if (Object.keys(data).includes("profileImage")) {
            if (files.length == 0) {
                return res.status(400).send({ status: false, message: "There is no file to update" });
            }
        }

        if (req.files.length) {
            if (files.length > 0 && validFormat(files[0].originalname)) {
                let uploadFileUrl = await aws.uploadFile(files[0]);
                updatedData.profileImage = uploadFileUrl;
            } else {
                return res.status(400).send({ status: false, message: "Profile Image can not be updated" });
            }
        }

        if (Object.keys(data).includes("firstName")) {
            if (!(isValid(firstName) && isValidName(firstName))) {
                return res.status(400).send({ status: false, message: "firstName can not be empty and its only contain alphabets." });
            }
            updatedData.firstName = firstName;
        }

        if (Object.keys(data).includes("lastName")) {
            if (!(isValid(lastName) && isValidName(lastName))) {
                return res.status(400).send({ status: false, message: "lastName can not be empty and its conatin alphabets" });
            }
            updatedData.lastName = lastName;
        }

        if (Object.keys(data).includes("email")) {
            if (!(isValid(email) && isValidEmail(email))) {
                return res.status(400).send({ status: false, message: "email can not be empty and please enter valid email" });
            }
            updatedData.email = email;
        }
        if (Object.keys(data).includes("password")) {
            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: "Password can not be empty" });
            }
            if (password.length < 6 || password.length > 15) {
                return res.status(400).send({ status: false, message: "password length should be between 6 to 15" });
            }
            password = await bcrypt.hash(password, 10);  //saltround=10
            updatedData.password = password;
        }

        let modifiedData = await userModel.findByIdAndUpdate({ _id: userId }, updatedData, { new: true, upsert: true });
        modifiedData = modifiedData.toObject()
        delete modifiedData.password

        return res.status(200).send({ status: true, message: "User profile updated", Data: modifiedData });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


//==================================================================================

module.exports = { signup, userLogin, getUserDetail, updateUser }

//==================================================================================