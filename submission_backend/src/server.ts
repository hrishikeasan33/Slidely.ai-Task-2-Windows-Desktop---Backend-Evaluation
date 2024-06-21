import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = 'src/db.json';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to check if server is running
app.get('/ping', (req: Request, res: Response) => {
  res.send('Server is running');
});

// Endpoint to submit a new form
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).send('All fields are required');
  }

  // Read existing submissions from JSON file
  let submissions: any[] = [];
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    submissions = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  // Create new submission object
  const newSubmission = {
    name,
    email,
    phone,
    github_link,
    stopwatch_time,
  };

  // Add new submission to submissions array
  submissions.push(newSubmission);

  // Write updated submissions back to JSON file
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
    res.status(201).send('Submission successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to save submission');
  }
});

// Endpoint to read submissions
app.get('/read', (req: Request, res: Response) => {
  const { index } = req.query;
  const submissions: any[] = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  if (index && typeof index === 'string') {
    const idx = parseInt(index);
    if (idx >= 0 && idx < submissions.length) {
      res.json(submissions[idx]);
    } else {
      res.status(404).send('Submission not found');
    }
  } else {
    res.json(submissions);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
