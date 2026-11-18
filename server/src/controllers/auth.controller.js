
import { loginUser, registerOrganization } from "../services/auth.service.js";
import asyncHandler from "../utils/ayncHandler.js";


export const registerOrganizationController = asyncHandler(
  async (req, res) => {
    const result = await registerOrganization(req.body);

    res.status(201).json({
      success: true,
      message: "Organization registered successfully",
      data: result,
    });
  }
);






export const loginController = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data,
  });
});

