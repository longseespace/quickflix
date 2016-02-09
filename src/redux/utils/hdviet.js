import { polyfill } from 'es6-promise'; polyfill();
import fetch from 'isomorphic-fetch';

const API_URL = 'http://rest.hdviet.com/api/v3';
const API_TOKEN = 'fb4b338e218b4c2cbbc2722debd3acd1';

export function search(keyword = '', options = { accessToken: API_TOKEN, limit: 20, page: 1 }) {
  const { limit, page, accessToken } = options;
  const url = `${API_URL}/search?keyword=${keyword}&limit=${limit}&page=${page}`;
  const fetchOptions = {
    headers: {
      Authorization: accessToken,
    },
  };
  return fetch(url, fetchOptions).then(response => response.json())
    .then(json => {
      if (json.error) {
        throw new Error(json);
      } else {
        return json.data.response;
      }
    });
}

export function getMovie(id, options = { accessToken: API_TOKEN, episode: 0 }) {
  const { accessToken, episode } = options;
  const url = `${API_URL}/movie/${id}?episode=${episode}`;
  const fetchOptions = {
    headers: {
      Authorization: accessToken,
    },
  };
  return fetch(url, fetchOptions).then(response => response.json())
    .then(json => {
      if (json.error) {
        throw new Error(json);
      } else {
        return json.data;
      }
    });
}

export function getRelatedMovies(id, options = { accessToken: API_TOKEN, limit: 20, page: 1 }) {
  const { limit, page, accessToken } = options;
  const url = `${API_URL}/movie/${id}?limit=${limit}&page=${page}`;
  const fetchOptions = {
    headers: {
      Authorization: accessToken,
    },
  };
  return fetch(url, fetchOptions).then(response => response.json())
    .then(json => {
      if (json.error) {
        throw new Error(json);
      } else {
        return json.data;
      }
    });
}

const defaultFilterOptions = {
  accessToken: API_TOKEN,
  isCinema: 'wtf',
  tag: '',
  genre: '',
  imdb: '',
  year: '',
  limit: 20,
  page: 1,
};
export function getMovies(options) {
  const newOptions = { ...defaultFilterOptions, ...options };
  const { limit, page, accessToken, isCinema, tag, genre, imdb, year } = newOptions;
  const url = `${API_URL}/movie/filter?limit=${limit}&page=${page}&isCinema=${isCinema}&tag=${tag}&genre=${genre}&imdb=${imdb}&year=${year}`;
  const fetchOptions = {
    headers: {
      Authorization: accessToken,
    },
  };
  return fetch(url, fetchOptions).then(response => response.json())
    .then(json => {
      if (json.error) {
        throw new Error(json);
      } else {
        return json.data;
      }
    });
}

export function getMoviesByTag(tag = '', options = { accessToken: API_TOKEN, page: 1, limit: 20 }) {
  return getMovies({ ...options, tag });
}

export function getMoviesByGenre(genre = '', options = { accessToken: API_TOKEN, page: 1, limit: 20 }) {
  return getMovies({ ...options, genre });
}

export function getMoviesByImdb(imdb = '', options = { accessToken: API_TOKEN, page: 1, limit: 20 }) {
  return getMovies({ ...options, imdb });
}

export function getMoviesByYear(year = '', options = { accessToken: API_TOKEN, page: 1, limit: 20 }) {
  return getMovies({ ...options, year });
}

export default {
  search,
  getMovie,
  getRelatedMovies,
  getMovies,
  getMoviesByTag,
  getMoviesByGenre,
  getMoviesByImdb,
  getMoviesByYear,
};
