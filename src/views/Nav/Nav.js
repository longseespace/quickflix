import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Base64 } from 'js-base64'

import { actions as navActions } from '../../redux/modules/nav'
import { actions as authActions } from '../../redux/modules/auth'

import SideNav, { SideNavActivator } from 'components/SideNav'
import AppMenu from 'components/AppMenu'
import SearchBar from 'components/SearchBar'
// import BackButton from 'components/BackButton'
// import ForwardButton from 'components/ForwardButton'
import SearchSuggestionList from 'components/SearchSuggestionList'
import styles from './Nav.scss'
import logo from './logo.png'

const mapStateToProps = (state) => ({
  context: state.nav,
  auth: state.auth
})
const actions = {
  ...navActions,
  ...authActions
}
export class Nav extends React.Component {
  static propTypes = {
    context: PropTypes.object,
    auth: PropTypes.object,
    logout: PropTypes.func.isRequired,
    showSuggestions: PropTypes.func.isRequired,
    hideSuggestions: PropTypes.func.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired,
    updateKeyword: PropTypes.func.isRequired,
    isSuggestionsActive: PropTypes.bool,
    location: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    context: {},
    auth: {},
    logout: () => {},
    showSuggestions: () => {},
    hideSuggestions: () => {},
    fetchSuggestions: () => {},
    clearSuggestions: () => {},
    updateKeyword: () => {},
    isSuggestionsActive: false
  };

  constructor (props) {
    super(props)
    this.state = {
      searching: false
    }
  }

  componentDidMount () {
    if (window.$) {
      window.$(`#${styles.moreActivator}`).dropdown()
    }
  }

  onSearchBarClose = (focused) => {
    if (!focused && this.isMobile()) {
      this.toggleSearchBar()
    }
  };

  handleSearch = (keyword) => {
    this.context.router.push(`/search/${keyword}`)
  };

  isMobile () {
    const deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width
    return deviceWidth < 600
  }

  toggleSearchBar = (e) => {
    if (e) {
      e.preventDefault()
    }
    const { searching } = this.state
    this.setState({
      searching: !searching
    })
  };

  render () {
    const {
      updateKeyword,
      fetchSuggestions,
      showSuggestions,
      hideSuggestions,
      clearSuggestions,
      context,
      auth,
      logout,
      location
    } = this.props
    const { searching } = this.state
    const accessToken = auth.creds && auth.creds.access_token ? auth.creds.access_token : ''
    const token = Base64.encode(accessToken)
    const isAuthenticated = auth.isAuthenticated
    const moreButton = (
      <a
        id={styles.moreActivator}
        data-activates={styles.moreMenu}
        data-beloworigin='true'
        data-constrainwidth='false'
      >
        <i className='material-icons'>more_vert</i>
      </a>
    )
    const next = location.pathname ? location.pathname : '/'
    const loginButton = (
      <Link to={`/auth?next=${next}`}><i className='material-icons'>assignment_ind</i></Link>
    )
    // const { router } = this.context
    // <li className={searching ? 'hide' : `hide-on-small-only ${styles.back}`}>
    //   <BackButton goBack={router.goBack} />
    // </li>
    // <li className={searching ? 'hide' : `hide-on-small-only ${styles.forward}`}>
    //   <ForwardButton goForward={router.goForward} />
    // </li>
    return (
      <div className={styles.root}>
        <div className='navbar-fixed z-depth-2'>
          <nav className='red darken-3'>
            <div className='nav-wrapper row'>
              <ul>
                <li className={searching ? 'hide' : ''}>
                  <SideNavActivator><i className='material-icons'>menu</i></SideNavActivator>
                </li>
                <li className={searching ? 'hide' : styles.logo}>
                  <Link to='/'>
                    <img src={logo} />
                  </Link>
                </li>
                <li className={searching ? styles.searchbar : `col s12 m7 hide-on-small-only ${styles.searchbar}`}>
                  <SearchBar
                    requestFocus={searching}
                    placeholder='Find Movies or TV Show...'
                    search={this.handleSearch}
                    keyword={context.keyword}
                    suggest={fetchSuggestions}
                    showSuggestions={showSuggestions}
                    hideSuggestions={hideSuggestions}
                    updateKeyword={updateKeyword}
                    clear={clearSuggestions}
                    isFetching={context.isFetching}
                    onClose={this.onSearchBarClose}
                  />
                  <SearchSuggestionList
                    suggestions={context.suggestions}
                    show={context.isSuggestionsActive}
                    keyword={context.keyword}
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
        <AppMenu id={styles.moreMenu} token={token} logout={logout} />
        <SideNav />
      </div>
    )
  }
}

export default connect(mapStateToProps, actions)(Nav)
