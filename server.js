require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // ✅ Fixed: Removed duplicate import
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// ✅ Product Schema
const Product = mongoose.model("Product", {
    name: String,
    price: Number,
    image: String,
});

// ✅ User Schema
const User = mongoose.model("User", {
    username: String,
    email: String,
    password: String,
});

// ✅ Cart Schema
const Cart = mongoose.model("Cart", {
    userId: String,
    items: [{ productId: String, quantity: Number }],
});

// ✅ Get all products
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// ✅ Signup API
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered successfully" });
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
});

// ✅ Add to Cart API
app.post("/api/add-to-cart", async (req, res) => {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
    } else {
        cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    res.json({ message: "Item added to cart" });
});

// ✅ Checkout API
app.post("/api/checkout", async (req, res) => {
    const { name, email, productId } = req.body;
    res.json({ message: `Order placed by ${name} for product ${productId}. Confirmation sent to ${email}` });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
