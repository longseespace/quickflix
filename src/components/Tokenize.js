import React, { Component, PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import Preloader from 'components/Preloader'

export default function Tokenize (View) {
  return class Tokenize extends Component {
    static propTypes = {
      getToken: PropTypes.func.isRequired,
      auth: PropTypes.object
    };

    static defaultProps = {
      auth: {}
    };

    componentWillReceiveProps (nextProps) {
      this.process(nextProps)
    }

    componentDidMount () {
      this.process(this.props)
    }

    hasValidToken (auth) {
      const hasCreds = !!(auth && auth.creds && auth.creds.access_token)
      const credsExpired = hasCreds && (Date.now()/1000 - auth.creds.last_login > 3*60*60)
      return hasCreds && !credsExpired
    }

    process = (props) => {
      const { auth, getToken } = props
      if (!auth || !this.hasValidToken(auth)) {
        getToken()
      }
    }

    render () {
      const { auth } = this.props
      if (this.hasValidToken(auth)) {
        return (
          <View {...this.props} {...this.state} />
        )
      } else {
        const centerInside = {
          background: 'rgba(255, 255, 255, 0.6)',
          position: 'fixed',
          zIndex: 999,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
        return (
          <DocumentTitle title='Initializing...'>
            <div>
              <div style={centerInside}>
                <Preloader />
              </div>
            </div>
          </DocumentTitle>
        )
      }
    }
  }
}
