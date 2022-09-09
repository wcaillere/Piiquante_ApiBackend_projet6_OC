//import packages
const Sauce = require('../models/Sauce');
const fs = require('fs');

//Get all sauces of the Data Base
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
}

//Get one sauce of the Data Base thanks to its ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
}

//Create one sauce in the Data Base
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

//Modify one sauce of the Data Base
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

//Delete one Sauce of the Data Base
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

//Manage the "like" functionnality of sauces
exports.manageLike = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        //like == 1 : an user is liking a sauce
        if (req.body.like == 1) {
            let addLikeArray = sauce.usersLiked;
            addLikeArray.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id}, {likes: sauce.likes + 1, usersLiked: addLikeArray})
            .then(() => res.status(200).json({message: "Sauce likée !"}))
            .catch(error => res.status(500).json({error}))
        }
        //like == -1 : an user is disliking a sauce
        else if (req.body.like == -1) {
            let addDislikeArray = sauce.usersDisliked;
            addDislikeArray.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id}, {$set: {dislikes: sauce.dislikes + 1, usersDisliked: addDislikeArray}})
            .then(() => res.status(200).json({message: "Sauce dislikée !"}))
            .catch(error => res.status(500).json({error}))
        }
        //like == 0 : an user is removing his like or dislike from a sauce
        else if (req.body.like == 0) {
            //if the action is to remove a like
            if (sauce.usersLiked.includes(req.body.userId)) {
                let removeLikeArray = sauce.usersLiked;
                let index = removeLikeArray.indexOf(req.body.userId)
                removeLikeArray.splice(index, 1);
                Sauce.updateOne({ _id: req.params.id}, {likes: sauce.likes - 1, usersLiked: removeLikeArray})
                .then(() => res.status(200).json({message: "Like retiré !"}))
                .catch(error => res.status(500).json({error}))
            } 
            //if the action is to remove a dislike
            else if (sauce.usersDisliked.includes(req.body.userId)) {
                let removeDislikeArray = sauce.usersDisliked;
                let index = removeDislikeArray.indexOf(req.body.userId)
                removeDislikeArray.splice(index, 1);
                Sauce.updateOne({ _id: req.params.id}, {dislikes: sauce.dislikes - 1, usersDisliked: removeDislikeArray})
                .then(() => res.status(200).json({message: "Dislike retiré !"}))
                .catch(error => res.status(500).json({error}))
            }
        }
    })
    .catch(error => res.status(500).json({error}))
}