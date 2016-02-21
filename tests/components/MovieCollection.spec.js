import React from 'react'
import { shallow, mount } from 'enzyme'
import MovieCollection from 'components/MovieCollection'
import MovieCard from 'components/MovieCard'
import sinon from 'sinon'
import fakeEvent from 'simulant'
import range from 'lodash.range'
import jQuery from 'jquery'
window.$ = jQuery

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

  it('renders card `m3` if window width >= 1200', () => {
    const fake$ = (elem) => {
      if (elem === window) {
        const $window = jQuery(window)
        $window.width = () => 1200
        return $window
      } else {
        return jQuery(elem)
      }
    }
    window.$ = fake$

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
    const wrapper = mount(<MovieCollection movies={movies} />)
    fakeEvent.fire(window, fakeEvent('resize'))
    expect(wrapper.find('div.col.m3')).to.have.length(3)

    window.$ = jQuery
  })

  it('renders card `m4` if 900 < window width < 1200', () => {
    const fake$ = (elem) => {
      if (elem === window) {
        const $window = jQuery(window)
        $window.width = () => 1000
        return $window
      } else {
        return jQuery(elem)
      }
    }
    window.$ = fake$

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
    const wrapper = mount(<MovieCollection movies={movies} />)
    fakeEvent.fire(window, fakeEvent('resize'))
    expect(wrapper.find('div.col.m4')).to.have.length(3)

    window.$ = jQuery
  })

  it('renders card `m6` if window width < 900', () => {
    const fake$ = (elem) => {
      if (elem === window) {
        const $window = jQuery(window)
        $window.width = () => 800
        return $window
      } else {
        return jQuery(elem)
      }
    }
    window.$ = fake$

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
    const wrapper = mount(<MovieCollection movies={movies} />)
    fakeEvent.fire(window, fakeEvent('resize'))
    expect(wrapper.find('div.col.m6')).to.have.length(3)

    window.$ = jQuery
  })

  it('calls onScrollTop', () => {
    const onScrollTop = sinon.spy()
    mount(<MovieCollection onScrollTop={onScrollTop} />)
    fakeEvent.fire(window, fakeEvent('scroll'))
    expect(onScrollTop.called).to.be.true
  })

  it('calls onScrollBottom', () => {
    const onScrollBottom = sinon.spy()
    mount(<MovieCollection onScrollBottom={onScrollBottom} />)
    fakeEvent.fire(window, fakeEvent('scroll'))
    expect(onScrollBottom.called).to.be.true
  })

  it('unsubscribes from window events (scroll & resze)', () => {
    const wrapper = mount(<MovieCollection />)
    const scrollListenerCount = jQuery._data(window, 'events').scroll.length
    const resizeListenerCount = jQuery._data(window, 'events').resize.length
    wrapper.unmount()
    expect(jQuery._data(window, 'events').scroll.length).to.equal(scrollListenerCount - 1)
    expect(jQuery._data(window, 'events').resize.length).to.equal(resizeListenerCount - 1)
  })
})
