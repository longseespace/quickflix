import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import range from 'lodash.range'
import capitalize from 'lodash.capitalize'
import moment from 'moment'
import sanitize from 'sanitize-html'

import styles from './MovieDetailView.scss'
import { actions as movieActions } from '../../redux/modules/movie'

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView'
import TopNav from '../TopNav/TopNav'
import Preloader from 'components/Preloader'
import Video from 'components/Video'

const mapStateToProps = (state) => ({
  context: state.movie,
  auth: state.auth
})
export class MovieDetailView extends AuthenticatedView {

  static propTypes = {
    params: PropTypes.object,
    context: PropTypes.object,
    getMovie: PropTypes.func.isRequired,
    getEpisode: PropTypes.func.isRequired,
    clearMovie: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    params: { id: 0 },
    context: {},
    getMovie: () => {},
    getEpisode: () => {},
    clearMovie: () => {}
  };

  componentWillMount () {
    super.componentWillMount()
    const { getMovie, params, context } = this.props
    if (!context.isFetched) {
      getMovie(params.id, params.episode)
    }
  }

  handlePlayerReady = () => {
    const $ = window.$
    const $window = $(window)

    $window.on('resize', () => {
      const video = this.refs.video
      const player = video.getVideoPlayer()
      const windowWidth = $window.width()
      if (windowWidth >= 960) {
        player.width(960)
        player.height(480)
      } else if (windowWidth >= 480) {
        player.width(480)
        player.height(240)
      } else {
        player.width(windowWidth)
        player.height(windowWidth / 2)
      }
    })
  }

  updatePlaylist (props) {
    const { context, params } = props
    const { playlist } = context.movie
    const video = this.refs.video
    if (video) {
      const player = video.getVideoPlayer()
      player.autoplay(true)
      player.src({
        src: playlist.playList,
        type: 'application/x-mpegURL'
      })

      const currentEpisode: Number = params.episode ? +params.episode : 1
      const playlistOptions = {
        currentEpisode,
        action: 'update'
      }
      player.PlaylistUI(playlistOptions)
    }
  }

  componentWillUnmount () {
    const { clearMovie } = this.props
    clearMovie()
    const $ = window.$
    const $window = $(window)
    $window.off('resize')
  }

  componentWillReceiveProps (nextProps) {
    const { params, context, getMovie, getEpisode } = nextProps
    if (!context.isFetched || params.id !== this.props.params.id) {
      getMovie(params.id, params.episode)
    } else {
      if (params.episode !== this.props.params.episode) {
        getEpisode(params.id, params.episode)
      }
    }
  }

  shouldComponentUpdate (nextProps) {
    const { context } = this.props
    this.updatePlaylist(nextProps)
    return !context.isFetched && nextProps.params.id === this.props.params.id
  }

  playEpisode = (episode) => {
    const { params } = this.props
    this.context.router.push(`/movie/${params.id}/${episode}`)
  }

  renderVideo () {
    const { context, params } = this.props
    if (!context.isFetched) {
      return (
        <div className='valign-wrapper'>
          <div className={styles.preloader}>
            <Preloader show={context.isFetching} />
          </div>
        </div>
      )
    }

    const { overview, detail, playlist } = context.movie
    const proxy = 'https://crossorigin.me' // TODO: make this configurable
    const tracks = playlist.subtitle.map((item) => ({
      kind: 'captions',
      src: `${proxy}/${item.source}`,
      srclang: item.sub === 'VIE' ? 'vi' : 'en',
      label: item.sub === 'VIE' ? 'Tiếng Việt' : 'English',
      default: item.sub !== 'VIE'
    }))
    let width = 960
    let height = 480
    const $ = window.$
    const windowWidth = $(window).width()
    if (windowWidth < 960 && windowWidth >= 480) {
      width = 480
      height = 240
    } else if (windowWidth < 480) {
      width = windowWidth
      height = windowWidth / 2
    }
    const currentEpisode: Number = params.episode ? +params.episode : 1
    const playlistOptions = {
      currentEpisode,
      items: range(overview.Episode).map((index) => ({
        episode: index + 1,
        title: `Episode ${index + 1}`
      })),
      play: this.playEpisode
    }
    const video = (
      <Video
        ref='video'
        src={{
          src: playlist.playList,
          type: 'application/x-mpegURL'
        }}
        playlist={playlistOptions}
        tracks={tracks}
        width={width}
        height={height}
        onReady={this.handlePlayerReady}
        options={{
          preload: 'none',
          poster: detail.background,
          autoplay: false,
          plugins: {
            // Resume: {
            //   uuid: `${overview.MovieID}-${overview.Season}-${overview.currentSequence}`,
            //   playbackOffset: 5, // begin playing video this number of seconds before it otherwise would.
            // },
          }
        }}
      />
    )
    return (
      <div className={styles.theater}>
        <div className={styles.placeholder}>
          {video}
        </div>
      </div>
    )
  }

  renderInfo () {
    const { context } = this.props
    if (!context.isFetched) {
      return (
        <div></div>
      )
    }
    const { overview, detail } = context.movie
    const posterUrl = `http://t.hdviet.com/thumbs/124x184/${overview.NewPoster}`
    const releaseDate = moment(overview.ReleaseDate).format('LL')
    let quality = 'SD'
    if (overview.BitRate.indexOf('5700') > -1) {
      quality = '1080p'
    } else {
      quality = '720p'
    }
    const tag = detail.tag.split(',').map((tag) => capitalize(tag)).join(' / ')
    const plotText = sanitize(overview.PlotVI, {
      allowedTags: [],
      allowedAttributes: []
    })
    return (
      <div className='container'>
        <div className='row'>
          <div className='col s12 m12 l8'>
            <div className='card'>
              <div className='row card-content'>
                <div className='col s12 m3'>
                  <img src={posterUrl} />
                </div>
                <div className='col s12 m9'>
                  <span className='card-title'>{overview.MovieName}</span>
                  <p>{plotText}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col s12 m12 l4'>
            <div className='card'>
              <div className='row card-content'>
                <table>
                  <tbody>
                    <tr>
                      <td className={styles.label}>IMDB:</td>
                      <td>&nbsp;</td>
                      <td>{`${overview.ImdbRating} (${overview.ImdbVotes} votes)`}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Known As:</td>
                      <td>&nbsp;</td>
                      <td>{overview.KnownAs}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Director:</td>
                      <td>&nbsp;</td>
                      <td>{overview.Director}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Writer:</td>
                      <td>&nbsp;</td>
                      <td>{overview.Writer}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Cast:</td>
                      <td>&nbsp;</td>
                      <td>{overview.Cast}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Release Date:</td>
                      <td>&nbsp;</td>
                      <td>{releaseDate}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Country:</td>
                      <td>&nbsp;</td>
                      <td>{overview.Country}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>MPAA:</td>
                      <td>&nbsp;</td>
                      <td>{overview.MPAA}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Quality:</td>
                      <td>&nbsp;</td>
                      <td>{quality}</td>
                    </tr>
                    <tr>
                      <td className={styles.label}>Tag:</td>
                      <td>&nbsp;</td>
                      <td>{tag}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className={styles.root}>
        <TopNav/>
        <div className={styles.content}>
          {this.renderVideo()}
          {this.renderInfo()}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, movieActions)(MovieDetailView)
