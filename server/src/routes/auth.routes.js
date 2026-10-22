
import { Router } from "express";

import {
  register,
  login,
} from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/auth.validations.js";



const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

export default router;
