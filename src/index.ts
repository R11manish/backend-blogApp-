import { ApolloServer, gql } from "apollo-server";
import { Query, Mutation, Post, Profile, User } from "./resolvers";
import { PrismaClient, Prisma } from "@prisma/client";
import { typeDefs } from "./schema";
import { getUserFromToken } from "./utlis/getUserFromToken";

export const prisma = new PrismaClient();
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User,
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization);
    return { prisma, userInfo };
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`server ready on ${url}`);
});
