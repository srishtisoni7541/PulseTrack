
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import ApiError from "../utils/apiError.js";
import generateToken from "../utils/generateToken.js";


const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const registerOrganization = async (data) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { organizationName, adminName, email, password } = data;

    // 1. Check whether email already exists
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    // 2. Generate organization slug
    const slug = createSlug(organizationName);

    const existingOrganization = await Organization.findOne({
      slug,
    }).session(session);

    if (existingOrganization) {
      throw new ApiError(409, "Organization name is already taken");
    }

    // 3. Hash admin password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create organization
    const [organization] = await Organization.create(
      [
        {
          name: organizationName,
          slug,
          owner: null,
        },
      ],
      { session }
    );

    // 5. Create first admin
    const [admin] = await User.create(
      [
        {
          organization: organization._id,
          name: adminName,
          email,
          passwordHash,
          role: "admin",
          isActive: true,
        },
      ],
      { session }
    );

    // 6. Update organization owner
    organization.owner = admin._id;

    await organization.save({ session });

    // 7. Commit transaction
    await session.commitTransaction();

    // 8. Generate access token
    const accessToken = generateToken(admin);

    return {
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
      },

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },

      accessToken,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (error.code === 11000) {
      throw new ApiError(409, "Email or organization identifier already exists");
    }

    throw error;
  } finally {
    await session.endSession();
  }
};



export const loginUser = async ({ email, password }) => {
  // Find user and explicitly include hidden passwordHash/tokenVersion
  const user = await User.findOne({ email })
    .select("+passwordHash +tokenVersion");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check user status
  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive");
  }

  // Check organization status
  const organization = await Organization.findById(user.organization);

  if (!organization || organization.status !== "active") {
    throw new ApiError(403, "Organization is inactive");
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Generate access token
  const accessToken = generateToken(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organization,
    },
    organization: {
      id: organization._id,
      name: organization.name,
      slug: organization.slug,
    },
    accessToken,
  };
};
