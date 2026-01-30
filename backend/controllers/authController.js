import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // HARD-CODED ADMIN CREDENTIALS
  if (email !== "admin@gmail.com" || password !== "123456") {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  // Token expiry
  const expiresIn = rememberMe ? "7d" : "1d";

  // Generate token
  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  res.status(200).json({
    message: "Admin login successful",
    token,
    user: {
      email,
      role: "admin"
    }
  });
};
