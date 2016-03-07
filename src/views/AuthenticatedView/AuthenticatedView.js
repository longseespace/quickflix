import React, { PropTypes } from 'react'

export default class AuthenticatedView extends React.Component {
  static propTypes = {
    auth: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    auth: {}
  };

  componentWillMount () {
    this.redirectIfNotAuthenticated(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.redirectIfNotAuthenticated(nextProps)
  }

  redirectIfNotAuthenticated = (props) => {
    const { auth } = props
    if (!auth || !auth.creds || !auth.creds.access_token) {
      this.context.router.push('/init')
    }
  };
}
