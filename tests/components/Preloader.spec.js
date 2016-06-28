import React from 'react'
import { shallow } from 'enzyme'
import Preloader from 'components/Preloader'

describe('(Component) Preloader', () => {
  it('should be visibile by default', () => {
    const wrapper = shallow(<Preloader />)
    expect(wrapper.first().props().style.display).to.equal('block')
  })

  it('should hide if show={false}', () => {
    const wrapper = shallow(<Preloader show={false} />)
    expect(wrapper.first().props().style.display).to.equal('none')
  })

  it('should render correct size', () => {
    const wrapper = shallow(<Preloader size='small' />)
    expect(wrapper.first().hasClass('small')).to.be.true
  })

  it('should render correct color', () => {
    const wrapper = shallow(<Preloader color='red' />)
    expect(wrapper.find('.spinner-red-only')).to.have.length(1)
  })
})
