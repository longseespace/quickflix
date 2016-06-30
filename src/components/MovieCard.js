import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
import { truncate } from 'lodash';
import LazyLoad from 'react-lazy-load';
import sanitize from 'sanitize-html';
import Movie from 'models/Movie';

import Image from './Image';
import styles from './MovieCard.scss';

export default class MovieCard extends Component {
  static propTypes = {
    lazyload: PropTypes.bool,
    movie: PropTypes.shape(Movie.propTypes)
  };

  static defaultProps = {
    lazyload: true,
    movie: Movie.defaultProps
  };

  constructor (props) {
    super(props);
    this.state = {
      hover: false,
      withinViewport: true,
      placeholderHeight: 189
    };
  }

  componentDidMount () {
    const $ = window.$;
    $(window).on('scroll', this.onScroll);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount () {
    const $ = window.$;
    $(window).off('scroll', this.onScroll);
  }

  onScroll = () => {
    const $ = window.$;
    const windowHeight = $(window).height();
    const cardHeight = this.refs.card.scrollHeight;
    const windowScrollTop = $(window).scrollTop();
    const offsetTop = this.refs.card.offsetTop;
    const OFFSET = 400;

    if ((windowScrollTop - OFFSET <= offsetTop && offsetTop <= windowScrollTop + windowHeight + OFFSET) ||
      (windowScrollTop - OFFSET <= offsetTop + cardHeight &&
        offsetTop + cardHeight <= windowScrollTop + windowHeight + OFFSET)) {
      // in
      this.setState({
        ...this.state,
        withinViewport: true
      });
    } else {
      // out
      this.setState({
        ...this.state,
        withinViewport: false
      });
    }
  };

  onMouseOver = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      hover: true
    });
  };

  onMouseOut = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      hover: false
    });
  };

  onTouchTap = (e) => {
    const $ = window.$;
    const isTargetAButton = $(e.target).hasClass('material-icons');
    const isOnMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isTargetAButton && isOnMobile) {
      const { hover } = this.state;
      this.setState({
        ...this.state,
        hover: !hover
      });
    }
  };

  play = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  onImageLoad = () => {
    this.setState({
      ...this.state,
      placeholderHeight: '100%'
    });
  };

  render () {
    const { lazyload, movie } = this.props;
    const { id, plot, backdrop, name, bitrate, sequence, imdbRating, isTVSerie } = movie;
    const { hover, withinViewport, placeholderHeight } = this.state;
    const imageNode = lazyload ? (
      <LazyLoad height={placeholderHeight}>
        <Image onLoad={this.onImageLoad} ref='image' src={backdrop} />
      </LazyLoad>
    ) : (<Image src={backdrop} />);
    const maskClassName = hover ? `${styles.maskHover}  center-inside` : `${styles.mask} center-inside`;
    const isHD = bitrate && (bitrate.indexOf('5700') > -1 || bitrate.indexOf('2700') > -1);
    const HDText = bitrate && bitrate.indexOf('5700') > -1 ? '1080p' : '720p';
    const qualityNode = isHD ? (
      <a className='waves-effect waves-red btn-flat btn-quality' data-tip={HDText}>
        <i className='material-icons'>hd</i>
      </a>
    ) : null;
    const serieText = isTVSerie ? sequence : '';
    const serieNode = isTVSerie ? (
      <span className='tag-episode'>{serieText}</span>
    ) : null;
    const imdbRatingText = imdbRating ? parseFloat(imdbRating).toFixed(1) : '';
    const imdbNode = imdbRating ? (
      <a className='waves-effect waves-red btn-flat btn-imdb' data-tip={`IMDB ${imdbRatingText}`}>
        <div className={styles.imdb}><span>{imdbRatingText}</span></div>
      </a>
    ) : null;
    const plotText = sanitize(plot, {
      allowedTags: [],
      allowedAttributes: []
    });
    const truncatedPlot = truncate(plotText, {
      length: hover ? 200 : 300,
      separator: ' '
    });
    const playLink = isTVSerie ? `/movie/${id}/${sequence}` : `/movie/${id}`;

    // const infoNode = (
    //   <Link to={`/movie/${id}`} className="waves-effect waves-red btn-flat" title="Info" alt="Info">
    //     <i className="material-icons">info_outline</i>
    //   </Link>
    // );
    return (
      <div
        ref='card'
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        className={`${styles.root} card medium`}
        id={`movie-${id}`}
        style={{
          overflow: 'hidden',
          visibility: withinViewport ? 'visible' : 'hidden'
        }}
      >
        <div className='card-image' onTouchTap={this.onTouchTap}>
          {imageNode}
          <div className={styles.tags}>
            {serieNode}
          </div>
          <div className={maskClassName}>
            <Link to={playLink}
              style={{ opacity: hover ? 1 : 0, transition: 'none' }}
              className='btn-floating btn-large waves-effect waves-light red accent-4'
            >
              <i style={{ fontSize: 36 }} className='material-icons'>play_arrow</i>
            </Link>
          </div>
          <span className='card-title truncate' style={{ maxWidth: '100%' }}>{name}</span>
        </div>
        <div style={{ maxHeight: hover ? '40%' : '60%' }} className='card-content' onTouchTap={this.onTouchTap}>
          <p className='truncated-plot'>{truncatedPlot}</p>
        </div>
        <div className={`${styles.actions} card-action`}>
          <a className='waves-effect waves-red btn-flat' data-tip='Trailer'>
            <i className='material-icons'>ondemand_video</i>
          </a>
          <a className='waves-effect waves-red btn-flat' data-tip='Add to Favorite'>
            <i className='material-icons'>favorite_border</i>
          </a>
          {qualityNode}
          {imdbNode}
          <a title='Show full plot' alt='Show full plot' className='activator'>
            <i
              className='material-icons right'
              data-tip='Show full plot'>expand_less</i>
          </a>
        </div>
        <div className='card-reveal'>
          <div className={`${styles.actions} card-action`}>
            <a className='waves-effect waves-red btn-flat' data-tip='Trailer'>
              <i className='material-icons'>ondemand_video</i>
            </a>
            <a className='waves-effect waves-red btn-flat' data-tip='Add to Favorite'>
              <i className='material-icons'>favorite_border</i>
            </a>
            {qualityNode}
            {imdbNode}
          </div>
          <div className='card-content'>
            <span className='card-title grey-text text-darken-4'>
              {name}<i className='material-icons right'>close</i>
            </span>
            <p className='full-plot'>{plotText}</p>
          </div>
        </div>
      </div>
    );
  }
}
