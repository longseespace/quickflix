import hdviet from 'redux/utils/hdviet'

describe('(Utils) HDViet API', () => {
  it('Should expose "fetch" globally.', () => {
    expect(fetch).to.be.a('Function')
  })

  describe('loginAnonymously()', () => {
    it('Should return a "Promise"', () => {
      return hdviet.loginAnonymously().should.be.a('Promise')
    })
  })

  describe('search()', () => {
    it('Should return a "Promise"', () => {
      return hdviet.search('wolf').should.be.a('Promise')
    })
  })

  describe('getMovie()', () => {
    it('Should return a "Promise"', () => {
      return hdviet.getMovie('182').should.be.a('Promise')
    })
  })

  describe('getRelatedMovies()', () => {
    it('Should return a "Promise"', () => {
      return hdviet.getRelatedMovies('182').should.be.a('Promise')
    })
  })

  describe('getMovies()', () => {
    it('Should return a "Promise"', () => {
      return hdviet.getMovies({ tag: 'hai' }).should.be.a('Promise')
    })
  })
})
