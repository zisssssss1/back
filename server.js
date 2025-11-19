const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // 允许没有origin的请求（如Postman、curl等）
    if (!origin) return callback(null, true);

    // 允许所有 vercel.app 域名
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // 允许配置的前端URL
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    // 开发环境允许localhost
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    // 其他情况拒绝
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Portfolio & Blog API' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
