import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import ForwardButton from 'components/ForwardButton'

describe('(Component) ForwardButton', () => {
  it('renders as a <a>', () => {
    const goForward = sinon.spy()
    const wrapper = shallow(<ForwardButton goForward={goForward}/>)
    expect(wrapper.type()).to.equal('a')
  })

  it('should goForward if not disabled', () => {
    const goForward = sinon.spy()
    const wrapper = shallow(<ForwardButton goForward={goForward}/>)
    wrapper.find('a').simulate('click', new Event())
    expect(goForward.called).to.be.true
  })

  it('should not goForward if disabled', () => {
    const goForward = sinon.spy()
    const wrapper = shallow(<ForwardButton disabled goForward={goForward}/>)
    wrapper.find('a').simulate('click', new Event())
    expect(goForward.called).to.be.false
  })
})
