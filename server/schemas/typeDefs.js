const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        # You don't want to query the password
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String!
        authors: [String] # assuming it works like this
        description: String!
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User #does it require _id...
    }

    input saveBookInput {
        authors: [String]
        title: String!
        bookId: String!
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: saveBookInput): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;