import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions as movieActions } from '../../redux/modules/movie';
import classes from './HomeView.scss';

import MovieCollection from 'components/MovieCollection';
import Preloader from 'components/Preloader';
import TopNav from '../TopNav/TopNav';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  movie: state.movie,
});
export class HomeView extends React.Component {
  static propTypes = {
    getHomeMovies: PropTypes.func,
    movie: PropTypes.object,
    itemsPerPage: PropTypes.number,
  };

  static defaultProps = {
    getHomeMovies: () => {},
    movie: {},
    itemsPerPage: 20,
  };

  componentDidMount() {
    const { getHomeMovies } = this.props;
    getHomeMovies();
  }

  loadMore = () => {
    const { getHomeMovies } = this.props;
    getHomeMovies(true);
  };

  render() {
    const { movie } = this.props;
    return (
      <div>
        <TopNav/>
        <div className={classes.content}>
          <MovieCollection
            movies={movie.movies}
            onScrollBottom={this.loadMore}
          />
          <div className="valign-wrapper">
            <div className={classes.preloader}>
              <Preloader show={movie.isFetching} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, movieActions)(HomeView);
