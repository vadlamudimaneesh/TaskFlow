# TaskFlow
# A Task Management System

## Overview
Task Management System is a simple REST API built with Express.js that allows users to manage tasks. You can create, update, delete, and filter tasks by their status (e.g., pending or completed).

## Features
- **Create Task**: Allows users to create a new task with a title, description, and status.
- **Update Task**: Allows users to update the status of a task (e.g., from "pending" to "completed").
- **Delete Task**: Allows users to delete a task based on its ID.
- **Get Tasks by Status**: Allows users to filter and retrieve tasks based on their status (pending/completed).
- **Persistent Storage**: Tasks are stored in a `tasks.json` file for persistence.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vadlamudimaneesh/TaskFlow.git
   
## To run the application
    $ cd taskflow
    # to install the required packages
    $ npm i  
    $ npm run start

## API's
    refer the taskFlow.postman_collection.json for Endpoints