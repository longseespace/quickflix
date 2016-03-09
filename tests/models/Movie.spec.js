import Movie from 'models/Movie'

describe('(Models) Movie', () => {
  it('has static field `propTypes`', () => {
    expect(Movie.propTypes).to.be.an('Object')
  })
  it('has static field `defaultProps`', () => {
    expect(Movie.defaultProps).to.be.an('Object')
  })
})
