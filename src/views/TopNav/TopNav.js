import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Base64 } from 'js-base64'

import { actions as topnavActions } from '../../redux/modules/topnav'
import { actions as authActions } from '../../redux/modules/auth'

import SearchBar from 'components/SearchBar'
import SearchSuggestionList from 'components/SearchSuggestionList'
import styles from './TopNav.scss'
import logo from './logo.png'

const mapStateToProps = (state) => ({
  context: state.topnav,
  auth: state.auth
})
const actions = {
  ...topnavActions,
  ...authActions
}
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
    isSuggestionsActive: PropTypes.bool
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
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
      window.$(`#${styles.moreActivatorMobile}`).dropdown()
      window.$(`#${styles.sidenavActivator}`).sideNav({
        closeOnClick: true
      })
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
      logout
    } = this.props
    const { searching } = this.state
    // const displayName = auth.creds && auth.creds.display_name ? auth.creds.display_name : 'Anonymous';
    const accessToken = auth.creds && auth.creds.access_token ? auth.creds.access_token : ''
    const token = Base64.encode(accessToken)
    const tags = 'xu-huong|hanh-dong|co-trang|hinh-su-toi-pham|hai|tinh-cam|kinh-di|khoa-hoc-vien-tuong|vo-thuat|chien-tranh|than-thoai|hoat-hinh|anime|am-nhac|the-thao|tam-ly|bat-ky|au-my|trung-quoc|hong-kong|han-quoc|an-do|viet-nam|thai-lan|nuoc-khac'.split('|')
    const titles = 'Xu Hướng|Hành Động|Cổ Trang|Hình Sự Tội Phạm|Hài|Tình Cảm|Kinh Dị|Khoa Học Viễn Tưởng|Võ Thuật|Chiến Tranh|Thần Thoại|Hoạt Hình|Anime|Âm Nhạc|Thể Thao|Tâm Lý|Bất Kỳ|Âu Mỹ|Trung Quốc|Hồng Kông|Hàn Quốc|Ấn Độ|Việt Nam|Thái Lan|Nước Khác'.split('|')
    const catNodes = tags.map((tag, key) => (
      <li key={key}><Link to={`/category/${tag}`}>{titles[key]}</Link></li>
    ))
    return (
      <div className={styles.root}>
        <div className='navbar-fixed z-depth-2'>
          <nav className='red darken-3'>
            <div className='nav-wrapper row'>
              <ul>
                <li className={searching ? 'hide' : ''}>
                  <a id={styles.sidenavActivator} data-activates={styles.sidenav}><i className='material-icons'>menu</i></a>
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
                  <a
                    id={styles.moreActivator}
                    data-activates={styles.moreMenu}
                    data-beloworigin='true'
                    data-constrainwidth='false'
                  >
                    <i className='material-icons'>more_vert</i>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <ul id={styles.moreMenu} className='dropdown-content'>
          <li><a href={`https://id.hdviet.com/cap-nhat-thong-tin/?token=${token}`} target='_blank'>Profile</a></li>
          <li><a href={`https://id.hdviet.com/lich-su-giao-dich/?token=${token}`} target='_blank'>Transactions</a></li>
          <li><a href={`https://id.hdviet.com/doi-mat-khau/?token=${token}`} target='_blank'>Password</a></li>
          <li className='divider'></li>
          <li><a onClick={logout}>Logout</a></li>
        </ul>
        <ul id={styles.sidenav} className='side-nav'>
          {catNodes}
        </ul>
      </div>
    )
  }
}

export default connect(mapStateToProps, actions)(TopNav)
