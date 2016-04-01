import React from 'react'
import Tooltip from 'react-tooltip'
import { shallow, mount } from 'enzyme'
import QueryView from 'components/QueryView'
import Preloader from 'components/Preloader'
import MovieGrid from 'components/MovieGrid'
import sinon from 'sinon'

describe('(Component) QueryView', () => {
  it('renders as a <div>', () => {
    const wrapper = shallow(<QueryView />)
    expect(wrapper.type()).to.equal('div')
  })

  it('renders <div></div> when `init`', () => {
    const wrapper = shallow(<QueryView status='init' />)
    expect(wrapper.html()).to.equal('<div></div>')
  })

  it('renders and shows a <Preloader> when `loading`', () => {
    const wrapper = shallow(<QueryView status='loading' />)
    const loader = wrapper.find(Preloader)
    expect(loader).to.have.length(1)
    expect(loader.prop('show')).to.be.true
  })

  it('renders a <MovieGrid> once `loaded`', () => {
    const wrapper = shallow(<QueryView status='loaded' />)
    expect(wrapper.find(MovieGrid)).to.have.length(1)
    expect(wrapper.find(Preloader).prop('show')).to.be.false
  })

  it('should clear() onComponentDidMount()', () => {
    const clear = sinon.spy()
    const wrapper = mount(<QueryView clear={clear} />)
    expect(clear.calledOnce).to.be.true
  })

  it('should getMovies() componentWillReceiveProps()', () => {
    const getMovies = sinon.spy()
    const query = {
      type: 'filter',
      filters: {
        tag: '123'
      },
      page: 1,
      limit: 24
    }
    const wrapper = mount(<QueryView getMovies={getMovies} />)
    expect(getMovies.called).to.be.false
    wrapper.setProps({ query })
    expect(getMovies.calledOnce).to.be.true
    expect(getMovies.calledWith(query)).to.be.true
  })

  it('loads next page onScrollBottom', () => {
    const getMovies = sinon.spy()
    const query = {
      type: 'filter',
      filters: {
        tag: '123'
      },
      page: 1,
      limit: 24
    }
    const wrapper = mount(<QueryView query={query} getMovies={getMovies} />)
    const inst = wrapper.instance()
    inst.loadMore()
    expect(getMovies.calledWith({...query, page: 2})).to.be.true
  })
})
