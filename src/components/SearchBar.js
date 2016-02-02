import React, { PropTypes } from 'react';

export default class SearchBar extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    keywordMinLength: PropTypes.number,
    suggest: PropTypes.func.isRequired,
    requestSuggestions: PropTypes.func,
    invalidate: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    keyword: PropTypes.string,
  };

  static defaultProps = {
    placeholder: 'Find Movies, TV shows, Celebrities and more...',
    keyword: '',
    keywordMinLength: 3,
    suggest: () => {},
    requestSuggestions: () => {},
    invalidate: () => {},
    search: () => {},
  };

  render() {
    const { placeholder, keywordMinLength, suggest, invalidate, keyword, requestSuggestions } = this.props;
    const onSubmit = (e) => {
      e.preventDefault();
    };
    const buffer = (func, wait, scope) => {
      let timer = null;
      return function inner() {
        if (timer) {
          clearTimeout(timer);
        }
        const args = arguments;
        timer = setTimeout(() => {
          timer = null;
          func.apply(scope, args);
        }, wait);
      };
    };
    const buffered = buffer(suggest, 1000);
    const onChange = (e) => {
      e.preventDefault();
      const newKeyword = e.target.value;
      if (newKeyword.length >= keywordMinLength) {
        requestSuggestions(newKeyword);
        buffered(newKeyword);
      } else {
        invalidate(newKeyword);
      }
    };
    return (
      <nav>
        <div className="nav-wrapper">
          <form onSubmit={onSubmit} onChange={onChange} autoComplete="off">
            <div className="input-field blue-grey">
              <input autoComplete="off" id="search" type="search" placeholder={placeholder} value={keyword} required />
              <label htmlFor="search"><i className="material-icons">search</i></label>
              <i className="material-icons">close</i>
            </div>
          </form>
        </div>
      </nav>
    );
  }
}
