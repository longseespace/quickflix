import React, { PropTypes } from 'react';
import classes from './SearchBar.scss';

export default class SearchBar extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    keywordMinLength: PropTypes.number,
    suggest: PropTypes.func.isRequired,
    invalidate: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    keyword: PropTypes.string,
    isFetching: PropTypes.bool,
    style: PropTypes.object,
  };

  static defaultProps = {
    placeholder: 'Find Movies, TV shows, Celebrities and more...',
    keyword: '',
    keywordMinLength: 3,
    suggest: () => {},
    invalidate: () => {},
    search: () => {},
    isFetching: false,
    style: {},
  };

  render() {
    const { placeholder, keywordMinLength, suggest, invalidate, keyword, search, isFetching, style } = this.props;
    const onSubmit = (e) => {
      e.preventDefault();
      const newKeyword = this.refs.searchField.value;
      search(newKeyword);
    };
    const onChange = (e) => {
      e.preventDefault();
      const newKeyword = e.target.value;
      if (newKeyword.length >= keywordMinLength) {
        suggest(newKeyword);
      } else {
        invalidate(newKeyword);
      }
    };
    const close = (e) => {
      e.preventDefault();
      invalidate('');
    };
    return (
      <form style={style} className={classes.root} onSubmit={onSubmit} autoComplete="off">
        <div
          className="input-field blue accent-1"
          style={{
            boxShadow: '0 1px 1.5px rgba(0,0,0,0.06),0 1px 1px rgba(0,0,0,0.12)',
            borderRadius: 2,
          }}
        >
          <input
            ref="searchField"
            autoComplete="off"
            id="search"
            onChange={onChange}
            type="search"
            placeholder={placeholder}
            value={keyword}
            required
            style={{
              height: '44px',
              lineHeight: '44px',
            }}
          />
          <label
            htmlFor="search"
            onClick={onSubmit}
            style={{ cursor: 'pointer', height: '44px', lineHeight: '44px' }}
          >
            <i className="material-icons" style={{ cursor: 'pointer', height: '44px', lineHeight: '44px' }}>search</i>
          </label>
          <i
            className="material-icons"
            onClick={close}
            style={{ display: isFetching ? 'none' : 'block', height: '44px', lineHeight: '44px' }}
          >close</i>
          <div
            className="preloader-wrapper small active"
            style={{
              display: isFetching ? 'block' : 'none',
              position: 'absolute',
              top: '0.2rem',
              right: '0.8rem',
              transition: '.3s color',
            }}
          >
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
