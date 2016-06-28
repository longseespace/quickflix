import React, { PropTypes } from 'react';
import styles from './SearchBar.scss';
import Preloader from './Preloader';

export default class SearchBar extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    keyword: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    processing: PropTypes.bool
  };

  static defaultProps = {
    placeholder: 'Search...',
    onClose: () => {},
    onSubmit: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
    keyword: '',
    className: '',
    style: {},
    processing: false
  };

  constructor (props) {
    super(props);
    this.state = {
      keyword: props.keyword
    };
  }

  isNarrow () {
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return deviceWidth < 600;
  }

  render () {
    const {
      placeholder,
      style,
      className,
      onClose,
      onSubmit,
      onFocus,
      onBlur,
      onChange,
      processing
    } = this.props;
    const { keyword } = this.state;
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(e, this.refs.searchField.value);
    };
    const handleClose = (e) => {
      e.preventDefault();
      this.setState({
        keyword: ''
      });
      onClose(e);
    };
    const handleChange = (e) => {
      e.preventDefault();
      const value = this.refs.searchField.value;
      this.setState({
        keyword: value
      });
      onChange(e, value);
    };
    return (
      <form style={style} className={`${styles.root} ${className}`} onSubmit={handleSubmit} autoComplete='off'>
        <div className='input-field'>
          <input
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            ref='searchField'
            autoComplete='off'
            value={keyword}
            placeholder={placeholder}
            type='search'
            id={styles.searchField}
            required
          />
          <label
            htmlFor={styles.searchField}
            onClick={onSubmit}
          >
            <i className='material-icons'>search</i>
          </label>
          <i
            className={`${styles.close} material-icons btn-close`}
            onClick={handleClose}
            style={{
              display: processing ? 'none' : 'block',
              color: this.isNarrow() ? 'white' : ''
            }}
          >close</i>
          <Preloader
            show={processing}
            style={{
              position: 'absolute',
              top: '0.2rem',
              right: '0.8rem',
              transition: '.3s color'
            }}
          />
        </div>
      </form>
    );
  }
}
