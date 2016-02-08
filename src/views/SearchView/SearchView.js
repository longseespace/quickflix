import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions as searchActions } from '../../redux/modules/search';
import classes from '../HomeView/HomeView.scss';

import TopNav from '../TopNav/TopNav';
import SearchResultList from 'components/SearchResultList';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  search: state.search,
});
export class SearchView extends React.Component {
  static propTypes = {
    search: PropTypes.object,
  };

  static defaultProps = {
    search: {},
  };

  render() {
    const { search } = this.props;
    return (
      <div>
        <TopNav />
        <div className={classes.content}>
          <SearchResultList searchResults={search.searchResults} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, searchActions)(SearchView);
