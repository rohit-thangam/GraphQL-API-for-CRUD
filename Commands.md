npm init -y

npm install express express-graphql graphql

node server.js



Now open browser and enter:
localhost:4000/graphql



**Add Task:**

mutation {
  addTask(title: "Sample Task", description: "This is a sample task") {
    id
    title
    description
    status
  }
}

**Get All Tasks:**

query {
  tasks {
    id
    title
    description
    status
  }
}

**Update Task:**

mutation {
  updateTask(id: 1, title: "Updated Task Title", status: "Completed") {
    id
    title
    description
    status
  }
}

**Delete Task:**

mutation {
  deleteTask(id: 1) {
    id
    title
  }
}
