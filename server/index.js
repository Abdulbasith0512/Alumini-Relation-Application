const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const app = express();
const PORT = 3001;
const Application = require("./models/Application");
const Register = require('./models/register');
const Admin = require('./models/admin');
const SuperAdmin = require('./models/super_admin'); // Ensure this model exists
const User = require('./models/user');
const Post = require('./models/postmodel');
const Event = require('./models/event');
const Gallery = require('./models/gallery');
const Alert = require('./models/alert');
const SignupConfig = require('./models/SignupConfig');
const PremiumPlan   = require('./models/premiumplans');
const Subscription  = require('./models/subscription');
const { isSuperAdmin, isAuthenticated } = require('./middleware/auth'); 
mongoose.connect("mongodb://127.0.0.1:27017/alumni_erp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const Job = require("./models/job");
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, 'uploads/'),
    filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


app.get('/users/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const users = await User.find(
      { name: { $regex: q, $options: 'i' } },
      '_id name profilePhoto'
    );
    res.json(users);
  } catch (err) {
    console.error('Error in /users/search:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

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
app.post('/register', upload.any(), async (req, res) => {
  try {
    const existing = await Register.findOne({ email: req.body.email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const data = { ...req.body };

    // Map uploaded files to corresponding field names
    if (req.files?.length) {
      req.files.forEach(file => {
        data[file.fieldname] = file.filename;
      });
    }

    const user = await Register.create(data);
    res.json({ message: "Registration pending admin approval", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// GET Pending Registrations
app.get('/pending-registrations', async (_, res) => {
  try {
    const pendingUsers = await Register.find();
    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// APPROVE REGISTRATION
app.post('/approve/:id', async (req, res) => {
  try {
    const regUser = await Register.findById(req.params.id).lean();
    if (!regUser) return res.status(404).json({ error: 'User not found' });

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
      profilePhoto: regUser.profile_image || "", // Adjust field name here
      address: "", jobTitle: "", company: "", linkedin: "", github: "", bio: "",
      ...regUser // include other custom fields
    });

    await newUser.save();
    await Register.findByIdAndDelete(req.params.id);

    res.json({ message: 'User approved and added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// REJECT USER
app.delete('/reject/:id', async (req, res) => {
  try {
    await Register.findByIdAndDelete(req.params.id);
    res.json({ message: 'User rejected and removed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CHECK IF EMAIL EXISTS
app.get('/api/check-registers', async (req, res) => {
  try {
    const exists = await Register.findOne({ email: req.query.email });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET SIGNUP CONFIG
async function getSignupConfig() {
  return await SignupConfig.findOneAndUpdate(
    {},
    {},
    { new: true, upsert: true }
  ).lean();
}

app.get('/api/signup-config', async (req, res) => {
  try {
    const cfg = await getSignupConfig();
    res.json(cfg);
  } catch (err) {
    console.error('GET /api/signup-config', err);
    res.status(500).json({ error: 'Failed to fetch signup config' });
  }
});

// UPDATE SIGNUP CONFIG
app.put('/api/signup-config', async (req, res) => {
  try {
    const cfg = await SignupConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true
    }).lean();
    res.json({ message: 'Config updated', cfg });
  } catch (err) {
    console.error('PUT /api/signup-config', err);
    res.status(500).json({ error: 'Failed to update signup config' });
  }
});

// ADD NEW SIGNUP FIELD
app.post('/api/signup-config/field', async (req, res) => {
  const { key, label, type = 'text', required = false } = req.body;
  if (!key || !label)
    return res.status(400).json({ error: 'key and label required' });

  try {
    const cfg = await getSignupConfig();

    if (cfg.customFields?.some(f => f.key.toLowerCase() === key.toLowerCase())) {
      return res.status(400).json({ error: 'Field already exists' });
    }

    const updated = await SignupConfig.findOneAndUpdate(
      {},
      {
        $push: {
          customFields: { key, label, type, required, visible: true }
        }
      },
      { new: true }
    ).lean();

    res.json({
      message: 'Field added',
      customFields: updated.customFields
    });
  } catch (err) {
    console.error('POST /api/signup-config/field', err);
    res.status(500).json({ error: 'Could not add field' });
  }
});

// ✅ Multer Error Handler Middleware (keep at end)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Max size is 5MB.' });
  }
  if (err.message === 'Invalid file type. Only JPG, PNG, and PDF are allowed.') {
    return res.status(422).json({ error: err.message });
  }
  next(err);
});

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
// POST /posts/:postId/like
app.post("/posts/:postId/like", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // Toggle like
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
});
app.post("/posts/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body;

  try {
    if (!userId || !comment) {
      return res.status(400).json({ error: "Missing userId or comment text" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ user: userId, comment });
    await post.save();

    res.status(200).json({ message: "Comment added", comments: post.comments.length });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
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
app.get('/admin/users/premium-status', async (req, res) => {
  try {
    const users = await User.find({}, 'name email premium');

    const now = new Date();

    const formattedUsers = users.map((user) => {
      const isActive = user.premium?.startDate && user.premium?.endDate
        ? user.premium.startDate <= now && user.premium.endDate >= now
        : false;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        premiumStatus: isActive ? 'Active' : 'Inactive',
        startDate: user.premium?.startDate,
        endDate: user.premium?.endDate
      };
    });

    res.json(formattedUsers);
  } catch (err) {
    console.error('Error fetching premium user data:', err);
    res.status(500).json({ error: 'Failed to fetch premium status data' });
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

setInterval(async () => {
  await Event.updateMany(
    { date: { $lt: new Date() }, status: "active" },
    { $set: { status: "inactive" } }
  );
}, 1000 * 60 * 60 * 24); // 24 h

app.post('/api/events', isAuthenticated, async (req, res) => {
  try {
    console.log("POST /api/events body:", req.body);
    
    const user = req.user; // 🔍 You were referencing `user`, make sure it's defined.
    if (!user?.premium?.startDate || !user.premium?.endDate || user.premium.endDate < new Date()) {
      return res.status(403).json({ error: 'You need an active subscription to post jobs.' });
    }

    const event = new Event(req.body); 
    await event.save();

    res.status(201).send(event);
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).send({ error: "Event creation failed", details: err.message });
  }
});

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

app.get("/events/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

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

app.get("/events/not-enrolled/:userId", async (req, res) => {
  try {
    const events = await Event.find({ enrolledUsers: { $ne: req.params.userId } });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/events/enrolled/:userId", async (req, res) => {
  try {
    const events = await Event.find({ enrolledUsers: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrolled events" });
  }
});

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

// Get all alerts (no user filter)
app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Delete alert by ID
app.delete("/api/alerts/:id", async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notify route – save alert for all users (user: null)
app.post("/notify", async (req, res) => {
  const { message, title = "Notice", postId = null } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const alert = await Alert.create({
      message,
      title,
      relatedPost: postId,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Notice stored", alert });
  } catch (err) {
    res.status(500).json({ error: "Failed to send notice" });
  }
});

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
const logoStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/logos"),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const uploadLogo = multer({ storage: logoStorage });
const resumeStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/resumes"),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`)
});
const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: (_, file, cb) => {
    // accept only PDFs
    cb(null, file.mimetype === "application/pdf");
  }
});
app.post("/create-job", isAuthenticated, uploadLogo.single("logo"), async (req, res) => {
  const user = req.user; // ✅ define user from req.user

  if (!user?.premium?.startDate || !user.premium?.endDate || user.premium.endDate < new Date()) {
    return res.status(403).json({ error: 'You need an active subscription to post jobs.' });
  }

  const { title, description, company, location, salary, userId } = req.body;
  if (!title || !description || !company || !location || !userId)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      userId,
      logo: req.file?.filename || null
    });
    res.status(201).json({ message: "Job posted", job });
  } catch (err) {
    console.error("Job create error:", err);
    res.status(500).json({ error: "Failed to post job" });
  }
});
app.get("/jobs", async (_, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate("userId", "name");
    res.json(jobs);
  } catch {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});
app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("userId", "name");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});
app.delete("/jobs/:jobId", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.logo) fs.unlink(`uploads/${job.logo}`, () => {});
    res.json({ message: "Job deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete job" });
  }
});
app.post("/jobs/:jobId/apply", uploadResume.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Resume (PDF) is required." });
    if (!req.body.name || !req.body.email || !req.body.applicant)
      return res.status(400).json({ error: "Name, email, and applicant ID are required." });
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const application = await Application.create({
      applicant: req.body.applicant,      // 👈 save ObjectId of user
      job: job._id,
      name: req.body.name,
      email: req.body.email,
      resume: req.file.filename
    });
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error("Error applying for job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/applications/user/:userId", async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.params.userId }) // 👈 query by ObjectId
      .populate("job", "title company location logo")
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/jobs/:jobId/applications", async (req, res) => {
  const { jobId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }
    const apps = await Application.find({ job: jobId }).sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/applications/user/:userId", async (req, res) => {
  try {
    const apps = await Application.find({ email: req.params.userId })  // or `applicantId` if you store an ObjectId
      .populate("job", "title company location logo")
      .sort({ appliedAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// you write these
app.get('/api/admin/plans', isAuthenticated, isSuperAdmin, async (req, res) => {
  try {
    const plans = await PremiumPlan.find().sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    console.error('Failed to fetch plans:', err);
    res.status(500).json({ error: 'Server error fetching plans' });
  }
});
app.post('/api/admin/plans', isAuthenticated, isSuperAdmin, async (req, res) => {
  try {
    const { name, price, durationDays, description } = req.body;
    const plan = await PremiumPlan.create({ name, price, durationDays, description });
    res.json(plan);
  } catch (err) {
    console.error('Plan creation failed:', err);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});
app.put('/api/admin/plans/:id', isAuthenticated, isSuperAdmin, async (req, res) => {
  try {
    const plan = await PremiumPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (err) {
    console.error('Plan update failed:', err);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});
app.delete('/api/admin/plans/:id', isAuthenticated, isSuperAdmin, async (req, res) => {
  try {
    await PremiumPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    console.error('Plan delete failed:', err);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});
app.get('/api/plans', async (req, res) => {
  try {
     const plans = await PremiumPlan.find();

    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/subscribe/:planId', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const plan = await PremiumPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const now = new Date();

    // If user already has active subscription
    if (user.premium?.startDate && user.premium?.endDate) {
      const isActive = user.premium.startDate <= now && user.premium.endDate >= now;
      if (isActive) {
        return res.status(400).json({ error: 'You already have an active subscription' });
      }
    }

    const end = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000); // days -> ms

    user.premium = {
      planId: plan._id,
      startDate: now,
      endDate: end
    };

    await user.save();

    res.json({ message: `Subscribed to ${plan.name} plan successfully`, plan });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: 'Subscription failed' });
  }
});


app.get('/api/my-sub', isAuthenticated, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
      end: { $gte: new Date() },
    }).populate('planId');

    res.json({ active: !!sub, sub });
  } catch (err) {
    console.error('Fetch subscription failed:', err);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});
app.post('/api/subscribe/:planId', isAuthenticated, async (req, res) => {
  try {
    const plan = await PremiumPlan.findById(req.params.planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const existing = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
      end: { $gte: new Date() },
    });
    if (existing) return res.status(400).json({ error: 'You already have an active subscription' });

    const start = new Date();
    const end = new Date(start.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    const sub = await Subscription.create({
      userId: req.user._id,
      planId: plan._id,
      start,
      end,
      status: 'active',
    });
    res.json({ message: 'Subscription active', sub });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/admin/users/premium-status', async (req, res) => {
  const User = require('./models/user'); // Adjust path if needed

  try {
    const users = await User.find().select('name email premium');

    const result = users.map(u => {
      const now = new Date();
      const isActive =
        u.premium?.startDate && u.premium?.endDate &&
        now >= u.premium.startDate && now <= u.premium.endDate;

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        premiumStatus: isActive ? 'Active' : 'Inactive',
        startDate: u.premium?.startDate,
        endDate: u.premium?.endDate,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch premium status' });
  }
});


app.get('/api/plans', async (req, res) => {
  try {
    const plans = await PremiumPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

app.post('/admin/plans', async (req, res) => {
  const { name, durationDays, price, description = '' } = req.body;
  try {
    const plan = new PremiumPlan({ name, durationDays, price, description });
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

app.delete('/api/plans/:id', async (req, res) => {
  try {
    await PremiumPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});
app.post('/api/subscribe/:id', isAuthenticated, async (req, res) => {
  const Plan = require('./models/premiumPlan');

  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + plan.durationDays);

    req.user.premium = {
      planId: plan._id,
      startDate: start,
      endDate: end
    };

    await req.user.save();

    res.json({ message: `Subscribed to ${plan.name} plan until ${end.toDateString()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Subscription failed' });
  }
});


app.use(express.json());

const Message = require("./models/message");   

/* 🔍 SEARCH users by name */
app.get('/users/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const users = await User.find(
      { name: { $regex: q, $options: 'i' } },
      '_id name email profilePhoto' // include _id
    );
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    console.error(err.stack); // <--- this helps pinpoint the error
    res.status(500).json({ error: 'Could not fetch users' });
  }
});
app.get('/messages/convo/:idA/:idB', async (req, res) => {
  const { idA, idB } = req.params;

  console.log("📥 Request received for conversation:");
  console.log("➡️ idA:", idA);
  console.log("➡️ idB:", idB);

  // Validate ObjectIDs
  if (
    !mongoose.Types.ObjectId.isValid(idA) ||
    !mongoose.Types.ObjectId.isValid(idB)
  ) {
    console.error("❌ Invalid user ID(s)");
    return res.status(400).json({ error: 'Invalid user ID(s)' });
  }

  try {
    // Convert strings to ObjectId explicitly
    const objectIdA = new mongoose.Types.ObjectId(idA);
    const objectIdB = new mongoose.Types.ObjectId(idB);

    // Log for debug
    console.log("🔍 Querying messages between:", objectIdA, objectIdB);

    const convo = await Message.find({
      $or: [
        { senderId: objectIdA, receiverId: objectIdB },
        { senderId: objectIdB, receiverId: objectIdA },
      ],
    }).sort({ timestamp: 1 });

    console.log(`✅ Found ${convo.length} messages`);
    res.json(convo);
  } catch (err) {
    console.error('💥 Error fetching conversation:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

/* 🚀 POST a message */
app.post('/messages', async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    return res.status(400).json({ error: 'Invalid sender or receiver ID' });
  }

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message text required' });
  }

  try {
    const msg = await Message.create({ senderId, receiverId, message });
    res.status(201).json(msg);
  } catch (err) {
    console.error('Error sending message:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Could not send message' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
