const User = require("../models/user.model");
const bcrypt = require("bcrypt");


exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide name, email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isActive) {
        return res.status(400).json({ msg: "Employee already exists" });
      } else {

        const hash = await bcrypt.hash(password, 10);
        userExists.name = name;
        userExists.phone = phone;
        userExists.password = hash;
        userExists.isActive = true;
        await userExists.save();

        return res.status(201).json({
          ...userExists.toObject(),
          msg: "Employee account reactivated"
        });
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hash,
      role: "employee",
      isVerified: true
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error("Create employee error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get employees error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};



exports.getEmployeeById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "Employee not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Get employee error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const { name, phone, isActive } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const updateData = { name, phone, isActive };
    
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update employee error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};



exports.deleteEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    
    res.json({ msg: "Employee deactivated" });
  } catch (error) {
    console.error("Delete employee error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
