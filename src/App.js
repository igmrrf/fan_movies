import React, { useReducer, useEffect } from 'react';
import logo from './logo.svg';
import Header from './components/Header';
import Movie from './components/Movie';
import Search from './components/Search';
import './App.css';


const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b";


const initialState = {
  loading: true,
  movie: [],
  errorMessage: null
  //Help a mate out
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        movies: action.error
      };
    default:
      return state;
  }
};
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
    useEffect(() => {
      fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {

        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search
        });
      });
    }, []);

    const search = searchValue => {
      dispatch({
        type: "SEARCH_MOVIES_REQUEST"
      });

      fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
        .then(response => response.json())
        .then(jsonResponse => {
          if(jsonResponse.Response === "True") {
            dispatch({
              type: "SEARCH_MOVIES_SUCCESS",
              payload: jsonResponse.Search
            });
          }else {
            dispatch({
              type: "SEARCH_MOVIES_FAILURE",
              error: jsonResponse.Error
            });
          }
        });
    };

    const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="FAN MOVIES" />
      <Search search={search} />
      <p className="App-intro">
        Sharing a few of our favourite movies
      </p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
          ) : errorMessage ? (
            <div className="errorMessage">{errorMessage}</div>
          ) : (
            movies.map((movie, index) => (
              <Movie key={`${index}-${movie.Title}`} movie={movie} />

            ))
          )}
        </div>
      </div>
  );
};

export default App;