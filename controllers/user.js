//import packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Allows an user to signup on the site if he's not
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email.toLowerCase(),
            password: hash
        });    
        user.save()
        .then(() => res.status(201).json({message: "Utilisateur créé !"}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
}

//Allows an user to login on the site if he's in the Data Base
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email.toLowerCase()})
    .then(user => {
        if (user == null) {
            res.status(401).json({message: "Paire email/mot de passe invalide !"})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message: "Paire email/mot de passe invalide !"})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_KEY,
                            { expiresIn: '1h' }
                        )
                    });
                }
            })
            .catch(error => res.status(500).json({error})); 
        }
    })
    .catch(error => res.status(500).json({error}));
}