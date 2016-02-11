import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classes from './AuthView.scss';
import { actions as authActions } from '../../redux/modules/auth';
import logo from './logo.png';

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export class AuthView extends React.Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    login: () => {},
    auth: {},
  };

  componentDidMount() {
    const { auth } = this.props;
    if (auth.isAuthenticated) {
      this.context.router.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;
    if (auth.isAuthenticated) {
      this.context.router.push('/');
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { login } = this.props;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    if (email.length > 0 && password.length > 0) {
      login(email, password);
    }
  };

  render() {
    const { auth } = this.props;
    const buttonText = auth.isFetching ? 'Logging in...' : 'Login';
    return (
      <div className={classes.root}>
        <div className="container">
          <div className="row">
            <div className="logo center-align">
              <img src={logo} width={150} />
            </div>
            <form action="post" onSubmit={this.onSubmit} className="card grey lighten-4 col m4 push-m4 s6 push-s3">
              <div className="row">
                <div className="input-field col m10 push-m1 s10 push-s1">
                </div>
              </div>
              <div className="row">
                <div className="input-field col m10 push-m1 s10 push-s1">
                  <input id="email" ref="email" type="email" className="validate" required aria-required="true" />
                  <label htmlFor="email" data-error="Invalid email address">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col m10 push-m1 s10 push-s1">
                  <input id="password" ref="password" type="password" className="validate" required aria-required="true" />
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col m10 push-m1 s10 push-s1">
                  <button className="btn waves-effect waves-light" type="submit" name="action">{buttonText}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, authActions)(AuthView);
