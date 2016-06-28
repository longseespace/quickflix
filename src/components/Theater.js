import React, { PropTypes } from 'react';
import range from 'lodash.range';

import Preloader from 'components/Preloader';
import Video from 'components/Video';

import styles from './Theater.scss';

export default class Theater extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
    show: PropTypes.bool,
    tracks: PropTypes.array,
    currentEpisode: PropTypes.number,
    totalEpisode: PropTypes.number,
    poster: PropTypes.string,
    play: PropTypes.func,
    status: PropTypes.oneOf(['init', 'loading', 'loaded'])
  };

  static defaultProps = {
    style: {},
    show: true,
    status: 'init'
  };

  onResize = () => {
    const { width, height } = this.getTargetSize();
    const video = this.refs.video;
    if (video) {
      const player = video.getVideoPlayer();
      player.width(width);
      player.height(height);
    }
  };

  getTargetSize = () => {
    const $ = window.$;
    const $window = $(window);
    const windowWidth = $window.width();
    let width;
    let height;
    if (windowWidth >= 960) {
      width = 960;
      height = 480;
    } else if (windowWidth >= 480) {
      width = 480;
      height = 240;
    } else {
      width = windowWidth;
      height = windowWidth / 2;
    }
    return { width, height };
  }

  componentDidMount = () => {
    const $ = window.$;
    const $window = $(window);
    $window.on('resize', this.onResize);
  }

  componentWillUnmount () {
    const $ = window.$;
    const $window = $(window);
    $window.off('resize', this.onResize);
  }

  renderInner () {
    const { width, height } = this.getTargetSize();
    const { status } = this.props;
    if (status !== 'loaded') {
      return (
        <div className={`valign-wrapper ${styles.preloaderWrapper}`}>
          <div className={styles.preloader}>
            <Preloader show />
          </div>
        </div>
      );
    } else {
      const { currentEpisode, totalEpisode, play, src, tracks, poster } = this.props;
      const playlistOptions = {
        currentEpisode,
        items: range(totalEpisode).map((index) => ({
          episode: index + 1,
          title: `Episode ${index + 1}`
        })),
        play
      };
      return (
        <Video
          ref='video'
          src={{
            src,
            type: 'application/x-mpegURL'
          }}
          playlist={playlistOptions}
          tracks={tracks}
          width={width}
          height={height}
          onReady={this.handlePlayerReady}
          options={{
            preload: 'none',
            poster,
            autoplay: false,
            plugins: {
              // Resume: {
              //   uuid: `${overview.MovieID}-${overview.Season}-${overview.currentSequence}`,
              //   playbackOffset: 5, // begin playing video this number of seconds before it otherwise would.
              // },
            }
          }}
        />
      );
    }
  }

  render () {
    return (
      <div className={styles.theater}>
        <div className={styles.placeholder}>
          {this.renderInner()}
        </div>
      </div>
    );
  }
}
