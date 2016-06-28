import React from 'react'
import { shallow } from 'enzyme'
import RaisedButton from 'components/RaisedButton'

describe('(Component) RaisedButton', () => {
  it('renders as a <button>', () => {
    const wrapper = shallow(<RaisedButton />)
    expect(wrapper.type()).to.equal('button')
    expect(wrapper.hasClass('btn')).to.be.true
  })

  it('should render children when passed in', () => {
    const wrapper = shallow(
      <RaisedButton>
        <span className='content'>submit</span>
      </RaisedButton>
    )
    expect(wrapper.contains(<span className='content'>submit</span>)).to.equal(true)
  })

  it('should be disabled', () => {
    const wrapper = shallow(
      <RaisedButton disabled />
    )
    expect(wrapper.hasClass('disabled')).to.equal(true)
  })
})
