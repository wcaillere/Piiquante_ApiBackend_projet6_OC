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
    //With the add of an image file, the request object is now a string. Thus, we need first to Parse it.
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
    //Verify if there is a file in the request
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    //Avoid a security problem where the userId of a sauce is modify
    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({message: 'Unauthorized request'})
        } else {
            //if the image has been changed, the previous image is deleted
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {});
            }
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
        if (req.body.like == 1 || req.body.like == -1) {
            //cleaning the like and dislike counts and arrays of the sauce to avoid ID's duplicate in the same array, of between arrays (an Id in the like and the dislike arrays)
            let likeArray = sauce.usersLiked;
            let  filteredLikeArray = likeArray.filter(id => id !== req.auth.userId);
            let dislikeArray = sauce.usersDisliked;
            let filteredDislikeArray = dislikeArray.filter(id => id !== req.auth.userId);
            Sauce.updateOne({ _id: req.params.id}, {dislikes: filteredDislikeArray.length, likes: filteredLikeArray.length, usersDisliked: filteredDislikeArray, usersLiked: filteredLikeArray})
            .then(() => {
                //like == 1 : the user is liking a sauce
                if (req.body.like == 1) {
                    Sauce.updateOne({ _id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.auth.userId}})
                    .then(() => res.status(200).json({message: "Sauce likée !"}))
                    .catch(error => res.status(500).json({error}))
                } 
                //like == -1 : the user is disliking a sauce
                else if (req.body.like == -1) {
                    Sauce.updateOne({ _id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.auth.userId}})
                    .then(() => res.status(200).json({message: "Sauce dislikée !"}))
                    .catch(error => res.status(500).json({error}))
                };
            })
            .catch(error => res.status(500).json({error}))
        }
        //like == 0 : the user is removing his like or dislike from a sauce
        else if (req.body.like == 0) {
            //if the action is to remove a like
            if (sauce.usersLiked.includes(req.auth.userId)) {
                Sauce.updateOne({ _id: req.params.id}, {$inc: {likes: -1}, $pullAll: {usersLiked: [req.auth.userId]}})
                .then(() => res.status(200).json({message: "Like retiré !"}))
                .catch(error => res.status(500).json({error}))
            } 
            //if the action is to remove a dislike
            else if (sauce.usersDisliked.includes(req.auth.userId)) {
                Sauce.updateOne({ _id: req.params.id}, {$inc: {dislikes: -1}, $pullAll: {usersDisliked: [req.auth.userId]}})
                .then(() => res.status(200).json({message: "Dislike retiré !"}))
                .catch(error => res.status(500).json({error}))
            }
        }
        else {
            res.status(400).json({message: "Invalid request"});
        }
    })
    .catch(error => res.status(500).json({error}))
}