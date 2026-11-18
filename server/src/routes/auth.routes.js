
import express from "express";
import validate from "../middlewares/validate.middleware.js";
import { loginSchema, registerOrganizationSchema } from "../validators/auth.validator.js";
import { loginController, registerOrganizationController } from "../controllers/auth.controller.js";

;

const router = express.Router();

router.post(
  "/register-organization",
  validate(registerOrganizationSchema),
  registerOrganizationController
);



router.post(
  "/login",
  validate(loginSchema),
  loginController
);


export default router;
