import React from 'react'
import { shallow, mount } from 'enzyme'
import MovieCollection from 'components/MovieCollection'
import MovieCard from 'components/MovieCard'
import sinon from 'sinon'
import fakeEvent from 'simulant'
import range from 'lodash.range'

describe('(Component) MovieCollection', () => {
  it('renders as a <div>', () => {
    const wrapper = shallow(<MovieCollection />)
    expect(wrapper.type()).to.equal('div')
  })

  it('renders 3 <MovieCard>s', () => {
    const movies = range(3).map((item) => ({
      bitrate: '',
      id: item,
      plot: 'Movie 1 plot',
      backdrop: 'backdrop.jpg',
      name: 'Movie 1',
      season: 0,
      episode: 0,
      sequence: 1,
      imdbRating: 8
    }))
    const wrapper = shallow(<MovieCollection movies={movies} />)
    expect(wrapper.find(MovieCard)).to.have.length(3)
  })

  it('calls onScrollTop', () => {
    const onScrollTop = sinon.spy()
    mount(<MovieCollection onScrollTop={onScrollTop} />)
    fakeEvent.fire(window, fakeEvent('scroll'))
    expect(onScrollTop.calledOnce).to.be.true
  })

  it('calls onScrollBottom', () => {
    const onScrollBottom = sinon.spy()
    mount(<MovieCollection onScrollBottom={onScrollBottom} />)
    fakeEvent.fire(window, fakeEvent('scroll'))
    expect(onScrollBottom.calledOnce).to.be.true
  })
})
