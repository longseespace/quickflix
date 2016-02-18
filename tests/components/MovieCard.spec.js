import React from 'react'
import { shallow } from 'enzyme'
import MovieCard from 'components/MovieCard'
// import sinon from 'sinon'

describe('(Component) MovieCard', () => {
  it('renders as a <div>', () => {
    const wrapper = shallow(<MovieCard />)
    expect(wrapper.type()).to.equal('div')
  })
})
