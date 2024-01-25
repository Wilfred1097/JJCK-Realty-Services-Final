require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(cookieParser());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jjck',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check database connection
pool.getConnection((connectionError, connection) => {
  if (connectionError) {
    console.error('Error connecting to the database:', connectionError.message);
    process.exit(1); // Exit the process if the database connection fails
  }

  console.log('Connected to the database!');
  connection.release(); // Release the connection

  // Continue with your Express app setup
  app.get('/', (req, res) => {
    res.send('Hello from the server!');
  });


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// register api
app.post('/register', async (req, res) => {
  const { completename, birthdate, address, email, password } = req.body;

  try {
    // Check if the email already exists
    pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (selectError, selectResults) => {
        if (selectError) {
          console.error('Error checking email existence:', selectError.message);
          return res.status(500).json({ message: 'Error checking email existence', error: selectError.message });
        }

        // If email already exists, return an error
        if (selectResults.length > 0) {
          return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Insert user data into the 'users' table
        pool.execute(
          'INSERT INTO users (complete_name, birthdate, address, email, password) VALUES (?, ?, ?, ?, ?)',
          [completename, birthdate, address, email, hashedPassword],
          (insertError, insertResults) => {
            if (insertError) {
              console.error('Error inserting user data:', insertError.message);
              return res.status(500).json({ message: 'Error registering user', error: insertError.message });
            }

            console.log('User registered successfully');
            res.status(200).json({ message: 'User registered successfully' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ message: 'Unexpected error', error: error.message });
  }
});

// Helper function to generate JWT token
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}
// Login api
// Login api
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    const [user] = await pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password from the database
    const isPasswordValid = await bcryptjs.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign a JWT with a secret key
    const token = jwt.sign({ userId: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

    // Send the token in the response
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  
  // Respond with a success message
  res.status(200).json({ message: 'Logout successful' });
});
