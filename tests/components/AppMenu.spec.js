import React from 'react'
import { shallow } from 'enzyme'
import AppMenu from 'components/AppMenu'

describe('(Component) AppMenu', () => {
  it('renders as a <ul>', () => {
    const wrapper = shallow(<AppMenu />)
    expect(wrapper.type()).to.equal('ul')
  })
})
