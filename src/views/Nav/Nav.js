import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Base64 } from 'js-base64';

import { actions as navActions } from '../../redux/modules/nav';
import { actions as authActions } from '../../redux/modules/auth';

import SideNav, { SideNavActivator } from 'components/SideNav';
import AppMenu, { AppMenuActivator } from 'components/AppMenu';
import SearchBar from 'components/SearchBar';
import BackButton from 'components/BackButton';
import ForwardButton from 'components/ForwardButton';
// import SearchSuggestionList from 'components/SearchSuggestionList'
import styles from './Nav.scss';
import logo from './logo.png';

const mapStateToProps = (state) => ({
  context: state.nav,
  auth: state.auth
});
const actions = {
  ...navActions,
  ...authActions
};
export class Nav extends React.Component {
  static propTypes = {
    context: PropTypes.object,
    auth: PropTypes.object,
    logout: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired,
    location: PropTypes.object,
    enableBackForward: PropTypes.bool
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    context: {},
    auth: {},
    logout: () => {},
    fetchSuggestions: () => {},
    clearSuggestions: () => {},
    enableBackForward: false
  };

  constructor (props) {
    super(props);
    this.state = {
      searching: false
    };
  }

  handleSearchBarClose = (focused) => {
    if (!focused && this.isNarrow()) {
      this.toggleSearchBar();
    }
  };

  handleSearch = (e, keyword) => {
    this.context.router.push(`/search/${keyword}`);
  };

  handleChange = (e, keyword) => {
    const { fetchSuggestions } = this.props;
    if (keyword.length >= 4) {
      fetchSuggestions(keyword);
    }
  }

  isNarrow () {
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    return deviceWidth < 600;
  }

  toggleSearchBar = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { searching } = this.state;
    this.setState({
      searching: !searching
    });
  };

  renderIf = (condition, Component) => {
    if (condition) {
      return Component;
    }
    return null;
  }

  render () {
    const {
      context,
      auth,
      logout,
      location,
      enableBackForward
    } = this.props;
    const { searching } = this.state;
    const accessToken = auth.creds && auth.creds.access_token ? auth.creds.access_token : '';
    const token = Base64.encode(accessToken);
    const isAuthenticated = auth.isAuthenticated;
    const moreButton = (
      <AppMenuActivator />
    );
    const next = location.pathname ? location.pathname : '/';
    const loginButton = (
      <Link to={`/auth?next=${next}`}><i className='material-icons'>assignment_ind</i></Link>
    );
    const { router } = this.context;

    // <SearchSuggestionList
    //   suggestions={context.suggestions}
    //   show={context.isSuggestionsActive}
    //   keyword={context.keyword}
    // />
    return (
      <div className={styles.root}>
        <div className='navbar-fixed z-depth-2'>
          <nav className='red darken-3'>
            <div className='nav-wrapper row'>
              <ul>
                <li className={searching ? 'hide' : ''}>
                  <SideNavActivator />
                </li>
                <li className={searching ? 'hide' : styles.logo}>
                  <Link to='/'>
                    <img src={logo} />
                  </Link>
                </li>
                {this.renderIf(enableBackForward, (
                  <li className={searching ? 'hide' : `hide-on-small-only ${styles.back}`}>
                    <BackButton goBack={router.goBack} />
                  </li>
                ))}
                {this.renderIf(enableBackForward, (
                  <li className={searching ? 'hide' : `hide-on-small-only ${styles.forward}`}>
                    <ForwardButton goForward={router.goForward} />
                  </li>
                ))}
                <li className={searching ? styles.searchbar : `col s12 m7 hide-on-small-only ${styles.searchbar}`}>
                  <SearchBar
                    placeholder='Find Movies or TV Show...'
                    keyword={context.keyword}
                    processing={context.isFetching}
                    onSubmit={this.handleSearch}
                  />
                </li>
              </ul>
              <ul className='right'>
                <li className={searching ? 'hide' : 'hide-on-med-and-up'}>
                  <a className='searchOpen' onClick={this.toggleSearchBar}>
                    <i className='material-icons'>search</i>
                  </a>
                </li>
                <li className={searching ? 'hide' : ''}>
                  {isAuthenticated ? moreButton : loginButton}
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <AppMenu token={token} logout={logout} />
        <SideNav />
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(Nav);
