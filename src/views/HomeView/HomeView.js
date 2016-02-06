import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions as searchActions } from '../../redux/modules/search';
import classes from './HomeView.scss';

import SearchBar from 'components/SearchBar';
import SearchSuggestionList from 'components/SearchSuggestionList';
import SearchResultList from 'components/SearchResultList';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  search: state.search,
});
export class HomeView extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    invalidateSuggestions: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    fetchSearchResults: PropTypes.func.isRequired,
    requestSearch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    search: {},
    invalidateSuggestions: () => {},
    fetchSuggestions: () => {},
    fetchSearchResults: () => {},
    requestSearch: () => {},
  };

  render() {
    const { fetchSuggestions, fetchSearchResults, invalidateSuggestions, search } = this.props;
    const showSuggestion = !search.invalidated && !search.isFetching;
    return (
      <div>
        <div className={classes.searchbar}>
          <div className="container">
            <div className="row">
              <div className="col s8 push-s2">
                <SearchBar
                  search={fetchSearchResults}
                  keyword={search.keyword}
                  suggest={fetchSuggestions}
                  invalidate={invalidateSuggestions}
                  isFetching={search.isFetching}
                />
                <SearchSuggestionList
                  suggestions={search.suggestions}
                  show={showSuggestion}
                  keyword={search.keyword}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.content}>
          <SearchResultList searchResults={search.searchResults} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, searchActions)(HomeView);
