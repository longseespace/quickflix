import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classes from './SearchSuggestionList.scss';

export default class SearchSuggestionList extends React.Component {
  static propTypes = {
    suggestions: PropTypes.array,
    show: PropTypes.bool,
    isFetching: PropTypes.bool,
    keyword: PropTypes.string,
    limit: PropTypes.number,
  };

  static defaultProps = {
    suggestions: [],
    show: false,
    isFetching: false,
    keyword: '',
    limit: 5,
  };

  render() {
    const { suggestions, show, keyword, limit } = this.props;
    let suggestionItems;
    if (suggestions.length > 0) {
      suggestionItems = suggestions.filter((item, index) => index < limit).map((item, key) => {
        const releaseYear = new Date(item.releaseDate).getFullYear();
        return (
          <li key={key} className="collection-item avatar" style={{ float: 'none', cursor: 'pointer' }}>
            <img style={{ borderRadius: 0, height: 'auto' }} className="circle" src={item.poster} width={50} alt={item.name} />
            <span style={{ color: 'black' }} className="title">{item.name.vi}</span> <span style={{ color: 'gray' }}>({releaseYear})</span>
            <p style={{ color: 'gray' }} className="truncate">{item.plot.vi}</p>
            <p style={{ color: 'gray' }}>{item.director}</p>
            <span className="secondary-content">{item.imdbRating}</span>
          </li>
        );
      });
      suggestionItems.push((
        <li key={100} className="collection-item" style={{ float: 'none', cursor: 'pointer' }}>
          <Link to={`/search/${keyword}`}>
            <span style={{ color: 'black' }} className="title">See all results for </span>
            <span style={{ color: 'black', fontStyle: 'italic' }} className='keyword'>"{keyword}"</span>
          </Link>
        </li>
      ));
    } else if (keyword.length > 0) {
      suggestionItems = (
        <li key={0} className="collection-item" style={{ float: 'none' }}>
          <span style={{ color: 'black' }} className="title">No suggested matches</span>
        </li>
      );
    }
    return (
      <span className={classes.root}>
        <ul className="collection z-depth-2"
          style={{
            border: 'none',
            borderRadius: 0,
            display: show ? 'block' : 'none',
            top: -15,
          }}
        >
          {suggestionItems}
        </ul>
      </span>
    );
  }
}
