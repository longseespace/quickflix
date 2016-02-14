import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './MovieDetailView.scss';
import { actions as movieActions } from '../../redux/modules/movie';

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView';

import TopNav from '../TopNav/TopNav';
import Preloader from 'components/Preloader';
import Video from 'components/Video';

const mapStateToProps = (state) => ({
  context: state.movie,
  auth: state.auth,
});
export class MovieDetailView extends AuthenticatedView {

  static propTypes = {
    params: PropTypes.object,
    context: PropTypes.object,
    getMovie: PropTypes.func.isRequired,
    clearMovie: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    params: { id: 0 },
    context: {},
    getMovie: () => {},
    clearMovie: () => {},
  };

  componentWillMount() {
    super.componentWillMount();
    const { getMovie, params, context } = this.props;
    if (!context.isFetched) {
      getMovie(params.id);
    }
  }

  componentWillUnmount() {
    const { clearMovie } = this.props;
    clearMovie();
  }

  renderInner() {
    const { context } = this.props;
    if (!context.isFetched) {
      return (
        <div className="valign-wrapper">
          <div className={styles.preloader}>
            <Preloader show={context.isFetching} />
          </div>
        </div>
      );
    }

    const { detail, playlist, overview } = context.movie;
    const tracks = playlist.subtitle.map((item) => ({
      kind: 'captions',
      src: item.source,
      srclang: item.sub === 'VIE' ? 'vi' : 'en',
      label: item.sub === 'VIE' ? 'Tiếng Việt' : 'English',
      default: item.sub === 'VIE' ? false : true,
    }));
    const video = (
      <Video
        ref="video"
        src={{
          src: playlist.playList,
          type: 'application/x-mpegURL',
        }}
        tracks={tracks}
        height={480}
        options={{
          preload: 'none',
          poster: detail.background,
          autoplay: false,
          plugins: {
            Resume: {
              uuid: `${overview.MovieID}-${overview.Season}-${overview.currentSequence}`,
              playbackOffset: 5, // begin playing video this number of seconds before it otherwise would.
            },
          },
        }}
      >
      </Video>
    );
    return (
      <div className={styles.theater}>
        <div className={styles.placeholder}>
          {video}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.root}>
        <TopNav/>
        <div className={styles.content}>
          {this.renderInner()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, movieActions)(MovieDetailView);
