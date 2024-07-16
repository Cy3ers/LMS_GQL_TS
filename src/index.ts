// ./src/index.ts

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import sequelize from "./config/database";
import typeDefs from "./graphql/schemas";
import resolvers from "./graphql/resolvers";
import { getUserFromToken, Context } from "./context/auth-context";

dotenv.config();

const port = process.env.PORT || 3000;

const server = new ApolloServer<Context>({ typeDefs, resolvers });

sequelize
  .sync()
  .then(async () => {
    console.log("Models synchronized successfully.");
    const { url } = await startStandaloneServer(server, {
      context: async ({ req }): Promise<Context> => {
        const token = req.headers.authorization || "";
        const user = await getUserFromToken(token);
        return { user };
      },
      listen: { port: 4000 }
    });
    console.log(`🚀  Server ready at: ${url}`);
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
