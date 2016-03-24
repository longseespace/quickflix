import React, { Component } from 'react'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import Tokenize from 'components/Tokenize'
import Preloader from 'components/Preloader'

class View extends Component {
  render () {
    return (
      <div>View</div>
    )
  }
}

const noop = () => {}

describe('(HOC) Tokenize', () => {
  it('should export function `Tokenize`', () => {
    expect(Tokenize).to.be.a('function')
  })

  it('renders Preloader & triggers `getToken` if token not valid', () => {
    const getToken = sinon.spy()
    const Tokenized = Tokenize(View)
    const wrapper = mount(<Tokenized getToken={getToken} />)
    expect(wrapper.find(Preloader)).to.have.length(1)
    expect(wrapper.find(View)).to.have.length(0)
    expect(getToken.calledOnce).to.be.true
  })

  it('renders View component if token is valid', () => {
    const getToken = sinon.spy()
    const Tokenized = Tokenize(View)
    const auth = {
      creds: {
        access_token: 'abcxyz',
        last_login: Date.now()
      }
    }
    const wrapper = shallow(<Tokenized getToken={getToken} auth={auth} />)
    expect(wrapper.find(Preloader)).to.have.length(0)
    expect(wrapper.find(View)).to.have.length(1)
  })

  it('renders Preloader & triggers `getToken` if NEW token not valid', () => {
    const Tokenized = Tokenize(View)
    const wrapper = mount(<Tokenized getToken={noop} />)
    const getToken = sinon.spy()
    wrapper.setProps({
      getToken,
      auth: {}
    })
    expect(wrapper.find(Preloader)).to.have.length(1)
    expect(wrapper.find(View)).to.have.length(0)
    expect(getToken.calledOnce).to.be.true
  })

  it('renders View component if NEW token is valid', () => {
    const getToken = sinon.spy()
    const Tokenized = Tokenize(View)
    const wrapper = shallow(<Tokenized getToken={getToken} />)
    const auth = {
      creds: {
        access_token: 'abcxyz',
        last_login: Date.now()
      }
    }
    wrapper.setProps({
      getToken,
      auth
    })
    expect(wrapper.find(Preloader)).to.have.length(0)
    expect(wrapper.find(View)).to.have.length(1)
  })
})
