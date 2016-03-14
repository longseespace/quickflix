import React, { PropTypes } from 'react'

export default class AuthenticatedView extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
    location: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    auth: {},
    location: {}
  };

  componentWillMount () {
    this.redirectIfNotAuthenticated(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.redirectIfNotAuthenticated(nextProps)
  }

  redirectIfNotAuthenticated = (props) => {
    const { auth, location } = props
    const hasCreds = auth && auth.creds && auth.creds.access_token
    const reauthRequired = hasCreds && (Date.now()/1000 - auth.creds.last_login > 3*60*60)
    if (!hasCreds || reauthRequired) {
      const next = location.pathname ? location.pathname : '/'
      this.context.router.push(`/init?next=${next}`)
    }
  };
}
