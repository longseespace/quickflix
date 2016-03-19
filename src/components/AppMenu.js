import React, { Component, PropTypes } from 'react'
import styles from './AppMenu.scss'

export default class AppMenu extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired
  }

  static defaultProps = {
    id: styles.defaultId
  }

  render () {
    const { id, token, logout } = this.props
    return (
      <ul id={id} className='dropdown-content'>
        <li><a href={`https://id.hdviet.com/cap-nhat-thong-tin/?token=${token}`} target='_blank'>Profile</a></li>
        <li><a href={`https://id.hdviet.com/lich-su-giao-dich/?token=${token}`} target='_blank'>Transactions</a></li>
        <li><a href={`https://id.hdviet.com/doi-mat-khau/?token=${token}`} target='_blank'>Password</a></li>
        <li className='divider'></li>
        <li><a className='logout' onClick={logout}>Logout</a></li>
      </ul>
    )
  }
}

export class AppMenuActivator extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    menuId: PropTypes.string.isRequired,
    icon: PropTypes.string
  }

  static defaultProps = {
    menuId: styles.defaultId,
    id: styles.defaultActivatorId,
    icon: 'more_vert'
  }

  componentDidMount () {
    const { id } = this.props
    if (window.$) {
      window.$(`#${id}`).dropdown()
    }
  }

  render () {
    const { id, menuId, icon } = this.props
    return (
      <a
        id={id}
        data-activates={menuId}
        data-beloworigin='true'
        data-constrainwidth='false'
      >
        <i className='material-icons'>{icon}</i>
      </a>
    )
  }
}
