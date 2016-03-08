import { polyfill } from 'es6-promise'; polyfill()
import 'isomorphic-fetch'
import qs from 'query-string'

export const API_URL = 'http://rest.hdviet.com/api/v3'
export const AUTH_API_URL = 'https://id.hdviet.com/authentication/login'

export function loginAnonymously () {
  return fetch(AUTH_API_URL, {
    method: 'POST'
  })
  .then((response) => {
    return response.json()
  })
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
  if (!email || !password || email.length === 0 || password.length === 0) {
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
  const idNum = +id
  if (isNaN(idNum) || idNum <= 0) {
    throw new Error('Invalid movie_id')
  }

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
  const idNum = +id
  if (isNaN(idNum) || idNum <= 0) {
    throw new Error('Invalid movie_id')
  }
  const { accessToken, sequence } = options
  const params = qs.stringify({
    sequence
  })
  const url = `${API_URL}/movie/${idNum}?${params}`
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

export function getPlaylist (id: Number, options = { w: 1920 }) {
  const idNum = +id
  if (isNaN(idNum) || idNum <= 0) {
    throw new Error('Invalid movie_id')
  }
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
  const idNum = +id
  if (isNaN(idNum) || idNum <= 0) {
    throw new Error('Invalid movie_id')
  }

  const { limit, page, accessToken } = options
  const params = qs.stringify({
    page,
    limit
  })
  const url = `${API_URL}/movie/${id}/relations?${params}`
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
  return hdviet.getMovies({ ...options, tag })
}

export function getMoviesByGenre (genre = '', options = { page: 1, limit: 20 }) {
  return hdviet.getMovies({ ...options, genre })
}

export function getMoviesByImdb (imdb = '', options = { page: 1, limit: 20 }) {
  return hdviet.getMovies({ ...options, imdb })
}

export function getMoviesByYear (year = '', options = { page: 1, limit: 20 }) {
  return hdviet.getMovies({ ...options, year })
}

export function getFavoriteMovies (options) {
  const { limit, page, accessToken } = options
  const params = qs.stringify({
    page,
    limit
  })
  const url = `${API_URL}/user/favorite?${params}`
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

const hdviet = {
  loginAnonymously,
  login,
  search,
  favorite,
  getMovie,
  getPlaylist,
  getRelatedMovies,
  getMovies,
  getMoviesByTag,
  getMoviesByGenre,
  getMoviesByImdb,
  getMoviesByYear,
  getFavoriteMovies
}

export default hdviet
