import React, { PropTypes } from 'react';

export default class SearchBar extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    keywordMinLength: PropTypes.number,
    suggest: PropTypes.func.isRequired,
    invalidate: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    keyword: PropTypes.string,
  };

  static defaultProps = {
    placeholder: 'Find Movies, TV shows, Celebrities and more...',
    keyword: '',
    keywordMinLength: 3,
    suggest: () => {},
    invalidate: () => {},
    search: () => {},
  };

  render() {
    const { placeholder, keywordMinLength, suggest, invalidate, keyword, search } = this.props;
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
    return (
      <nav>
        <div className="nav-wrapper">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="input-field blue-grey">
              <input ref="searchField" autoComplete="off" id="search" onChange={onChange} type="search" placeholder={placeholder} value={keyword} required />
              <label htmlFor="search" onClick={onSubmit} style={{ cursor: 'pointer' }}><i className="material-icons">search</i></label>
              <i className="material-icons">close</i>
            </div>
          </form>
        </div>
      </nav>
    );
  }
}
