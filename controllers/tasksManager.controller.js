// libraries
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const filePath = './tasks.json';

async function initializeTasksFile() {
    try {
        await fs.access(filePath);
    } catch (error) {
        console.log('tasks.json not found. Creating a new one...');
        await fs.writeFile(filePath, JSON.stringify([]));
    }
}
initializeTasksFile()

const readTasks = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
};

const writeTasks = async (tasks) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tasks:', error);
        return false; 
    }
};

async function createTask(req,res){
    try {
        const { title, description } = req.body;
        const missingFields = [];
        if (!title) missingFields.push("title");
        if (!description) missingFields.push("description");
        if (missingFields.length > 0) {
            return res.status(422).send({
                status: "failed",
                code: 422,
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }
        const tasks = await readTasks();
        const newTask = {
            id : uuidv4(),
            title : title,
            description : description,
            status : "pending"
        }
        tasks.push(newTask);
        const success = await writeTasks(tasks);
        if (!success) {
            return res.status(500).send({
                error: "Failed to save task. Please try again later.",
            });
        }
        return res.status(200).send({
            message : "Task created successfully",
            task : newTask
        });
    } catch (error) {
        console.error('Error in creatingTask:', error);
        return res.status(500).send({
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
}

async function getAllTasks (req,res) {
    try {
        const tasksList = await readTasks();
        return res.status(200).send(tasksList);
    } catch (error) {
        console.error('Error in getAllTasks:', error);
        return res.status(500).send({
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
}

async function updateTask(req, res) {
    try {
        const { id } = req.params; 
        const { status } = req.body;

        const validStatus =  "completed";
        if (status.toLowerCase() !== validStatus) {
            return res.status(400).send({
                message: "Invalid status. Only 'completed' is allowed.",
            });
        }
        const tasks = await readTasks();
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).send({
                message: "Task not found",
            });
        }

        const currentStatus = tasks[taskIndex].status;
        if (currentStatus === status.toLowerCase()) {
            return res.status(400).send({
                message: `Status is already '${status}'. No changes needed.`,
            });
        }
        tasks[taskIndex].status = status.toLowerCase();
        const success = await writeTasks(tasks);
        if (!success) {
            return res.status(500).send({
                message: "Failed to save task. Please try again later.",
            });
        }

        return res.status(200).send({
            message: "Task updated successfully",
            task: tasks[taskIndex],
        });
    } catch (error) {
        console.error('Error in updateTask:', error);
        return res.status(500).send({
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
}

async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const tasks = await readTasks();
        const taskIndex = tasks.findIndex((task) => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).send({
                message: "Task not found",
            });
        }

        tasks.splice(taskIndex, 1);
        const success = await writeTasks(tasks);
        if (!success) {
            return res.status(500).send({
                message: "Failed to delete task. Please try again later.",
            });
        }

        return res.status(200).send({
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error('Error in deleteTask:', error);
        return res.status(500).send({
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
}

async function getTasksByStatus(req, res) {
    try {
        const { status } = req.params;  
        console.log(status.toLowerCase())
        if (status.toLowerCase() !== "pending" && status.toLowerCase() !== "completed") {
            return res.status(400).send({
                message: "Invalid status. Valid status values are 'pending' or 'completed'.",
            });
        }
        const tasks = await readTasks();
        const filteredTasks = tasks.filter(task => task.status === status.toLowerCase());
        return res.status(200).send({
            tasks: filteredTasks,
        });
    } catch (error) {
        console.error('Error in getTasksByStatus:', error);
        return res.status(500).send({
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
}



module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTasksByStatus
}