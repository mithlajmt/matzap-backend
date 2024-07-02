const User = require('../models/user');
const bcrypt = require('bcrypt');

const validateUserData = async (req, res) => {
    console.log(req.body,'jjjjjjjjj');
    const { userName, email, password, confirmPassword } = req.body;
  
    // Check for missing fields
    if (!userName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Please fill all the fields: userName, email, password, confirmPassword",
      });
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and confirm password do not match",
      });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "User with this email already exists",
        });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with the hashed password
      const user = new User({
        userName,
        email,
        password: hashedPassword,
      });
  
      // Save the user
      await user.save();
  
      // Send a success response
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email
          // Don't send the password back, even if it's hashed
        },
      });
    } catch (error) {
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(', '),
        });
      }
  
      // Handle any other errors
      console.log(error)
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      });
    }
  };

const loginChecker = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Check if the input is an email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { userName: emailOrUsername }
            ]
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // If everything is correct, send a success response
        // You might want to generate a JWT token here for authentication
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = {
    validateUserData,
    loginChecker,
};
