require("dotenv").config();
const cors = require("cors");

const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));



connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


  
app.use("/auth", require("./routes/auth.routes"));
app.use("/employees", require("./routes/employee.routes"));


app.get("/", (req, res) => {
  res.json({ message: "ERP Backend API is running", status: "OK" });
});


app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
});
