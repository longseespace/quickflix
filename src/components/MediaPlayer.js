import React, { PropTypes } from 'react';
import Video from './Video';
import styles from './MediaPlayer.scss';

export default class MediaPlayer extends React.Component {
  static propTypes = {
    source: PropTypes.array.isRequired,
  };

  static defaultProps = {
    source: [],
  };

  onReady = () => {
    // const video = this.refs.video;
  };

  render() {
    return (
      <div className={styles.root}>
        <Video
          ref="video"
          src="http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_5mb.mp4"
          startWithControlBar={true}
          options={{
            poster: 'http://t.hdviet.com/backdrops/945x530/e88346f9432128a0cb637e27c80c4fcb.jpg',
            autoplay: false,
            preload: 'none',
          }}
          onReady={this.onReady}
        />
      </div>
    );
  }
}
