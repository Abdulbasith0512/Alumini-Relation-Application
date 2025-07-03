const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = 3001;

// MongoDB Models
const Register = require('./models/register');
const Admin = require('./models/admin');
const SuperAdmin = require('./models/super_admin'); // Ensure this model exists
const User = require('./models/user');
const Post = require('./models/postmodel');
const Event = require('./models/event');
const Gallery = require('./models/gallery');
const Alert = require('./models/alert');

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/alumni_erp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Config
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  })
});


// Auto-create Admin
// ------------------------- AUTO CREATE ADMINS -------------------------
(async () => {
  try {
    // Create Admin if not exists
    const adminExists = await Admin.findOne({ ID: "Admin123" });
    if (!adminExists) {
      await Admin.create({ ID: "Admin123", password: "adminpassword123" });
      console.log("✅ Admin user created");
    }

    // Create SuperAdmin if not exists
    const superAdminExists = await SuperAdmin.findOne({ ID: "SuperAdmin01" });
    if (!superAdminExists) {
      await SuperAdmin.create({ ID: "SuperAdmin01", password: "superSecret@123" });
      console.log("✅ SuperAdmin user created");
    }
  } catch (err) {
    console.error("❌ Error creating default users:", err);
  }
})();

// --------------------------- AUTH ---------------------------

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const finalUser = await User.findOne({ email });
    if (finalUser && finalUser.password === password) {
      return res.json({ message: "Login successful", user: finalUser, approved: true });
    }

    const regUser = await Register.findOne({ email });
    if (regUser && regUser.password === password) {
      return res.json({ message: "Login successful", user: regUser, approved: false });
    }

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
    if (admin?.password === password)
      return res.json({ message: "Admin login successful", admin });

    res.status(401).json({ error: "Invalid admin credentials" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/superadminlogin', async (req, res) => {
  const { ID, password } = req.body;

  try {
    const superadmin = await SuperAdmin.findOne({ ID });

    if (!superadmin) {
      return res.status(401).json({ error: 'Invalid ID' });
    }

    if (superadmin.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.status(200).json({ message: 'SuperAdmin logged in successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --------------------------- REGISTRATION ---------------------------

app.post('/register', upload.single('Profile_photo'), async (req, res) => {
  const { name, enrollmentNumber, email, mobileNumber, otp, password, degree, batchYear } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No profile photo uploaded' });

  try {
    const user = await Register.create({
      name, enrollmentNumber, email, mobileNumber, otp, password, degree, batchYear,
      Profile_photo: file.filename
    });
    res.json({ message: "Registration pending admin approval", user });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.get('/pending-registrations', async (_, res) => {
  try {
    const pendingUsers = await Register.find();
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/approve/:id', async (req, res) => {
  try {
    const regUser = await Register.findById(req.params.id);
    if (!regUser) return res.status(404).json({ error: 'User not found in registration list' });

    const existing = await User.findOne({ email: regUser.email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const newUser = new User({
      name: regUser.name,
      C_reg: regUser.enrollmentNumber,
      email: regUser.email,
      M_number: regUser.mobileNumber,
      password: regUser.password,
      batchYear: regUser.batchYear,
      department: regUser.degree,
      profilePhoto: regUser.Profile_photo,
      address: "", jobTitle: "", company: "", linkedin: "", github: "", bio: ""
    });

    await newUser.save();
    await Register.findByIdAndDelete(req.params.id);
    res.json({ message: 'User approved and moved to users collection' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/reject/:id', async (req, res) => {
  try {
    await Register.findByIdAndDelete(req.params.id);
    res.json({ message: 'User rejected and removed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/check-registers', async (req, res) => {
  const { email } = req.query;
  try {
    const exists = await Register.findOne({ email });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --------------------------- USERS ---------------------------

app.get('/users', async (_, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/users/:id', upload.single('profilePhoto'), async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.Profile_photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// --------------------------- POSTS ---------------------------

app.post('/create-post', upload.single('photo'), async (req, res) => {
  const { userId, bio } = req.body;
  try {
    const post = await Post.create({
      user: userId,
      bio,
      photo: req.file?.filename,
      likes: [],
      comments: []
    });
    res.json({ message: "Post created", post });
  } catch {
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
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');
    res.json(post);
  } catch {
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
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    await post.deleteOne();
    await Alert.create({
      user: post.user,
      message: "⚠️ Your post was removed by an admin for violating guidelines.",
      relatedPost: post._id,
      createdAt: new Date(),
    });

    res.json({ message: "Post deleted and author notified" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// --------------------------- EVENTS ---------------------------


/* auto‑deactivate past events every 24 h */
setInterval(async () => {
  await Event.updateMany(
    { date: { $lt: new Date() }, status: "active" },
    { $set: { status: "inactive" } }
  );
}, 1000 * 60 * 60 * 24); // 24 h

/* CREATE event */
app.post("/events", upload.single("image"), async (req, res) => {
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

/* LIST events
   - default: only “active”
   - add ?includePast=true to get everything (active + inactive) */
app.get("/events", async (req, res) => {
  try {
    const includePast = req.query.includePast === "true";
    const filter = includePast ? {} : { status: "active" };
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/* GET single event */
app.get("/events/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

/* ENROLL user in event */
app.post("/events/:eventId/enroll", async (req, res) => {
  const { userId } = req.body;
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.enrolledUsers.includes(userId))
      return res.status(400).json({ error: "Already enrolled" });

    event.enrolledUsers.push(userId);
    await event.save();
    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Enrollment failed" });
  }
});

/* ROSTER for an event */
app.get("/events/:eventId/enrolled-users", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("enrolledUsers", "name email");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ users: event.enrolledUsers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrolled users" });
  }
});

/* EVENTS current user is NOT enrolled in */
app.get("/events/not-enrolled/:userId", async (req, res) => {
  try {
    const events = await Event.find({ enrolledUsers: { $ne: req.params.userId } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/* EVENTS current user IS enrolled in */
app.get("/events/enrolled/:userId", async (req, res) => {
  try {
    const events = await Event.find({ enrolledUsers: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrolled events" });
  }
});

/* DELETE event  (also removes image file) */
app.delete("/events/:eventId", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.image) {
      await fs.unlink(`uploads/${event.image}`).catch(() => {});
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// --------------------------- GALLERY ---------------------------

app.post('/api/gallery', upload.array('files', 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });

    const media = req.files.map(f => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
      type: f.mimetype.startsWith('video') ? 'video' : 'image'
    }));

    const item = await Gallery.create({ title, description, media });
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to upload' });
  }
});

app.get('/api/gallery', async (_, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery post deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete gallery post" });
  }
});

// --------------------------- ALERTS ---------------------------

app.post("/api/alerts", async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/alerts", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { $or: [{ user: null }, { user: userId }] } : { user: null };
    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

app.delete("/api/alerts/:id", async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notify", async (req, res) => {
  const { userId, message, postId = null } = req.body;

  if (!userId || !message)
    return res.status(400).json({ error: "userId and message are required" });

  try {
    const alert = await Alert.create({
      user: userId,
      message,
      relatedPost: postId,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Notice stored", alert });
  } catch (err) {
    res.status(500).json({ error: "Failed to send notice" });
  }
});

// --------------------------- BULK IMPORT ---------------------------

app.post("/import-users", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    fs.unlink(req.file.path, () => {});

    const ops = rows.map(r => ({
      updateOne: {
        filter: { email: r.email },
        update: { $setOnInsert: mapRow(r) },
        upsert: true
      }
    }));

    const result = await User.bulkWrite(ops);
    res.json({ inserted: result.nUpserted });
  } catch (err) {
    res.status(500).json({ error: "Import failed" });
  }
});

function mapRow(r) {
  return {
    name: r.name || r.Name,
    C_reg: r.C_reg,
    email: r.email,
    M_number: r.M_number,
    C_certificate: r.C_certificate,
    password: r.password,
    address: r.address,
    batchYear: r.batchYear,
    department: r.department,
    Branch_Location: r.Branch_Location,
    Membership_status: r.Membership_status,
    jobTitle: r.jobTitle,
    company: r.company,
    linkedin: r.linkedin,
    github: r.github,
    bio: r.bio,
    profilePhoto: r.profilePhoto,
  };
}



// GET /events/:eventId/enrollments


// --------------------------- START SERVER ---------------------------

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
// GET /events/:id/enrollments  ➜  list everyone enrolled in an event
