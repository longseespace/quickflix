import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Base64 } from 'js-base64';

import { actions as topnavActions } from '../../redux/modules/topnav';
import { actions as authActions } from '../../redux/modules/auth';

import SearchBar from 'components/SearchBar';
import SearchSuggestionList from 'components/SearchSuggestionList';
import classes from './TopNav.scss';
import logo from './logo.png';

const mapStateToProps = (state) => ({
  context: state.topnav,
  auth: state.auth,
});
const actions = {
  ...topnavActions,
  ...authActions,
};
export class TopNav extends React.Component {
  static propTypes = {
    context: PropTypes.object,
    auth: PropTypes.object,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    showSuggestions: PropTypes.func.isRequired,
    hideSuggestions: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired,
    updateKeyword: PropTypes.func.isRequired,
    isSuggestionsActive: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    context: {},
    auth: {},
    login: () => {},
    logout: () => {},
    showSuggestions: () => {},
    hideSuggestions: () => {},
    fetchSuggestions: () => {},
    clearSuggestions: () => {},
    updateKeyword: () => {},
    isSuggestionsActive: false,
  };

  componentDidMount() {
    if (window.$) {
      window.$(`#${classes.moreActivator}`).dropdown();
    }
  }

  handleSearch = (keyword) => {
    this.context.router.push(`/search/${keyword}`);
  };

  render() {
    const {
      updateKeyword,
      fetchSuggestions,
      clearSuggestions,
      showSuggestions,
      hideSuggestions,
      context,
      auth,
      logout,
    } = this.props;
    const displayName = auth.creds && auth.creds.display_name ? auth.creds.display_name : 'Anonymouse';
    const accessToken = auth.creds && auth.creds.access_token ? auth.creds.access_token : '';
    const token = Base64.encode(accessToken);
    return (
      <div className={classes.root}>
        <div className="navbar-fixed z-depth-2">
          <nav className="blue accent-3">
            <div className="nav-wrapper row">
              <ul>
                <li>
                  <a href="#"><i className="material-icons">menu</i></a>
                </li>
                <li className={classes.logo}>
                  <Link alt="Quickflix" title="Quickflix" to="/">
                    <img src={logo} />
                  </Link>
                </li>
                <li className={`col m7 ${classes.searchbar}`}>
                  <SearchBar
                    className="hide-on-med-and-down"
                    placeholder='Find Movies or TV Show...'
                    search={this.handleSearch}
                    keyword={context.keyword}
                    suggest={fetchSuggestions}
                    showSuggestions={showSuggestions}
                    hideSuggestions={hideSuggestions}
                    updateKeyword={updateKeyword}
                    clear={clearSuggestions}
                    isFetching={context.isFetching}
                  />
                  <SearchSuggestionList
                    suggestions={context.suggestions}
                    show={context.isSuggestionsActive}
                    keyword={context.keyword}
                    limit={3}
                  />
                </li>
              </ul>
              <ul className="right">
                <li><a id={classes.moreActivator} data-activates={classes.moreMenu} data-beloworigin="true">{displayName}<i className="material-icons right">arrow_drop_down</i></a></li>
              </ul>
            </div>
          </nav>
        </div>
        <ul id={classes.moreMenu} className='dropdown-content'>
          <li><a href={`https://id.hdviet.com/cap-nhat-thong-tin/?token=${token}`} target="_blank">Profile <i className="material-icons right">open_in_new</i></a></li>
          <li><a href={`https://id.hdviet.com/lich-su-giao-dich/?token=${token}`} target="_blank">Transactions <i className="material-icons right">open_in_new</i></a></li>
          <li><a href={`https://id.hdviet.com/doi-mat-khau/?token=${token}`} target="_blank">Password <i className="material-icons right">open_in_new</i></a></li>
          <li className="divider"></li>
          <li><a onClick={logout}>Logout</a></li>
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(TopNav);
