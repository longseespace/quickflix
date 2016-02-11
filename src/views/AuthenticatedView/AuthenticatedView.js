import React, { PropTypes } from 'react';

export default class AuthenticatedView extends React.Component {
  static propTypes = {
    auth: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    auth: {},
  };

  componentWillMount() {
    const { auth } = this.props;
    if (!auth.isAuthenticated) {
      this.context.router.push('/auth');
    }
  }
}
