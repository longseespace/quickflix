import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import BackButton from 'components/BackButton'

describe('(Component) BackButton', () => {
  it('renders as a <a>', () => {
    const goBack = sinon.spy()
    const wrapper = shallow(<BackButton goBack={goBack}/>)
    expect(wrapper.type()).to.equal('a')
  })

  it('should goBack if not disabled', () => {
    const goBack = sinon.spy()
    const wrapper = shallow(<BackButton goBack={goBack}/>)
    wrapper.find('a').simulate('click', new Event())
    expect(goBack.called).to.be.true
  })

  it('should not goBack if disabled', () => {
    const goBack = sinon.spy()
    const wrapper = shallow(<BackButton disabled goBack={goBack}/>)
    wrapper.find('a').simulate('click', new Event())
    expect(goBack.called).to.be.false
  })
})
