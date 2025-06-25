const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Models
const Register = require('./models/register');
const Admin = require('./models/admin');
const User = require('./models/user');
const Post = require('./models/postmodel');
const Event = require('./models/event');

const app = express();
const PORT = 3001;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/alumni_erp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  })
});

// Auto-create admin
Admin.findOne({ ID: "Admin123" }).then(admin => {
  if (!admin) {
    Admin.create({ ID: "Admin123", password: "adminpassword123" })
      .then(() => console.log("✅ Admin user created"));
  }
});


// --------------------------- AUTH ---------------------------

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check in approved users collection
    const finalUser = await User.findOne({ email });
    if (finalUser && finalUser.password === password) {
      return res.json({
        message: "Login successful",
        user: finalUser,
        approved: true
      });
    }

    // 2. Check in pending registered users
    const regUser = await Register.findOne({ email });
    if (regUser && regUser.password === password) {
      return res.json({
        message: "Login successful",
        user: regUser,
        approved: false
      });
    }

    // 3. If not found
    res.status(401).json({ error: "Invalid email or password" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/adminlogin", async (req, res) => {
  const { ID, password } = req.body;
  try {
    const admin = await Admin.findOne({ ID });
    if (admin?.password === password) return res.json({ message: "Admin login successful", admin });
    res.status(401).json({ error: "Invalid admin credentials" });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --------------------------- REGISTRATION ---------------------------

app.post('/register', upload.single('Profile_photo'), async (req, res) => {
  const {
    name, enrollmentNumber, email, mobileNumber,
    otp, password, degree, batchYear
  } = req.body;

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No profile photo uploaded' });

  try {
    const user = await Register.create({
      name, enrollmentNumber, email, mobileNumber,
      otp, password, degree, batchYear,
      Profile_photo: file.filename
    });
    res.json({ message: "Registration pending admin approval", user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.get('/pending-registrations', async (_, res) => {
  try {
    const pendingUsers = await Register.find();
    res.json(pendingUsers);
  } catch (err) {
    console.error("Fetch registrations error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post('/approve/:id', async (req, res) => {
  try {
    const regUser = await Register.findById(req.params.id);
    if (!regUser) return res.status(404).json({ error: 'User not found in registration list' });

    const existing = await User.findOne({ email: regUser.email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const {
      name,
      enrollmentNumber,
      email,
      mobileNumber,
      password,
      degree,
      batchYear,
      Profile_photo
    } = regUser;

    const newUser = new User({
      name,
      C_reg: enrollmentNumber,
      email,
      M_number: mobileNumber,
      password,
      batchYear,
      department: degree,
      profilePhoto: Profile_photo,

      // Optional: Initialize these as empty so they can be updated later
      address: "",
      jobTitle: "",
      company: "",
      linkedin: "",
      github: "",
      bio: ""
    });

    await newUser.save();
    await Register.findByIdAndDelete(req.params.id);

    res.json({ message: 'User approved and moved to users collection' });
  } catch (err) {
    console.error('Approval error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/reject/:id', async (req, res) => {
  try {
    await Register.findByIdAndDelete(req.params.id);
    res.json({ message: 'User rejected and removed' });
  } catch (err) {
    console.error('Reject error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/check-registers', async (req, res) => {
  const { email } = req.query;
  try {
    const exists = await Register.findOne({ email });
    res.json({ exists: !!exists });
  } catch (err) {
    console.error("Check error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// --------------------------- POSTS ---------------------------

app.post('/create-post', upload.single('photo'), async (req, res) => {
  const { userId, bio } = req.body;
  const file = req.file;

  try {
    const post = await Post.create({
      user: userId,
      bio,
      photo: file?.filename,
      likes: [],
      comments: []
    });
    res.json({ message: "Post created", post });
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/posts', async (_, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.get('/posts/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// --------------------------- USERS ---------------------------

app.get('/users', async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


app.put('/users/:id', upload.single('profilePhoto'), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.Profile_photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// --------------------------- EVENTS ---------------------------

app.post('/events', upload.single('image'), async (req, res) => {
  const { title, description, date, location } = req.body;
  const image = req.file?.filename;

  if (!title || !description || !date || !location || !image)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const event = await Event.create({ title, description, date, location, image });
    res.json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

app.get('/events', async (_, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get('/events/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

app.post('/events/:eventId/enroll', async (req, res) => {
  const { userId } = req.body;
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.enrolledUsers.includes(userId))
      return res.status(400).json({ error: 'Already enrolled' });

    event.enrolledUsers.push(userId);
    await event.save();
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/events/:eventId/enrolled-users', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('enrolledUsers', 'name email');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ users: event.enrolledUsers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrolled users' });
  }
});

app.get('/events/not-enrolled/:userId', async (req, res) => {
  try {
    const events = await Event.find({ enrolledUsers: { $ne: req.params.userId } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/events/enrolled/:userId', async (req, res) => {
  try {
    const events = await Event.find({ enrolledUsers: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrolled events' });
  }
});

// --------------------------- START SERVER ---------------------------

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
const Alert = require('./models/alert'); // ✅ Correct way to import the model


// Create alert
app.post("/api/alerts", async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all alerts
app.get("/api/alerts", async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
});

// Delete alert
app.delete("/api/alerts/:id", async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
