import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!, publish: Boolean!): PostPayload!
    signup(
      name: String!
      bio: String!
      credentials: CredentialInput!
    ): AuthPayload
    signin(credentials: CredentialInput!): AuthPayload
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserErrors {
    message: String!
  }

  type PostPayload {
    userErrors: [UserErrors!]!
    post: Post
  }

  type AuthPayload {
    userErrors: [UserErrors!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input CredentialInput {
    email: String!
    password: String!
  }
`;
