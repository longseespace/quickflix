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
    if (!auth || !auth.creds || !auth.creds.access_token) {
      const next = location.pathname ? location.pathname : '/'
      this.context.router.push(`/init?next=${next}`)
    }
  };
}
