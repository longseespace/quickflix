import hdviet, { AUTH_API_URL } from 'redux/utils/hdviet'
import fetchMock from 'fetch-mock'

describe('(Utils) HDViet API', () => {
  it('Should expose "fetch" globally.', () => {
    expect(fetch).to.be.a('Function')
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('FetchMock should work', async () => {
    const URL = 'http://just.a.test'
    fetchMock.mock(URL, {
      error: true
    })
    const response = await fetch(URL).then((response) => response.json())
    expect(fetchMock.called(URL)).to.be.true
    expect(response.error).to.be.true
  })

  describe('loginAnonymously()', () => {
    afterEach(() => {
      fetchMock.restore()
    })
    it('Returns a "Promise"', () => {
      return hdviet.loginAnonymously().should.be.a('Promise')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(AUTH_API_URL, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.loginAnonymously().should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(AUTH_API_URL, {
        what: 'ever',
        data: {
          content: '123'
        }
      })
      return hdviet.loginAnonymously().should.become({ content: '123' })
    })
  })

  describe('login()', () => {
    it('Returns a "Promise"', () => {
      return hdviet.login('a', 'b').should.be.a('Promise')
    })
    it('Throws an "Error" if email or password are empty', () => {
      expect(hdviet.login).to.throw('Invalid email/password')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(AUTH_API_URL, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.login('u', 'p').should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(AUTH_API_URL, {
        what: 'ever',
        data: {
          content: '123'
        }
      })
      return hdviet.login('u', 'p').should.become({ content: '123' })
    })
  })

  describe('search()', () => {
    const PATTERN = /http:\/\/rest\.hdviet\.com\/api\/v3\/search.*/
    it('Returns a "Promise"', () => {
      return hdviet.search('wolf').should.be.a('Promise')
    })
    it('Throws an "Error" if keyword is empty', () => {
      expect(hdviet.search).to.throw('Keyword must not empty')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(PATTERN, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.search('keyword').should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(PATTERN, {
        what: 'ever',
        data: {
          response: {
            ok: true
          },
          content: 'abc'
        }
      })
      return hdviet.search('abc').should.become({ ok: true })
    })
  })

  describe('getMovie()', () => {
    const PATTERN = /http:\/\/rest\.hdviet\.com\/api\/v3\/movie\/.*/
    it('Returns a "Promise"', () => {
      return hdviet.getMovie('182').should.be.a('Promise')
    })
    it('Throws an "Error" if id is invalid', () => {
      expect(hdviet.getMovie).to.throw('Invalid movie_id')
      expect(hdviet.getMovie.bind({}, 0)).to.throw('Invalid movie_id')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(PATTERN, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.getMovie(182).should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(PATTERN, {
        what: 'ever',
        data: {
          content: 'abc'
        }
      })
      return hdviet.getMovie(182).should.become({ content: 'abc' })
    })
  })

  describe('favorite()', () => {
    const PATTERN = /http:\/\/rest\.hdviet\.com\/api\/v3\/user\/favorite.*/
    it('Returns a "Promise"', () => {
      return hdviet.favorite('182').should.be.a('Promise')
    })
    it('Throws an "Error" if id is invalid', () => {
      expect(hdviet.favorite).to.throw('Invalid movie_id')
      expect(hdviet.favorite.bind({}, 0)).to.throw('Invalid movie_id')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(PATTERN, 'POST', {
        error: true,
        message: 'Error Message'
      })
      return hdviet.favorite(182).should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(PATTERN, {
        what: 'ever',
        data: {
          content: 'abc'
        }
      })
      return hdviet.favorite(182).should.become({ content: 'abc' })
    })
  })

  describe('getPlaylist()', () => {
    const PATTERN = /http:\/\/rest\.hdviet\.com\/api\/v3\/playlist\/.*/
    it('Returns a "Promise"', () => {
      return hdviet.getPlaylist('182').should.be.a('Promise')
    })
    it('Throws an "Error" if id is invalid', () => {
      expect(hdviet.getPlaylist).to.throw('Invalid movie_id')
      expect(hdviet.getPlaylist.bind({}, 0)).to.throw('Invalid movie_id')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(PATTERN, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.getPlaylist(182).should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(PATTERN, {
        what: 'ever',
        data: {
          content: 'abc'
        }
      })
      return hdviet.getPlaylist(182).should.become({ content: 'abc' })
    })
  })

  describe('getRelatedMovies()', () => {
    const PATTERN = /http:\/\/rest\.hdviet\.com\/api\/v3\/movie\/.*/
    it('Returns a "Promise"', () => {
      return hdviet.getRelatedMovies('182').should.be.a('Promise')
    })
    it('Throws an "Error" if id is invalid', () => {
      expect(hdviet.getRelatedMovies).to.throw('Invalid movie_id')
      expect(hdviet.getRelatedMovies.bind({}, 0)).to.throw('Invalid movie_id')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(PATTERN, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.getRelatedMovies(182).should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(PATTERN, {
        what: 'ever',
        data: {
          content: 'abc'
        }
      })
      return hdviet.getRelatedMovies(182).should.become({ content: 'abc' })
    })
  })

  describe('getMovies()', () => {
    const PATTERN = /http:\/\/rest\.hdviet\.com\/api\/v3\/movie\/filter.*/
    it('Returns a "Promise"', () => {
      return hdviet.getMovies({ tag: 'hai' }).should.be.a('Promise')
    })
    it('Rejects if json.error !== undefined', () => {
      fetchMock.mock(PATTERN, {
        error: true,
        message: 'Error Message'
      })
      return hdviet.getMovies().should.be.rejectedWith('Error Message')
    })
    it('Resolves with correct data', () => {
      fetchMock.mock(PATTERN, {
        what: 'ever',
        data: {
          content: 'abc'
        }
      })
      return hdviet.getMovies().should.become({ content: 'abc' })
    })
  })

  describe('getMoviesByTag()', () => {
    it('calls getMovies() with correct tag', () => {
      const getMovies = sinon.stub(hdviet, 'getMovies')
      hdviet.getMoviesByTag('hanh-dong')
      expect(getMovies.calledWith({ tag: 'hanh-dong', page: 1, limit: 24 })).to.be.true
      getMovies.restore()
    })
  })

  describe('getMoviesByGenre()', () => {
    it('calls getMovies() with correct genre', () => {
      const getMovies = sinon.stub(hdviet, 'getMovies')
      hdviet.getMoviesByGenre(1)
      expect(getMovies.calledWith({ genre: 1, page: 1, limit: 24 })).to.be.true
      getMovies.restore()
    })
  })

  describe('getMoviesByImdb()', () => {
    it('calls getMovies() with correct imdb', () => {
      const getMovies = sinon.stub(hdviet, 'getMovies')
      hdviet.getMoviesByImdb('>8')
      expect(getMovies.calledWith({ imdb: '>8', page: 1, limit: 24 })).to.be.true
      getMovies.restore()
    })
  })

  describe('getMoviesByYear()', () => {
    it('calls getMovies() with correct year', () => {
      const getMovies = sinon.stub(hdviet, 'getMovies')
      hdviet.getMoviesByYear('>8')
      expect(getMovies.calledWith({ year: '>8', page: 1, limit: 24 })).to.be.true
      getMovies.restore()
    })
  })
})
