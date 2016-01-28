import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions as counterActions } from '../../redux/modules/counter';
// import classes from './HomeView.scss';

// import IconButton from 'material-ui/lib/icon-button';
// import IconMenu from 'material-ui/lib/menus/icon-menu';
// import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
// import MenuItem from 'material-ui/lib/menus/menu-item';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter: state.counter,
});
export class HomeView extends React.Component {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>

      </div>
    );
  }
}

export default connect(mapStateToProps, counterActions)(HomeView);
