import React, { PropTypes } from 'react';

export default class SearchBar extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    keywordMinLength: PropTypes.number,
    suggest: PropTypes.func.isRequired,
    invalidate: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    keyword: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: 'Find Movies, TV shows, Celebrities and more...',
    keyword: '',
    keywordMinLength: 3,
    suggest: () => {},
    invalidate: () => {},
    search: () => {},
    isFetching: false,
  };

  render() {
    const { placeholder, keywordMinLength, suggest, invalidate, keyword, search, isFetching } = this.props;
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
      <nav>
        <div className="nav-wrapper">
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="input-field blue-grey">
              <input ref="searchField" autoComplete="off" id="search" onChange={onChange} type="search" placeholder={placeholder} value={keyword} required />
              <label htmlFor="search" onClick={onSubmit} style={{ cursor: 'pointer' }}><i className="material-icons">search</i></label>
              <i className="material-icons" style={{ display: isFetching ? 'none' : 'block' }} onClick={close}>close</i>

              <div
                className="preloader-wrapper small active"
                style={{
                  display: isFetching ? 'block' : 'none',
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
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
        </div>
      </nav>
    );
  }
}
