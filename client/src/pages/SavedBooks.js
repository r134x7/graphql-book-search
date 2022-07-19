// import React, { useState, useEffect } from 'react'; // removing useEffect and useState
import React, { useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { useQuery, useMutation  } from '@apollo/client'; // getting use query and use mutation hooks
import { GET_ME } from "../utils/queries"; // getting profile query
import { REMOVE_BOOK } from '../utils/mutations'; // getting remove book mutation

// import { getMe, deleteBook } from '../utils/API'; // removing REST API requests
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});
  
  // use this to determine if `useEffect()` hook needs to run again
  
  const { loading, data, refetch } = useQuery(GET_ME, {
    fetchPolicy: "no-cache" // solves the issue of books not loading in profile without refreshing
  });

  const userData = data?.me.savedBooks || [];
  
  // // const userData = data?.savedBooks || {}; // I assume we no longer need the userData useState...
  // // const userData = data?.bookCount || 0; // I assume we no longer need the userData useState...
  // const userData = data?.me.savedBooks || [];
  // // const userData = data?.me.savedBooks ;
  // console.log(userData);
  // console.log(userData);
  // console.log(userData);

  // const userDataLength = Object.keys(userData).length; // assuming this won't be needed either
  // console.log(userDataLength);
  
  // will I need to use a Token for GET_ME?...
  
  
  // useEffect(() => { removing use effect
  // const getUserData = async () => {
    //   try {
  //     const token = Auth.loggedIn() ? Auth.getToken() : null;
  
  //     if (!token) {
    //       return false;
  //     }

  // const response = await getMe(token);
      
      // if (!response.ok) {
        //   throw new Error('something went wrong!');
        // }
        
        // const user = await response.json();
      // setUserData(user);
      //   } catch (err) {
        //     console.error(err);
        //   }
        // };
        
    // getUserData();
    // }, [userDataLength]);
    
    const [RemoveBook, { error }] = useMutation(REMOVE_BOOK, {
      onCompleted: refetch, // Refetch source: https://medium.com/nexl-engineering/react-apollo-cache-set-up-refetch-refetchqueries-and-fetchpolicy-explained-with-examples-80cae6573401#:~:text=refetch%20is%20a%20function%20to,list%20after%20publishing%20a%20article.
    })
    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }
      
      try { 
        //  const { book } = await removeBook(bookId)
        await RemoveBook({
          variables: { bookId }
        })
    //   const response = await deleteBook(bookId, token); // removing the rest api responses

    //   if (!response.ok) {
    //     throw new Error('something went wrong!');
    //   }

    // const updatedUser = await response.json();
    // setUserData(updatedUser);
    // upon success, remove book's id from localStorage
      // console.log(book);
      console.log(userData);
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) { // assuming we change this now to loading
  // console.log(userData);
  // console.log(userData.length);

  // useEffect(() => {
  //   userData = data?.me.savedBooks || [];
  // }, [handleDeleteBook])
  
  // if (loading) {
  //   return <h2>LOADING...</h2>;
  // }
  
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
                {/* {console.log(book.bookId)} */}
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
