import React from 'react'
import { shallow, mount } from 'enzyme'
import MovieCard from 'components/MovieCard'
import Image from 'components/Image'
import LazyLoad from 'react-lazy-load'
// import sinon from 'sinon'
// import fakeEvent from 'simulant'
import jQuery from 'jquery'
window.$ = jQuery

describe('(Component) MovieCard', () => {
  it('renders as a <div>', () => {
    const wrapper = shallow(<MovieCard />)
    expect(wrapper.type()).to.equal('div')
  })

  it('subscribes/unsubscribes to window scroll event on mount/unmount', () => {
    window.$ = jQuery
    expect(jQuery._data(window, 'events')).to.equal(undefined)
    const wrapper = mount(<MovieCard />)
    expect(jQuery._data(window, 'events').scroll.length).to.equal(1)
    wrapper.unmount()
    expect(jQuery._data(window, 'events')).to.equal(undefined)
  })

  it('renders correct Movie info', () => {
    const movie = {
      id: 182,
      name: 'The Shawshank Redemption',
      releaseDate: '1994-10-14T00:00:00.000Z',
      plot: 'Năm 1947, Andy Dufresne (Tim Robbins) phải chấp hành hai án tù chung thân tại trại giam Shawshank vì tội giết vợ và nhân tình của vợ, mặc dù anh luôn miệng kêu oan. Vụ án gây xôn xao dư luận, bởi Andy là phó chủ tịch ngân hàng Portland, một nhà băng nổi tiếng. Động cơ giết người đã rõ ràng (vì ghen tuông), khẩu súng gây án cũng thuộc về Andy. Những chứng cứ trên hiện trường cũng chống lại anh. Chỉ có mỗi điều người ta bỏ sót: khẩu súng gây án đã bị ném xuống sông và cảnh sát chịu không thể nào vớt được. Người ta chỉ biết đến sự xuất hiện của nó trong vụ án nhờ thái độ thành khẩn của Andy.\r\n\r\nDáng vẻ trí thức, tác phong đĩnh đạc của một người từng sống trong giàu sang biến Andy thành người lạc lõng trong nhà tù Shawshank. Ngay cả những cảnh sát trong trại cũng thấy \"ngứa mắt\" khi nhìn thấy anh. Người duy nhất không giễu cợt Andy là Ellis Boyd Redding (Morgan Freeman), thường được gọi là Red, một tù nhân da đen đã bóc được gần 20 cuốn lịch. Ban đầu, Red coi anh là đối tượng lý tưởng cho những trò cá cược, đổi chác của ông ta.\r\n\r\nTrái ngược với nhận định của đám tù nhân thô lỗ, Andy tỏ ra lì lợm ngay từ ngày đầu vào trại. Anh không hề than vãn và cũng chẳng thèm nói chuyện với ai suốt mấy tuần. Red vô cùng ngạc nhiên khi thấy một người quen sống sung sướng như Andy lại có thể chịu đựng cảnh kham khổ tài tình đến thế. Ông thường lân la trò chuyện với anh và dần dần họ trở thành đôi bạn thân thiết.',
      director: 'Frank Darabont',
      imdbRating: 9.3,
      poster: 'http://t.hdviet.com/thumbs/124x184/0111161.jpg',
      backdrop: 'http://t.hdviet.com/backdrops/945x530/e122625ed7308daee2c6e538914b612c.jpg',
      bitrate: '800/1000/1500/2000/2700',
      season: 0,
      isTVSerie: false,
      episode: 0,
      sequence: 0
    }

    const wrapper = shallow(<MovieCard movie={movie} />)
    const lazyloader = wrapper.find(LazyLoad)
    expect(lazyloader).to.have.length(1)
    const cardImg = wrapper.find(Image)
    expect(cardImg).to.have.length(1)
    expect(cardImg.prop('src')).to.equal(movie.backdrop)
    const qualityButton = wrapper.find('.btn-quality')
    expect(qualityButton).to.have.length(1)
    expect(qualityButton.prop('data-tip')).to.equal('720p')
    const episodeTag = wrapper.find('.tag-episode')
    expect(episodeTag).to.have.length(0)
    const imdbButton = wrapper.find('.btn-imdb')
    expect(imdbButton).to.have.length(1)
    expect(imdbButton.prop('data-tip')).to.equal('IMDB 9.3')
    expect(imdbButton.text()).to.equal('9.3')
    const summaryNode = wrapper.find('.truncated-plot')
    expect(summaryNode).to.have.length(1)
    expect(summaryNode.text().length <= 300).to.be.true
    const plotNode = wrapper.find('.full-plot')
    expect(plotNode).to.have.length(1)
  })

  it('changes hover state on mouseOver/mouseOut events', () => {
    const wrapper = mount(<MovieCard />)
    wrapper.simulate('mouseOver')
    expect(wrapper.state('hover')).to.be.true
    wrapper.simulate('mouseOut')
    expect(wrapper.state('hover')).to.be.false
  })
})
