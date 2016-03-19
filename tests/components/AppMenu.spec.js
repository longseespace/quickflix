import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import AppMenu, { AppMenuActivator } from 'components/AppMenu'

describe('(Component) AppMenu', () => {
  it('renders as a <ul>', () => {
    const token = 'xyz'
    const logout = sinon.spy()
    const wrapper = shallow(<AppMenu logout={logout} token={token} />)
    expect(wrapper.type()).to.equal('ul')
  })

  it('should trigger logout when click on logout button', () => {
    const token = 'xyz'
    const logout = sinon.spy()
    const wrapper = shallow(<AppMenu logout={logout} token={token} />)
    wrapper.find('.logout').simulate('click')
    expect(logout.called).to.be.true
  })
})

describe('(Component) AppMenuActivator', () => {
  it('renders as a <a>', () => {
    const wrapper = shallow(<AppMenuActivator />)
    expect(wrapper.type()).to.equal('a')
  })

  it('renders correct icon', () => {
    const wrapper = shallow(<AppMenuActivator icon='menu' />)
    expect(wrapper.find('i').text()).to.equal('menu')
  })

  it('binds `dropdown` on mount', () => {
    const dropdown = sinon.spy()
    let selector = ''
    window.$ = (sel) => {
      selector = sel
      return {
        dropdown
      }
    }
    const wrapper = mount(<AppMenuActivator />)
    expect(dropdown.called).to.be.true
    expect(selector).to.equal(`#${wrapper.props().id}`)
  })
})
