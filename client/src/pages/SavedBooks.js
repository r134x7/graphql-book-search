import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation  } from '@apollo/client'; // getting use query and use mutation hooks
import { GET_ME } from "../utils/queries"; // getting profile query
import { REMOVE_BOOK } from '../utils/mutations'; // getting remove book mutation

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME, {
    fetchPolicy: "cache-and-network" // solves the issue of books not loading in profile on first visit without refreshing
  });

  const userData = data?.me.savedBooks || []; // checks if userData has savedBooks, else it uses an empty array
    
    const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
      update(cache, { data: { removeBook } }) { // function to update the cache to re-render the page faster than doing a network refetch 
        try {
          const { me } = cache.readQuery({ query: GET_ME }); // reads the query variables/query names

          cache.writeQuery({ // the writeQuery will re-render the page automatically
            query: GET_ME,
            data: { me: 
              [{...me}, 
                  {_id: me._id, 
                  username: me.username, 
                  email: me.email, 
                  bookCount: me.bookCount, 
                  savedBooks: [{...removeBook.savedBooks}]} 
              ]}, // Had to add objects manually due to a console.error that occurs regarding missing fields despite the writeQuery still working correctly. There is still a console error regarding missing fields in the savedBooks section but I spent too long trying to find a solution to the issue which isn't really preventing the function from working.
          });
        } catch (e) {
          console.error(e);
        }
      },
    });
      
    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }

      try { 
        await removeBook({
          variables: { bookId } // uses the bookId object for removeBook mutation.
      })

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
        {loading ? (
          <Container>
          <h2>LOADING...</h2>
          </Container>
        ) : (
        <Container>
        <h2>
          {userData.length
            ? `Viewing ${userData.length} saved ${userData.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Card.Text>
                    <a href={book.link} target="_blank" rel='noreferrer'>
                      <Button className='btn-block btn-success'>Link to Book</Button>  
                    </a>
                  </Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
          )}
    </>
  );
};

export default SavedBooks;
