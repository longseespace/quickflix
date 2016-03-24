import React from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import SideNav, { SideNavActivator } from 'components/SideNav'

describe('(Component) SideNav', () => {
  it('renders as a <div>', () => {
    const wrapper = shallow(<SideNav />)
    expect(wrapper.type()).to.equal('div')
  })

  it('binds `collapsible` on mount', () => {
    const collapsible = sinon.spy()
    window.$ = (sel) => {
      return {
        collapsible
      }
    }
    mount(<SideNav />)
    expect(collapsible.called).to.be.true
  })
})

describe('(Component) SideNavActivator', () => {
  it('renders as a <a>', () => {
    const wrapper = shallow(<SideNavActivator />)
    expect(wrapper.type()).to.equal('a')
  })

  it('renders correct icon', () => {
    const wrapper = shallow(<SideNavActivator icon='menu' />)
    expect(wrapper.find('i').text()).to.equal('menu')
  })

  it('binds `sideNav` on mount', () => {
    const sideNav = sinon.spy()
    let selector = ''
    window.$ = (sel) => {
      selector = sel
      return {
        sideNav
      }
    }
    const wrapper = mount(<SideNavActivator />)
    expect(sideNav.called).to.be.true
    expect(selector).to.equal(`#${wrapper.props().id}`)
  })
})
