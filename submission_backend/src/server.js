"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const DB_FILE = 'src/db.json';
// Middleware to parse JSON bodies
app.use(body_parser_1.default.json());
// Endpoint to check if server is running
app.get('/ping', (req, res) => {
    res.send('Server is running');
});
// Endpoint to submit a new form
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).send('All fields are required');
    }
    // Read existing submissions from JSON file
    let submissions = [];
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
        submissions = JSON.parse(data);
    }
    catch (err) {
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
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
        res.status(201).send('Submission successful');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to save submission');
    }
});
// Endpoint to read submissions
app.get('/read', (req, res) => {
    const { index } = req.query;
    const submissions = JSON.parse(fs_1.default.readFileSync(DB_FILE, 'utf8'));
    if (index && typeof index === 'string') {
        const idx = parseInt(index);
        if (idx >= 0 && idx < submissions.length) {
            res.json(submissions[idx]);
        }
        else {
            res.status(404).send('Submission not found');
        }
    }
    else {
        res.json(submissions);
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
