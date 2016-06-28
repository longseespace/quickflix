import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import { actions as authActions } from '../../redux/modules/auth';

import RaisedButton from 'components/RaisedButton';
import logo from './logo.png';
import styles from './AuthView.scss';

const mapStateToProps = (state) => ({
  auth: state.auth
});
export class AuthView extends React.Component {

  static propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object,
    location: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    login: () => {},
    auth: {}
  };

  componentDidMount () {
    this.redirectIfAuthenticated(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.redirectIfAuthenticated(nextProps);
  }

  redirectIfAuthenticated = (props) => {
    const { auth, location } = props;
    const next = location.query.next ? location.query.next : '/';
    if (auth.isAuthenticated) {
      this.context.router.push(next);
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { login } = this.props;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const key = this.refs.key ? this.refs.key.value : false;
    const captcha = this.refs.captcha ? this.refs.captcha.value : false;
    if (email.length > 0 && password.length > 0) {
      login(email, password, key, captcha);
    }
  };

  render () {
    const { auth } = this.props;
    const buttonText = auth.isFetching ? 'Logging in...' : 'Login';

    let errorMessage;
    let passwordClassName = 'validate';
    if (auth.hasError && auth.error && auth.error.error === 25) {
      passwordClassName = 'validate invalid';
      errorMessage = 'Invalid password';
    }

    let captchaNode;
    if (auth.error.error === 27) {
      errorMessage = 'Invalid captcha';
      captchaNode = (
        <div className='row'>
          <div className={`input-field col m10 push-m1 s10 push-s1 ${styles.captcha}`}>
            <input type='hidden' ref='key' value={auth.error.data.key} />
            <input id='captcha' ref='captcha' type='text' className='validate invalid' required aria-required='true' />
            <label htmlFor='captcha'>Captcha</label>
            <img src={`https://id.hdviet.com/${auth.error.data.img_url}`} />
          </div>
        </div>
      );
    }
    return (
      <DocumentTitle title='Quickflix Login'>
        <div className={styles.root}>
          <div className='container'>
            <div className='row'>
              <div className='logo center-align'>
                <div id={styles.logo}>
                  <Link to='/' className={styles.logolink}><img src={logo} width={150} /></Link>
                </div>
              </div>
            </div>
            <div className='row'>
              <form action='post' onSubmit={this.onSubmit} className='card grey lighten-4 col m4 push-m4 s10 push-s1'>
                <div className='row'>
                  <div className='input-field col m10 push-m1 s10 push-s1'>
                    <span className={styles.error}>{errorMessage}</span>
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col m10 push-m1 s10 push-s1'>
                    <input id='email' ref='email' type='email' className='validate' required aria-required='true' />
                    <label htmlFor='email' data-error='Invalid email address'>Email</label>
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col m10 push-m1 s10 push-s1'>
                    <input
                      id='password'
                      ref='password'
                      type='password'
                      className={passwordClassName}
                      required
                      aria-required='true' />
                    <label htmlFor='password'>Password</label>
                  </div>
                </div>
                {captchaNode}
                <div className='row'>
                  <div className='input-field col m10 push-m1 s10 push-s1'>
                    <RaisedButton disabled={auth.isFetching} type='submit' name='action'>{buttonText}</RaisedButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToProps, authActions)(AuthView);
