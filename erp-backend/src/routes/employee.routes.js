const router = require("express").Router();
const emp = require("../controllers/employee.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.use(auth);

router.post("/", role("admin", "manager"), emp.createEmployee);
router.get("/", role("admin", "manager"), emp.getEmployees);
router.get("/all", role("admin"), emp.getAllUsers);
router.get("/:id", role("admin", "manager"), emp.getEmployeeById);
router.put("/:id", role("admin"), emp.updateEmployee);
router.delete("/:id", role("admin"), emp.deleteEmployee);

module.exports = router;
