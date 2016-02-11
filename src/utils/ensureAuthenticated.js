import React, { PropTypes } from 'react';

export default function ensureAuthenticated(Component) {
  return class AuthGuard extends React.Component {
    componentDidMount() {
      
    }

    render() {
      return (
        <Component {...this.props} {...this.state} />
      );
    }
  };
}
