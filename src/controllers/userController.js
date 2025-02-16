const User = require('../models/userModel');
const genToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const { uploadToS3, deleteFileFromS3 } = require('../utils/s3Service');

const createUser = async(req, res) => {
    try {
    const { name, email, password, mobileNo, address } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        console.log("User already exists", User);
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ name, email, password, mobileNo, address });
    if (typeof password !== "string") {
        return res.status(400).json({ error: "Password must be a string" });
    }
    if (req.file) {
        newUser.profilePic = await uploadToS3(req.file)
    }
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    newUser.verificationToken = verificationToken;
    await newUser.save()
    const verificationLink = `https://user-and-its-post-management.onrender.com/api/users/verify/${verificationToken}`;
    await sendEmail(email, "Verify Your Email", `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`);
    return res.status(201).json({ message: 'User created successfully', user: {name, email} });
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const updateUser = async(req, res) => {
    try {
        const { name, email, password, mobileNo, address } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.mobileNo = mobileNo || user.mobileNo;
        user.address = address || user.address;
        if (req.file) {
            if (user.profilePic) {
                const fileKey = user.profilePic.replace(
                    `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
                    ""
                );
                await deleteFileFromS3(fileKey);
            }
            user.profilePic = await uploadToS3(req.file)
        }
        await user.save();
        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const getUsers =  async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const users = await User.find();
        return res.status(200).json({ totalUsers: totalUsers, users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (deletedUser.profilePic) {
            const fileKey = deletedUser.profilePic.replace(
                `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
                ""
            );
            await deleteFileFromS3(fileKey);
        }
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = genToken(user);
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const verifyUser = async (req, res) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ email: decoded.email })
        if (!user) {
            return res.status(400).json({ message: "Invalid token" })
        }
        user.verified = true
        user.verificationToken = ''
        await user.save()
        return res.status(200).json({ message: "User verified successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    verifyUser
}