import { polyfill } from 'es6-promise'; polyfill()
import fetch from 'isomorphic-fetch'
import qs from 'query-string'

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

export function login (email: String, password: String, key: String, captcha: String) {
  if (email.length === 0 || password.length === 0) {
    throw new Error('Invalid email/password')
  }
  let body = qs.stringify({
    email,
    password,
    key: key || undefined,
    captcha: captcha || undefined
  })
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

export function search (keyword: String = '', options = { limit: 20, page: 1 }) {
  if (keyword.length === 0) {
    throw new Error('Keyword must not empty')
  }
  const { limit = 20, page = 1, accessToken } = options
  const params = qs.stringify({
    keyword,
    limit,
    page
  })
  const url = `${API_URL}/search?${params}`
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

export function favorite (id: Number, options = {}) {
  const { accessToken } = options
  const url = `${API_URL}/user/favorite`
  const fetchOptions = {
    method: 'POST',
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

export function getMovie (id: Number, options = {}) {
  const { accessToken, sequence } = options
  const params = qs.stringify({
    sequence
  })
  const url = `${API_URL}/movie/${id}?${params}`
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

export function getPlaylist (id: Number, options = { w: 1920, sequence }) {
  const { accessToken, sequence, w = 1920 } = options
  const params = qs.stringify({
    sequence,
    w
  })
  const url = `${API_URL}/playlist/${id}?${params}`
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

export function getRelatedMovies (id: Number, options = { limit: 20, page: 1 }) {
  const { limit, page, accessToken } = options
  const params = qs.stringify({
    page,
    limit
  })
  const url = `${API_URL}/movie/${id}?${params}`
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

export function getMovies (options) {
  const newOptions = { limit: 20, page: 1, ...options }
  const { limit, page, accessToken, isCinema, tag, genre, imdb, year } = newOptions
  const params = qs.stringify({
    limit,
    page,
    isCinema,
    tag,
    genre,
    imdb,
    year
  })
  const url = `${API_URL}/movie/filter?${params}`
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
  loginAnonymously,
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
