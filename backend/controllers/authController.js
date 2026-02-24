const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { nim, password } = req.body;

    // Validasi input
    if (!nim || !password) {
      return res.status(400).json({
        success: false,
        message: "NIM dan password wajib diisi",
      });
    }

    // Cari user berdasarkan NIM
    const user = await User.findOne({ where: { nim } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "NIM atau password salah",
      });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "NIM atau password salah",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        nim: user.nim,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Response tanpa password
    const { password: _, ...userData } = user.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

// GET /api/auth/me  → ambil data user yang sedang login
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = { login, getMe };