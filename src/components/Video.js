import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
const vjs = window.videojs;
import _debounce from 'lodash.debounce';
import _forEach from 'lodash.foreach';

const DEFAULT_HEIGHT = 540;
const DEFAULT_WIDTH = 960;
const DEFAULT_ASPECT_RATIO = (9 / 16);
const DEFAULT_ADJUSTED_SIZE = 0;
const DEFAULT_RESIZE_DEBOUNCE_TIME = 500;
const DEFAULT_VIDEO_OPTIONS = {
  preload: 'auto',
  autoplay: true,
  controls: true,
};


function noop() {}

export default class ReactVideoJsComponent extends React.Component {

  constructor() {
    super();
    // initial state
    this.state = {

    };
  }

  componentDidMount() {
    this.mountVideoPlayer();
  }

  componentWillReceiveProps(nextProps) {
    const isEndless = this.props.endlessMode;
    const willBeEndless = nextProps.endlessMode;

    if (isEndless !== willBeEndless) {
      if (willBeEndless) {
        this.addEndlessMode();
      } else {
        this.removeEndlessMode();
      }
    }

    const isResizable = this.props.resize;
    const willBeResizeable = nextProps.resize;

    if (isResizable !== willBeResizeable) {
      if (willBeResizeable) {
        this.addResizeEventListener();
      } else {
        this.removeResizeEventListener();
      }
    }

    const currentSrc = this.props.src;
    const newSrc = nextProps.src;

    if (currentSrc !== newSrc) {
      this.setVideoPlayerSrc(newSrc);
    } else if (isEndless === willBeEndless) {
      this.restartVideo();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.unmountVideoPlayer();
  }

  getVideoPlayer() {
    return this._player;
  }

  getVideoPlayerEl() {
    return ReactDOM.findDOMNode(this.refs.videoPlayer);
  }

  getVideoPlayerOptions() {
    return {
      height: this.props.resize ? 'auto' : (this.props.height || DEFAULT_HEIGHT),
      width: this.props.resize ? 'auto' : (this.props.width || DEFAULT_WIDTH),
      ...DEFAULT_VIDEO_OPTIONS,
      ...this.props.options,
    };
  }

  getVideoResizeOptions() {
    return {
      aspectRatio: DEFAULT_ASPECT_RATIO,
      shortWindowVideoHeightAdjustment: DEFAULT_ADJUSTED_SIZE,
      defaultVideoWidthAdjustment: DEFAULT_ADJUSTED_SIZE,
      debounceTime: DEFAULT_RESIZE_DEBOUNCE_TIME,
      ...this.props.resizeOptions,
    };
  }

  getResizedVideoPlayerMeasurements() {
    const resizeOptions = this.getVideoResizeOptions();
    const aspectRatio = resizeOptions.aspectRatio;
    const defaultVideoWidthAdjustment = resizeOptions.defaultVideoWidthAdjustment;

    const winHeight = this._windowHeight();

    const baseWidth = this._videoElementWidth();

    const vidWidth = baseWidth - defaultVideoWidthAdjustment;
    let vidHeight = vidWidth * aspectRatio;

    if (winHeight < vidHeight) {
      const shortWindowVideoHeightAdjustment = resizeOptions.shortWindowVideoHeightAdjustment;
      vidHeight = winHeight - shortWindowVideoHeightAdjustment;
    }

    return {
      width: vidWidth,
      height: vidHeight,
    };
  }

  setVideoPlayerSrc(src) {
    this._player.src(src);
  }

  setCurrentTime(time) {
    this._player.currentTime(time);
  }

  restartVideo() {
    this._player.currentTime(0).play();
  }

  togglePauseVideo() {
    if (this._player.paused()) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  }

  handleVideoPlayerReady() {
    if (this.props.resize) {
      this.handleVideoPlayerResize();
      this.addResizeEventListener();
    }

    if (this.props.startWithControlBar) {
      this._player.bigPlayButton.hide();
      this._player.controlBar.show();
      this._player.userActive(true);
      this._player.play();
      this._player.pause();
    }

    this.props.onReady();
  }

  handleVideoPlayerResize() {
    const player = this._player;
    const videoMeasurements = this.getResizedVideoPlayerMeasurements();

    player.dimensions(videoMeasurements.width, videoMeasurements.height);
  }

  handleNextVideo() {
    this.props.onNextVideo();
  }

  unmountVideoPlayer() {
    this.removeResizeEventListener();
    this._player.dispose();
  }

  addEndlessMode() {
    const player = this._player;

    player.on('ended', this.handleNextVideo);

    if (player.ended()) {
      this.handleNextVideo();
    }
  }

  addResizeEventListener() {
    const debounceTime = this.getVideoResizeOptions().debounceTime;

    this._handleVideoPlayerResize = _debounce(this.handleVideoPlayerResize, debounceTime);
    window.addEventListener('resize', this._handleVideoPlayerResize);
  }

  removeEndlessMode() {
    const player = this._player;

    player.off('ended', this.handleNextVideo);
  }

  removeResizeEventListener() {
    window.removeEventListener('resize', this._handleVideoPlayerResize);
  }

  pauseVideo() {
    this._player.pause();
  }

  playVideo() {
    this._player.play();
  }

  _videoElementWidth() {
    return this.getVideoPlayerEl().parentElement.parentElement.offsetWidth;
  }

  _windowHeight() {
    return window.innerHeight;
  }

  mountVideoPlayer() {
    const src = this.props.src;
    const options = this.getVideoPlayerOptions();

    const playerEl = this.getVideoPlayerEl();
    playerEl.removeAttribute('data-reactid');

    this._player = vjs(playerEl, options);

    const player = this._player;

    const tracks = this.props.tracks;
    _forEach(tracks, (track) => {
      player.addRemoteTextTrack(track);
    });

    if (this.props.crossOrigin) {
      playerEl.crossOrigin = this.props.crossOrigin;
    }

    player.ready(this.handleVideoPlayerReady.bind(this));

    _forEach(this.props.eventListeners, (val, key) => {
      player.on(key, val);
    });

    player.src(src);

    if (this.props.endlessMode) {
      this.addEndlessMode();
    }
  }

  renderDefaultWarning() {
    return (
      <p>test</p>
    );
  }

  render() {
    let videoPlayerClasses = cx({
      'video-js': true,
      'vjs-default-skin': this.props.vjsDefaultSkin,
      'vjs-big-play-centered': this.props.vjsBigPlayCentered,
    });

    if (this.props.className) {
      videoPlayerClasses = `${videoPlayerClasses} ${this.props.className}`;
    }

    return (
      <video ref="videoPlayer" className={videoPlayerClasses}>
        {this.props.children || this.renderDefaultWarning()}
      </video>
    );
  }
}

ReactVideoJsComponent.propTypes = {
  src: React.PropTypes.any.isRequired,
  className: React.PropTypes.string,
  tracks: React.PropTypes.array,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  crossOrigin: React.PropTypes.string,
  endlessMode: React.PropTypes.bool,
  options: React.PropTypes.object,
  onReady: React.PropTypes.func,
  eventListeners: React.PropTypes.object,
  resize: React.PropTypes.bool,
  resizeOptions: React.PropTypes.shape({
    aspectRatio: React.PropTypes.number,
    shortWindowVideoHeightAdjustment: React.PropTypes.number,
    defaultVideoWidthAdjustment: React.PropTypes.number,
    debounceTime: React.PropTypes.number,
  }),
  vjsDefaultSkin: React.PropTypes.bool,
  vjsBigPlayCentered: React.PropTypes.bool,
  startWithControlBar: React.PropTypes.bool,
  markers: React.PropTypes.arrayOf(React.PropTypes.object),
  children: React.PropTypes.element,
  dispose: React.PropTypes.bool,
  onNextVideo: React.PropTypes.func,
};

ReactVideoJsComponent.defaultProps = {
  crossOrigin: 'anonymous',
  tracks: [],
  endlessMode: false,
  options: DEFAULT_VIDEO_OPTIONS,
  onReady: noop,
  eventListeners: {},
  resize: false,
  resizeOptions: {},
  vjsDefaultSkin: true,
  vjsBigPlayCentered: true,
  startWithControlBar: false,
  markers: [],
  onNextVideo: noop,
};

ReactVideoJsComponent.displayName = ReactVideoJsComponent.constructor.name;
