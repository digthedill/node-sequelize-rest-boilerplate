import { Router } from "express";

const user = require("../controllers/user.controller");
const router = Router();

// all routes
router.get("/all", user.getAllUsers);
router.get("/:id", user.getUser);
router.post("/register", user.createUser);
router.put("/:id", user.updateUser);
router.post("/delete", user.deleteUser);

export default router;
