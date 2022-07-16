import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            email
            password
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            username
            email
            password
        }
    }
`;

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