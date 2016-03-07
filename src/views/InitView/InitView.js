import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { actions as authActions } from '../../redux/modules/auth'

import Preloader from 'components/Preloader'
// import TopNav from '../TopNav/TopNav'

import styles from './InitView.scss'

const mapStateToProps = (state) => ({
  auth: state.auth
})
export class InitView extends React.Component {
  static propTypes = {
    loginAnon: PropTypes.func.isRequired,
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    loginAnon: () => {},
    auth: {}
  };

  componentWillReceiveProps (nextProps) {
    const { auth } = nextProps
    if (auth && auth.creds && auth.creds.access_token && auth.creds.access_token.length > 0) {
      setTimeout(() => {
        this.context.router.push('/')
      }, 0)
    }
  }

  componentDidMount () {
    const { auth, loginAnon } = this.props
    if (auth && auth.creds && auth.creds.access_token && auth.creds.access_token.length > 0) {
      setTimeout(() => {
        this.context.router.push('/')
      }, 0)
    } else {
      loginAnon()
    }
  }

  render () {
    return (
      <DocumentTitle title='Initializing...'>
        <div className={styles.root}>
          <div className={styles.content}>
            <Preloader />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, authActions)(InitView)
