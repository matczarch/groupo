const User = require("../models/User.js");

sql = require("../models/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const maskData = require("maskdata");

/***Paramétrage de la validation du mot de passe***/
var schema = new passwordValidator();

schema //Pour la validation du mot de passe
    .is()
    .min(6) //min 6 caractères
    .is()
    .max(20) //max 20 caractère
    .has()
    .uppercase() //Au moins une lettre en majuscule
    .has()
    .lowercase() //Au moins une lettre en minuscule
    .has()
    .digits(1); //Au moins un chiffre


exports.create_an_account = function (req, res) {
    if (!req.body) {
        res.status(400).send({
            message: "Vous devez remplir le formulaire !",
        });
    } else if (!schema.validate(req.body.password)) {
        res.status(422).send({
            message:
                "Le mot de passe doit faire entre 6 et 20 caractères et contenir 1 majuscule, 1 minuscule et 1 chiffre minimum",
        });
    } else {
        //hash du mot de passe
        bcrypt
            .hash(req.body.password, 10) //hash du mot de passe 
            .then((hash) => {
                //
                if (!req.file) {
                    const user = new User({
                        avatar: `${req.protocol}://${req.get("host")}/images/avatar_default.png`, //if the user hasn't selected an avatar, path to the default avatar
                        firstname: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
                        lastname: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
                        email: maskData.maskEmail2(req.body.email),
                        password: hash,
                        isAdmin: 0,
                    });

                    //
                    User.signup(user, (err, data) => {
                        if (err)
                            res.status(500).send({
                                message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur !",
                            });
                        else res.send(data);
                    });
                } else if (req.file) {
                    const user = new User({

                        avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                        firstname: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
                        lastname: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
                        email: maskData.maskEmail2(req.body.email),
                        password: hash,
                        isAdmin: 0,
                    });

                    //
                    User.signup(user, (err, data) => {
                        if (err)
                            res.status(500).send({
                                message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur !",
                            });
                        else res.send(data);
                    });
                }
            });
    }
};

//
exports.connect_to_account = function (req, res) {
    const email = maskData.maskEmail2(req.body.email);
    const password = req.body.password;

    //
    if (email && password) {
        User.login(email, password, (err, data) => {
            if (err)
                res.status(500).send({
                    message: err.message || "Une erreur s'est produite lors de la connexion au compte !",
                });
            else res.send(data);
        });
    } else {
        //
        res.status(500).json({ message: "Vous devez remplir le formulaire" });
    }
};

//
exports.get_user_infos = function (req, res) {
    const token = req.headers.authorization.split(" ")[1]; //extraction du jeton de l'entête d'autorisation 
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //jeton de décodage avec la clé indiquée au contrôleur/controller.js:53
    const userId = decodedToken.userId; //defining decoded token as user id

    User.getOne(userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error retrieving user with this id : " + userId,
            });
        } else res.send(data);
    });
};

//this is for changing the avatar
exports.change_avatar = function (req, res) {
    const token = req.headers.authorization.split(" ")[1]; //extracting token from authorization header
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //decoding token with the key indicated at controllers/user.controller.js:53
    const userId = decodedToken.userId; //defining decoded token as user id

    const avatar = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    User.changeAvatar(avatar, userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error changing avatar !",
            });
        } else res.send(data);
    });
};

//this is to delete the account
exports.delete_the_account = function (req, res) {
    const token = req.headers.authorization.split(" ")[1]; //extracting token from authorization header
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //decoding token with the key indicated at controllers/user.controller.js:53
    const userId = decodedToken.userId; //defining decoded token as user id

    User.deleteAccount(userId, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error deleting the user with id :" + userId,
            });
        } else res.send(data);
    });
};