const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
}

exports.createOneSauce = (req, res, next) => {
    const sauce = new Sauce({
        ...req.body,
        userId: req.auth.userId
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce ajoutée !'}))
    .catch(error => res.status(400).json({error}))
}