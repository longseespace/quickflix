import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import capitalize from 'lodash.capitalize'
import url from 'url'

import styles from './MovieDetailView.scss'
import { actions as movieActions } from '../../redux/modules/movie'

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView'

import Theater from 'components/Theater'
import MovieDetailCard from 'components/MovieDetailCard'

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

  play = (episode) => {
    const { params } = this.props
    this.context.router.push(`/movie/${params.id}/${episode}`)
  }

  renderInfo () {
    const { context } = this.props
    const { overview, detail } = context.movie

    let poster
    let plot
    let title
    let imdbRating
    let imdbVotes
    let knownAs
    let releaseDate
    let director
    let writer
    let cast
    let country
    let MPAA
    let quality = 'SD'
    let tag

    let status = 'init'
    if (context.isFetching) {
      status = 'loading'
    } else if (context.isFetched) {
      status = 'loaded'
    }

    if (overview) {
      poster = `http://t.hdviet.com/thumbs/124x184/${overview.NewPoster}`
      if (overview.BitRate.indexOf('5700') > -1) {
        quality = '1080p'
      } else if (overview.BitRate.indexOf('2700') > -1) {
        quality = '720p'
      } else {
        quality = 'SD'
      }

      plot = overview.PlotVI
      title = overview.MovieName
      imdbRating = overview.ImdbRating
      imdbVotes = overview.ImdbVotes
      knownAs = overview.KnownAs
      releaseDate = overview.ReleaseDate
      director = overview.Director
      writer = overview.Writer
      cast = overview.Cast
      country = overview.Country
      MPAA = overview.MPAA
    }

    if (detail) {
      tag = detail.tag.split(',').map((tag) => capitalize(tag)).join(' / ')
    }

    return (
      <MovieDetailCard
        status={status}
        poster={poster}
        plot={plot}
        title={title}
        imdbRating={imdbRating}
        imdbVotes={imdbVotes}
        knownAs={knownAs}
        releaseDate={releaseDate}
        director={director}
        writer={writer}
        cast={cast}
        country={country}
        MPAA={MPAA}
        quality={quality}
        tag={tag}
      />
    )
  }

  getSourceUrl (src, tags, isSerie = false) {
    const parts = src.replace(/\/\//g, '/').split('/').reverse()
    let baseUrl
    if (isSerie) {
      baseUrl = url.resolve(src, `${parts[2]}_${parts[1]}`)
    } else {
      baseUrl = url.resolve(src, parts[1])
    }
    let data = `#EXTM3U
    #EXT-X-VERSION:3`
    const q360 = `#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=800000,CODECS="avc1.77.31,mp4a.40.2",RESOLUTION=640x360
    ${baseUrl}_640/playlist.m3u8`
    const q480 = `#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1300000,CODECS="avc1.77.31,mp4a.40.2",RESOLUTION=800x450
    ${baseUrl}_800/playlist.m3u8`
    const q720 = `#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2500000,CODECS="avc1.100.41,mp4a.40.2",RESOLUTION=1280x720
    ${baseUrl}_1024/playlist.m3u8`
    const q1080 = `#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=5500000,CODECS="avc1.100.41,mp4a.40.2",RESOLUTION=1920x1080
    ${baseUrl}_1792/playlist.m3u8`
    if (tags.indexOf('360p') > -1) {
      data = `${data}
      ${q360}`
    }
    if (tags.indexOf('480p') > -1) {
      data = `${data}
      ${q480}`
    }
    if (tags.indexOf('720p') > -1) {
      data = `${data}
      ${q720}`
    }
    if (tags.indexOf('1080p') > -1) {
      data = `${data}
      ${q1080}`
    }
    const blob = new Blob([data], { type: 'application/vnd.apple.mpegurl' })
    return URL.createObjectURL(blob)
  }

  renderTheater () {
    const { context, params } = this.props
    const { overview, playlist, detail } = context.movie
    let tracks = []
    let src = ''
    let sources = []
    let poster
    let currentEpisode = 1
    let totalEpisode = 1
    let status = 'init'
    if (context.isFetching) {
      status = 'loading'
    } else if (context.isFetched) {
      status = 'loaded'
    }
    if (playlist) {
      const proxy = 'https://crossorigin.me' // TODO: make this configurable
      tracks = playlist.subtitle.map((item) => ({
        kind: 'captions',
        src: `${proxy}/${item.source}`,
        srclang: item.sub === 'VIE' ? 'vi' : 'en',
        label: item.sub === 'VIE' ? 'Tiếng Việt' : 'English',
        default: item.sub !== 'VIE'
      }))
      src = playlist.playList
    }
    if (params) {
      currentEpisode = params.episode ? +params.episode : 1
    }
    if (overview) {
      totalEpisode = overview.Episode
      const isSerie = totalEpisode > 0
      const has1080p = overview.BitRate.indexOf('5700') > -1
      const has720p = overview.BitRate.indexOf('2700') > -1
      let tags = '360p,480p'
      sources = [{
        src: this.getSourceUrl(src, '360p', isSerie),
        type: 'application/x-mpegURL',
        label: '360p'
      }, {
        src: this.getSourceUrl(src, '480p', isSerie),
        type: 'application/x-mpegURL',
        label: '480p'
      }]
      if (has720p) {
        sources.push({
          src: this.getSourceUrl(src, '720p', isSerie),
          type: 'application/x-mpegURL',
          label: '720p'
        })
        tags = `${tags},720p`
      }
      if (has1080p) {
        sources.push({
          src: this.getSourceUrl(src, '1080p', isSerie),
          type: 'application/x-mpegURL',
          label: '1080p'
        })
        tags = `${tags},1080p`
      }
      sources.push({
        src,
        type: 'application/x-mpegURL',
        label: 'auto'
      })
    }
    if (detail) {
      poster = detail.background
    }
    return (
      <Theater
        ref='theater'
        sources={sources}
        play={this.play}
        tracks={tracks}
        currentEpisode={currentEpisode}
        totalEpisode={totalEpisode}
        poster={poster}
        status={status}
      />
    )
  }

  render () {
    const { context } = this.props
    const { overview } = context.movie
    const title = context.isFetched ? overview.MovieName : 'Loading...'

    return (
      <DocumentTitle title={title}>
        <div className={styles.root}>
          <div className={styles.content}>
            {this.renderTheater()}
            <div className={styles.container}>
              <div className='row'>
                <div className='col s12 m8 l8'>
                  {this.renderInfo()}
                </div>
                <div className='col s12 m4 l4'>
                  <div className='card'>
                    Related Movies
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, movieActions)(MovieDetailView)
