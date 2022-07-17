import { gql } from "@apollo/client";

// assuming this is all the data to retrieve when the user views their profile and saved books

export const GET_ME = gql`
    query me {
        me {
          _id
          username
          email
          bookCount
            savedBooks {
              bookId
              authors
              image
              title
              description
              link
            }
        }
    }
`;