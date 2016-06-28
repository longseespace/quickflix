import React from 'react'
import sinon from 'sinon'
import { shallow, mount } from 'enzyme'
import SearchBar from 'components/SearchBar'

describe('(Component) SearchBar', () => {
  it('renders as a <form>', () => {
    const wrapper = shallow(<SearchBar />)
    expect(wrapper.type()).to.equal('form')
  })

  it('renders correct keyword & placeholder', () => {
    const wrapper = shallow(<SearchBar keyword='just a test' placeholder='dummy text' />)
    expect(wrapper.find('input').prop('value')).to.equal('just a test')
    expect(wrapper.find('input').prop('placeholder')).to.equal('dummy text')
  })

  it('calls callbacks properly', () => {
    const onClose = sinon.spy()
    const onSubmit = sinon.spy()
    const onFocus = sinon.spy()
    const onBlur = sinon.spy()
    const onChange = sinon.spy()
    const wrapper = mount(
      <SearchBar
        onClose={onClose}
        onSubmit={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        keyword='search'
      />
    )
    const e = new Event()
    wrapper.find('input').simulate('focus', e)
    expect(onFocus.calledOnce).to.be.true
    wrapper.find('input').simulate('blur', e)
    expect(onBlur.calledOnce).to.be.true
    wrapper.find('input').simulate('change', e)
    expect(onChange.calledOnce).to.be.true
    expect(onChange.calledWith(sinon.match.any, 'search')).to.be.true
    wrapper.find('form').simulate('submit', e)
    expect(onSubmit.calledOnce).to.be.true
    expect(onSubmit.calledWith(sinon.match.any, 'search')).to.be.true
    wrapper.find('.btn-close').simulate('click', e)
    expect(onClose.calledOnce).to.be.true
  })

  it('updates keyword onChange', () => {
    const wrapper = mount(
      <SearchBar keyword='abc'/>
    )
    expect(wrapper.state('keyword')).to.equal('abc')
    const input = wrapper.find('input').get(0)
    input.value = 'abcd'
    wrapper.find('input').simulate('change')
    expect(wrapper.state('keyword')).to.equal('abcd')
  })

  it('clears keyword onClose', () => {
    const wrapper = mount(
      <SearchBar keyword='abc'/>
    )
    expect(wrapper.state('keyword')).to.equal('abc')
    wrapper.find('.btn-close').simulate('click')
    expect(wrapper.state('keyword')).to.equal('')
  })
})
