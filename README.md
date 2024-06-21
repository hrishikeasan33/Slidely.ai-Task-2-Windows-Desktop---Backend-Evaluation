# Submission App - Windows Desktop Application

Submission App is a Windows Desktop application built with Visual Basic. It provides an intuitive interface for managing submissions, allowing users to view and create submission records easily. This project is part of Task 2 for Slidely.ai task submissions.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Forms Overview](#forms-overview)
- [Troubleshooting](#troubleshooting)
- [Backend Server Description](#backend-server-description)
- [Backend Server Evaluation](#backend-server-evaluation)

## Features

- **View Submissions**: Display detailed information about existing submissions.
- **Create Submissions**: Fill in submission details and save them to the backend server.
- **Keyboard Shortcuts**: Efficient navigation and actions.
- **Stopwatch Integration**: Track and record the duration of tasks.

## Installation

### Frontend Setup

#### Prerequisites

- [Visual Studio](https://visualstudio.microsoft.com/)
- [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework)
- A running instance of the backend server (refer to Backend Setup for instructions)

#### Setup Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/submission-app.git
    cd submission-app
    ```

2. **Open the Solution in Visual Studio**:
    - Launch Visual Studio.
    - Open the solution file `SubmissionApp.sln` located in the `submission-app` directory.

3. **Build the Project**:
    - In Visual Studio, select `Build` -> `Rebuild Solution` from the menu.

### Backend Setup

The backend server is built with Express and TypeScript, handling the submission data storage and retrieval.

#### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

#### Setup Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/submission-app-backend.git
    cd submission-app-backend
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Create a `tsconfig.json` File**:
    ```json
    {
      "compilerOptions": {
        "target": "ES6",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true
      }
    }
    ```

4. **Create the Express Server**:
    Create a file named `src/index.ts` and add the following code:
    ```typescript
    import express from 'express';
    import bodyParser from 'body-parser';
    import fs from 'fs';

    const app = express();
    const port = 3000;

    app.use(bodyParser.json());

    interface Submission {
        name: string;
        email: string;
        phone: string;
        githubLink: string;
        stopwatchTime: number;
    }

    const dbFilePath = 'db.json';
    let submissions: Submission[] = [];

    if (fs.existsSync(dbFilePath)) {
        submissions = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    }

    app.get('/ping', (req, res) => {
        res.send(true);
    });

    app.post('/submit', (req, res) => {
        const submission: Submission = req.body;
        submissions.push(submission);
        fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
        res.sendStatus(200);
    });

    app.get('/read', (req, res) => {
        const index = parseInt(req.query.index as string, 10);
        if (index >= 0 && index < submissions.length) {
            res.json(submissions[index]);
        } else {
            res.sendStatus(404);
        }
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
    ```

5. **Run the Server**:
    - Add the following script to your `package.json`:
      ```json
      "scripts": {
        "start": "ts-node src/index.ts"
      }
      ```
    - Start the server:
      ```bash
      npm start
      ```

## Usage

### Running the Application

1. **Ensure the Backend Server is Running**:
    - Follow the backend setup instructions and start the server.

2. **Run the Desktop Application**:
    - Press `F5` in Visual Studio or select `Debug` -> `Start Debugging`.

## Keyboard Shortcuts

- **View Submissions**: `CTRL + V`
- **Create New Submission**: `CTRL + N`
- **Previous Submission**: `CTRL + P`
- **Next Submission**: `CTRL + N`
- **Submit**: `CTRL + S`
- **Start/Stop Stopwatch**: Click the "START/STOP" button

## Forms Overview

### Main Form (`Form1`)

- **Buttons**:
  - `VIEW SUBMISSIONS (CTRL + V)`: Opens the View Submissions form.
  - `CREATE NEW SUBMISSION (CTRL + N)`: Opens the Create Submission form.

### View Submissions Form (`ViewSubmissionsForm`)

- **Components**:
  - **Labels and Text Boxes** for displaying Name, Email, Phone Number, GitHub Link, and Stopwatch Time.
  - **Navigation Buttons**:
    - `PREVIOUS (CTRL + P)`: Navigate to the previous submission.
    - `NEXT (CTRL + N)`: Navigate to the next submission.
- **Functions**:
  - `ViewSubmissionsForm_Load`: Loads submissions from the backend on form load.
  - `btnPrevious_Click` & `btnNext_Click`: Navigate through submissions.
  - `DisplaySubmission`: Displays the current submission details.

### Create Submission Form (`CreateSubmissionForm`)

- **Components**:
  - **Text Boxes and Labels** for Name, Email, Phone Number, GitHub Link.
  - **Buttons**:
    - `SUBMIT (CTRL + S)`: Submits the new submission to the backend server.
    - `START/STOP` (Stopwatch): Starts or stops the stopwatch.
- **Functions**:
  - `btnStopwatch_Click`: Starts or stops the stopwatch.
  - `btnSubmit_Click`: Collects the data and sends it to the backend server for storage.

## Troubleshooting

- **Designer Load Errors**: Ensure the form class is the first class in the file. Move supporting classes (like `Submission`) to separate files.
- **Backend Connection Issues**: Verify the backend server is running and accessible at `http://localhost:3000`.
- **Build Errors**: Ensure all necessary NuGet packages and project dependencies are installed.

## Backend Server Description

The frontend application makes API calls to the backend for:
1. **Saving Submissions**.
2. **Retrieving Saved Submissions**.

### Backend Specifications

- **Framework**: Express with TypeScript
- **Database**: JSON file (named `db.json`)
- **Hosting**: Local server

### API Endpoints

- **`/ping`**:
  - **Method**: GET
  - **Description**: A health check endpoint that always returns `true`.

- **`/submit`**:
  - **Method**: POST
  - **Parameters**: 
    - `name` (string)
    - `email` (string)
    - `phone` (string)
    - `github_link` (string)
    - `stopwatch_time` (number)
  - **Description**: Saves a new submission to the JSON file.

- **`/read`**:
  - **Method**: GET
  - **Query Parameter**: 
    - `index` (number) - 0-indexed position of the submission to read.
  - **Description**: Retrieves the submission at the specified index from the JSON file.

### JSON File Structure

The `db.json` file structure should be an array of submission objects, each containing the following fields:
```json
[
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "githubLink": "https://github.com/johndoe",
    "stopwatchTime": 120
  }
]

