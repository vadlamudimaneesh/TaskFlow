const tasks = require("../controllers/tasksManager.controller");

module.exports.setRouter = (app) => {
  let baseUrl = "";
  app.post(`${baseUrl}/tasks`, tasks.createTask);
  app.get(`${baseUrl}/tasks`, tasks.getAllTasks);
  app.put(`${baseUrl}/tasks/:id`, tasks.updateTask);
  app.delete(`${baseUrl}/tasks/:id`, tasks.deleteTask);
  app.get(`${baseUrl}/tasks/status/:status`, tasks.getTasksByStatus);
};