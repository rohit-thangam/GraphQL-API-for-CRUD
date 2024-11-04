const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// In-memory data structure for tasks
let tasks = [];
let taskIdCounter = 1;

// GraphQL Schema
const schema = buildSchema(`
  type Task {
    id: ID!
    title: String!
    description: String
    status: String
  }
  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }
  type Mutation {
    addTask(title: String!, description: String): Task
    updateTask(id: ID!, title: String, description: String, status: String): Task
    deleteTask(id: ID!): Task
  }
`);

// Resolvers for Queries and Mutations
const root = {
  tasks: () => tasks,
  task: ({ id }) => tasks.find(task => task.id == id),
  addTask: ({ title, description }) => {
    const newTask = {
      id: taskIdCounter++,
      title,
      description: description || '',
      status: 'Pending'
    };
    tasks.push(newTask);
    return newTask;
  },
  updateTask: ({ id, title, description, status }) => {
    const task = tasks.find(task => task.id == id);
    if (!task) throw new Error(`Task with ID ${id} not found.`);
    
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    
    return task;
  },
  deleteTask: ({ id }) => {
    const taskIndex = tasks.findIndex(task => task.id == id);
    if (taskIndex === -1) throw new Error(`Task with ID ${id} not found.`);
    
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    return deletedTask;
  }
};

// Initialize Express and GraphQL
const app = express();

// Add a simple route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API! Visit /graphql to access the GraphQL endpoint.');
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
