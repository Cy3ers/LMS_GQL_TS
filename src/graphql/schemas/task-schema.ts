const taskSchema = `
  type Task {
    id: ID!
    title: String!
    description: String!
    status: String!
    priority: String!
    userId: ID!
  }

  type Query {
    tasks: [Task!]!
  }

  type Mutation {
    createTask(title: String!, description: String!, status: String!, priority: String!): Task!
    updateTask(id: ID!, title: String, description: String, status: String, priority: String): Task!
    deleteTask(id: ID!): Boolean!
  }
`;

export default taskSchema;
