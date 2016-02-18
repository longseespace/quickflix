import React from 'react'
import { shallow } from 'enzyme'
import Image from 'components/Image'
import sinon from 'sinon'

describe('(Component) Image', () => {
  it('renders as a <img>', () => {
    const wrapper = shallow(<Image />)
    expect(wrapper.type()).to.equal('img')
  })

  it('should hide by default', () => {
    const wrapper = shallow(<Image />)
    expect(wrapper.find('img').props().style.opacity).to.equal(0)
  })

  it('fades in once image loaded', () => {
    sinon.spy(Image.prototype, 'fadeIn')
    const wrapper = shallow(<Image />)
    wrapper.find('img').simulate('load')
    expect(Image.prototype.fadeIn.calledOnce).to.be.true
    expect(wrapper.find('img').props().style.opacity).to.equal(1)
  })
})
