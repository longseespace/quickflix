import React, { Component } from 'react'
import { shallow } from 'enzyme'

import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import Tooltip from 'react-tooltip'

describe('(Layout) Core', function () {
  it('renders as a <div>', () => {
    const wrapper = shallow(<CoreLayout />)
    expect(wrapper.type()).to.equal('div')
  })

  it('should render a <Tooltip /> on desktop', () => {
    const wrapper = shallow(<CoreLayout />)
    expect(wrapper.find(Tooltip)).to.have.length(1)
  })

  it('should not render <Tooltip /> on mobile', () => {
    navigator = {
      userAgent: 'iPhone'
    }
    const wrapper = shallow(<CoreLayout />)
    expect(wrapper.find(Tooltip)).to.have.length(0)
  })

  it('renders Single Child', () => {
    class Content extends Component {}
    const wrapper = shallow(<CoreLayout><Content/></CoreLayout>)
    expect(wrapper.find(Content)).to.have.length(1)
  })

  it('renders Nav and Main if exist', () => {
    class Nav extends Component {}
    class Main extends Component {}
    const nav = (<Nav/>)
    const main = (<Main/>)
    const wrapper = shallow(<CoreLayout nav={nav} main={main} />)
    expect(wrapper.find(Nav)).to.have.length(1)
    expect(wrapper.find(Main)).to.have.length(1)
  })
})
