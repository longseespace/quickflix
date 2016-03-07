import React, { Component, PropTypes } from 'react'

export default class AppMenu extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired
  }

  render () {
    const { id, token, logout } = this.props
    return (
      <ul id={id} className='dropdown-content'>
        <li><a href={`https://id.hdviet.com/cap-nhat-thong-tin/?token=${token}`} target='_blank'>Profile</a></li>
        <li><a href={`https://id.hdviet.com/lich-su-giao-dich/?token=${token}`} target='_blank'>Transactions</a></li>
        <li><a href={`https://id.hdviet.com/doi-mat-khau/?token=${token}`} target='_blank'>Password</a></li>
        <li className='divider'></li>
        <li><a onClick={logout}>Logout</a></li>
      </ul>
    )
  }
}
