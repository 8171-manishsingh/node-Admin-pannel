require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");

const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();
    
    
    
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    
    if (adminExists) {
      console.log("Admin user already exists");
    } else {
      const hash = await bcrypt.hash("admin123", 10);
      
      const admin = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        phone: "1234567890",
        password: hash,
        role: "admin",
        isVerified: true,
        isActive: true
      });
      
      console.log("Admin user created:", admin.email);
    }
    
    // Check if manager already exists
    const managerExists = await User.findOne({ email: "manager@gmail.com" });
    
    if (managerExists) {
      console.log("Manager user already exists");
    } else {
      const hash = await bcrypt.hash("manager123", 10);
      
      const manager = await User.create({
        name: "Manager",
        email: "manager@gmail.com",
        phone: "1234567891",
        password: hash,
        role: "manager",
        isVerified: true,
        isActive: true
      });
      
      console.log("Manager user created:", manager.email);
    }
    
    // Check if employee already exists
    const employeeExists = await User.findOne({ email: "employee@gmail.com" });
    
    if (employeeExists) {
      console.log("Employee user already exists");
    } else {
      const hash = await bcrypt.hash("employee123", 10);
      
      const employee = await User.create({
        name: "Employee",
        email: "employee@gmail.com",
        phone: "1234567892",
        password: hash,
        role: "employee",
        isVerified: true,
        isActive: true
      });
      
      console.log("Employee user created:", employee.email);
    }
    
    console.log("\n===== Seed Complete =====");
    console.log("Default Users:");
    console.log("Admin: admin@gmail.com / admin123");
    console.log("Manager: manager@gmail.com / manager123");
    console.log("Employee: employee@gmail.com / employee123");
    console.log("============================\n");
    
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
