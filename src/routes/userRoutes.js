const express = require('express')
const upload = require('../middlewares/upload')
const router = express.Router()

const { createUser, getUsers,  updateUser, deleteUser, loginUser, verifyUser } = require('../controllers/userController')

router.post('/users', upload.single("profilePic"), createUser)

router.get('/users', getUsers)

router.put('/users/:id', upload.single("profilePic"), updateUser)

router.delete('/users/:id', deleteUser)

router.post("/users/login", loginUser);

router.get("/users/verify/:token", verifyUser);

module.exports = router
