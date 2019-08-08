// implement your API here
const express = require('express')

// Database
const db = require('./data/db')

const server = express()

// Middleware
server.use(express.json())

server.get('/', (req, res) => {
    res.send('Sup')
})

// POST
server.post('/api/users', (req, res) => {
    const newUser = req.body
    if(!req.body.name || !req.body.bio){
        res.status(400).json({
            errorMessage: 'Please provide a name and bio for the user.'
        })
    }
    db.insert(newUser)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({
                error: 'There was an error while saving the user to the database'
            })
        })
})

// GET all
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({
                error: 'The users information could not be retreived'
            })
        })
})

// GET by id
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    db.findById(id)
        .then(foundUser => {
            if(foundUser) {
                res.json(foundUser)
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist.'
                })
            }
        })
    .catch(err => {
        res.status(500).json({
            error: 'The user information could not be retreived'
        })
    })
})

// DELETE
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    db.remove(id)
        .then(deletedUser => {
            if(deletedUser) {
                let newList = []
                db.find()
                    .then(userList => {
                        newList = userList
                        res.status(200).json(newList)
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: "The user was deleted but there was error while retreiving the new user list"
                        })
                    })
                                    
            } else {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The user information could not be deleted"
            })
        })
})

// PUT




//END
server.listen(4000, () => {
    console.log("Server is online on port 4000...")
})