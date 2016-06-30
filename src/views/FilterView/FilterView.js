import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import Tooltip from 'react-tooltip';
import { isEqual } from 'lodash';

import { actions as filterActions } from '../../redux/modules/filter';
import classes from './FilterView.scss';

import AuthenticatedView from '../AuthenticatedView/AuthenticatedView';
import MovieGrid from 'components/MovieGrid';
import Preloader from 'components/Preloader';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  context: state.filter,
  auth: state.auth
});
export class FilterView extends AuthenticatedView {
  static propTypes = {
    getMovies: PropTypes.func,
    itemsPerPage: PropTypes.number,
    context: PropTypes.object
  };

  static defaultProps = {
    getMovies: () => {},
    context: {},
    itemsPerPage: 20
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillReceiveProps (nextProps) {
    const { getMovies, params, context } = nextProps;
    if ((context && context.status === 'init') || !isEqual(params, this.props.params)) {
      getMovies(params);
    }
  }

  componentDidMount () {
    const { getMovies, params, context } = this.props;
    if (context && context.status === 'init') {
      getMovies(params);
    }
  }

  loadMore = () => {
    const { getMovies, params, context } = this.props;
    if (context && context.status !== 'fullyloaded') {
      getMovies(params);
    }
  };

  render () {
    const { params, context } = this.props;
    if (!context) {
      return (
        <div></div>
      );
    }
    const isOnMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let tooltipNode;
    if (!isOnMobile) {
      tooltipNode = (<Tooltip effect='solid' />);
      Tooltip.rebuild();
    }
    return (
      <DocumentTitle title={`Category: ${params.tag} — Quickflix`}>
        <div>
          <div className={classes.content}>
            <MovieGrid
              movies={context.movies}
              onScrollBottom={this.loadMore}
            />
            <div className='valign-wrapper'>
              <div className={classes.preloader}>
                <Preloader show={context.status === 'loading'} />
              </div>
            </div>
          </div>
          {tooltipNode}
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToProps, filterActions)(FilterView);
