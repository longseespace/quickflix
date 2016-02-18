import { polyfill } from 'es6-promise'; polyfill()
import fetch from 'isomorphic-fetch'

const API_URL = 'http://rest.hdviet.com/api/v3'
const AUTH_API_URL = 'https://id.hdviet.com/authentication/login'

export function loginAnonymously () {
  return fetch(AUTH_API_URL, {
    method: 'POST'
  })
  .then((response) => response.json())
  .then((json) => {
    if (json.error) {
      const e = new Error(json.message)
      e.body = json
      throw e
    } else {
      return json.data
    }
  })
}

export function login (email, password, key, captcha) {
  const encodedEmail = encodeURIComponent(email)
  const encodedPassword = encodeURIComponent(password)
  let body = `email=${encodedEmail}&password=${encodedPassword}`
  if (key && key.length > 0 && captcha && captcha.length > 0) {
    body = `${body}&key=${key}&captcha=${captcha}`
  }
  return fetch(AUTH_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })
  .then((response) => response.json())
  .then((json) => {
    if (json.error) {
      const e = new Error(json.message)
      e.body = json
      throw e
    } else {
      return json.data
    }
  })
}

export function search (keyword = '', options = { limit: 20, page: 1 }) {
  const { limit = 20, page = 1, accessToken } = options
  const url = `${API_URL}/search?keyword=${keyword}&limit=${limit}&page=${page}`
  const fetchOptions = {
    headers: {
      Authorization: accessToken
    }
  }
  return fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((json) => {
      if (json.error) {
        const e = new Error(json.message)
        e.body = json
        throw e
      } else {
        return json.data.response
      }
    })
}

export function favorite (id, options = {}) {
  const { accessToken } = options
  const url = `${API_URL}/user/favorite`
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: accessToken
    }
  }
  return fetch(url, fetchOptions).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        const e = new Error(json.message)
        e.body = json
        throw e
      } else {
        return json.data
      }
    })
}

export function getMovie (id, options = { sequence: 0 }) {
  const { accessToken, sequence = 0 } = options
  const url = `${API_URL}/movie/${id}?sequence=${sequence}`
  const fetchOptions = {
    headers: {
      Authorization: accessToken
    }
  }
  return fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((json) => {
      if (json.error) {
        const e = new Error(json.message)
        e.body = json
        throw e
      } else {
        return json.data
      }
    })
}

export function getPlaylist (id, options = { w: 1920, sequence: 0 }) {
  const { accessToken, sequence = 0, w = 1920 } = options
  const url = `${API_URL}/playlist/${id}?sequence=${sequence}&w=${w}`
  const fetchOptions = {
    headers: {
      Authorization: accessToken
    }
  }
  return fetch(url, fetchOptions).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        const e = new Error(json.message)
        e.body = json
        throw e
      } else {
        return json.data
      }
    })
}

export function getRelatedMovies (id, options = { limit: 20, page: 1 }) {
  const { limit, page, accessToken } = options
  const url = `${API_URL}/movie/${id}?limit=${limit}&page=${page}`
  const fetchOptions = {
    headers: {
      Authorization: accessToken
    }
  }
  return fetch(url, fetchOptions).then((response) => response.json())
    .then((json) => {
      if (json.error) {
        const e = new Error(json.message)
        e.body = json
        throw e
      } else {
        return json.data
      }
    })
}

const defaultFilterOptions = {
  isCinema: 'wtf',
  tag: '',
  genre: '',
  imdb: '',
  year: '',
  limit: 20,
  page: 1
}
export function getMovies (options) {
  const newOptions = { ...defaultFilterOptions, ...options }
  const { limit, page, accessToken, isCinema, tag, genre, imdb, year } = newOptions
  const url = `${API_URL}/movie/filter?limit=${limit}&page=${page}&isCinema=${isCinema}
                &tag=${tag}&genre=${genre}&imdb=${imdb}&year=${year}`
  const fetchOptions = {
    headers: {
      Authorization: accessToken
    }
  }
  return fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((json) => {
      if (json.error) {
        const e = new Error(json.message)
        e.body = json
        throw e
      } else {
        return json.data
      }
    })
}

export function getMoviesByTag (tag = '', options = { page: 1, limit: 20 }) {
  return getMovies({ ...options, tag })
}

export function getMoviesByGenre (genre = '', options = { page: 1, limit: 20 }) {
  return getMovies({ ...options, genre })
}

export function getMoviesByImdb (imdb = '', options = { page: 1, limit: 20 }) {
  return getMovies({ ...options, imdb })
}

export function getMoviesByYear (year = '', options = { page: 1, limit: 20 }) {
  return getMovies({ ...options, year })
}

export default {
  login,
  search,
  getMovie,
  getPlaylist,
  getRelatedMovies,
  getMovies,
  getMoviesByTag,
  getMoviesByGenre,
  getMoviesByImdb,
  getMoviesByYear
}
