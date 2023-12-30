import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user = req.body.admissionId
      ? await User.findOne({
          admissionId: req.body.admissionId,
        })
      : await User.findOne({
          employeeId: req.body.employeeId,
        });

    console.log(user.email, "user");
    console.log("Amit user" , req.body.password, user.password);

    if (!user) {
      // If user is not found, send a 404 response
      return res.status(404).json("User not found");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) {
      // If the password is invalid, send a 400 response
      console.log("password not match")
      return res.status(400).json("Wrong Password");
    }

    // If user and password are valid, send the user data in the response
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    // Handle other errors, log them, and send an appropriate response
    res.status(500).json("Internal Server Error");
  }
});

export default router;
