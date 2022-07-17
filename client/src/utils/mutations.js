import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// I assume I am going to need to the user's ID when saving or removing a book...

export const SAVE_BOOK = gql`
    mutation saveBook($input: saveBookInput) {
        saveBook(input: $input) {
            authors
            title
            bookId
            image
            link
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            bookId
        }
    }
`;