import React, { PropTypes } from 'react';
import styles from './SearchBar.scss';
import Preloader from './Preloader';

export default class SearchBar extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    keywordMinLength: PropTypes.number,
    suggest: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    showSuggestions: PropTypes.func.isRequired,
    hideSuggestions: PropTypes.func.isRequired,
    updateKeyword: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    keyword: PropTypes.string,
    className: PropTypes.string,
    isFetching: PropTypes.bool,
    requestForcus: PropTypes.bool,
    style: PropTypes.object,
  };

  static defaultProps = {
    placeholder: 'Search...',
    keyword: '',
    className: '',
    keywordMinLength: 3,
    suggest: () => {},
    clear: () => {},
    onClose: () => {},
    search: () => {},
    updateKeyword: () => {},
    isFetching: false,
    style: {},
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { search } = this.props;
    const newKeyword = this.refs.searchField.value;
    this.refs.searchField.blur();
    search(newKeyword);
  };

  onChange = (e) => {
    e.preventDefault();
    const { keywordMinLength, suggest, clear, updateKeyword } = this.props;
    const newKeyword = e.target.value;
    updateKeyword(newKeyword);
    if (newKeyword.length >= keywordMinLength) {
      suggest(newKeyword);
    } else {
      clear();
    }
  };

  onBlur = (e) => {
    e.preventDefault();
    const { hideSuggestions } = this.props;
    setTimeout(hideSuggestions, 10);
  };

  onFocus = (e) => {
    e.preventDefault();
    const { showSuggestions } = this.props;
    showSuggestions();
  };

  isMobile() {
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return deviceWidth < 600;
  }

  render() {
    const {
      placeholder,
      isFetching,
      style,
      keyword,
      className,
      onClose,
    } = this.props;
    const isFocused = this.refs.searchField === document.activeElement;
    const handleClose = (e) => {
      onClose(isFocused);

      e.preventDefault();
      const { clear, updateKeyword } = this.props;
      updateKeyword('');
      clear();
    };
    return (
      <form style={style} className={`${styles.root} ${className}`} onSubmit={this.onSubmit} autoComplete="off">
        <div
          className="input-field"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref="searchField"
            autoComplete="off"
            id="search"
            value={keyword}
            onChange={this.onChange}
            type="search"
            placeholder={placeholder}
            required
            style={{
              lineHeight: 44,
            }}
          />
          <label
            htmlFor="search"
            onClick={this.onSubmit}
          >
            <i className="material-icons">search</i>
          </label>
          <i
            className={`${styles.close} material-icons`}
            onClick={handleClose}
            style={{
              display: isFetching ? 'none' : 'block',
              color: !isFocused && this.isMobile() ? 'white' : '',
            }}
          >close</i>
          <Preloader
            show={isFetching}
            style={{
              position: 'absolute',
              top: '0.2rem',
              right: '0.8rem',
              transition: '.3s color',
            }}
          />
        </div>
      </form>
    );
  }
}
