const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
}

exports.createOneSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce ajoutée !'}))
    .catch(error => res.status(400).json({error}))
}

exports.modifyOneSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({message: 'Unauthorized request'})
        } else {
            Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: "Sauce modifiée !"}))
            .catch(error => res.status(401).json({error}))
        }
    })
    .catch(error => res.status(400).json({error}))
}

exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id })
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({message: 'Unauthorized request'})
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: "Sauce supprimée !"}))
                .catch(error => res.status(401).json({error}))
            });
        }
    })
    .catch(error => res.status(500).json({error}))
}

exports.manageLike = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (req.body.like == 1) {
            let tableau = sauce.usersLiked;
            tableau.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id}, {likes: sauce.likes + 1, usersLiked: tableau})
            .then(() => res.status(200).json({message: "Le like/dislike de ka sauce a bien été pris en compte !"}))
            .catch(error => res.status(500).json({error}))
        }
        else if (req.body.like == -1) {
            let dislikesArray = sauce.usersDisliked;
            dislikesArray.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id}, {$set: {dislikes: sauce.dislikes + 1, usersDisliked: dislikesArray}})
            .then(() => res.status(200).json({message: "Le like/dislike de ka sauce a bien été pris en compte !"}))
            .catch(error => res.status(500).json({error}))
        }
        else if (req.body.like == 0) {
            if (sauce.usersLiked.includes(req.body.userId)) {
                let tableau = sauce.usersLiked;
                let index = tableau.indexOf(req.body.userId)
                tableau.splice(index, 1);
                console.log(tableau);
                Sauce.updateOne({ _id: req.params.id}, {likes: sauce.likes - 1, usersLiked: tableau})
                .then(() => res.status(200).json({message: "Le like/dislike de ka sauce a bien été pris en compte !"}))
                .catch(error => res.status(500).json({error}))
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                let dislikesArray = sauce.usersDisliked;
                let index = dislikesArray.indexOf(req.body.userId)
                dislikesArray.splice(index, 1);
                console.log(dislikesArray);
                Sauce.updateOne({ _id: req.params.id}, {dislikes: sauce.dislikes - 1, usersDisliked: dislikesArray})
                .then(() => res.status(200).json({message: "Le like/dislike de ka sauce a bien été pris en compte !"}))
                .catch(error => res.status(500).json({error}))
            }
        }
    })
    .catch(error => {
        res.status(500).json({error});
        console.log(error)
    })
}