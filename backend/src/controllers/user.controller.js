import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { setUser } from "../services/authUser.js";
import cloudnaryUpload from "../services/cloudnary.js";
import fs from "fs";

export const createUser = async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json({
      success: true,
      message: "user created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = setUser(user.toObject());

    res
      .status(200)
      .cookie("uid", token, {
        expires: new Date(Date.now() + 2592000000),
      })
      .json({
        success: true,
        message: `Welcome ${user.fullname}`,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id, name, email } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if name or email are different
    const isNameChanged = name && user.name !== name;
    const isEmailChanged = email && user.email !== email;

    if (isNameChanged && isEmailChanged) {
      await User.findByIdAndUpdate(id, { fullname: name });
      await User.findByIdAndUpdate(id, { email });
    } else if (isNameChanged) {
      await User.findByIdAndUpdate(id, { fullname: name });
    } else if (isEmailChanged) {
      await User.findByIdAndUpdate(id, { email });
    }
    try {
      let cloudImage = await cloudnaryUpload(req.file.path);

      // Unlink the file from the local server
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${req.file.path}`, err);
        } else {
          console.log(`Successfully deleted local file: ${req.file.path}`);
        }
      });
      await User.findByIdAndUpdate(id, {
        profilePicture: cloudImage.secure_url,
      });
    } catch (error) {
      console.log(error);
    }

    res.json({
      message: "successfull update profile",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfilePicture = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      res.json(user.profilePicture);
    }
  } catch (error) {
    console.log(error);
  }
};
