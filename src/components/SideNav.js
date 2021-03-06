import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import logo from './logo.png';
import styles from './SideNav.scss';

export default class SideNav extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  static defaultProps = {
    id: styles.defaultId
  }

  componentDidMount () {
    if (window.$) {
      window.$(`.${styles.mainmenu}`).collapsible();
    }
  }

  render () {
    const { id } = this.props;
    const tags = 'xu-huong|hanh-dong|co-trang|hinh-su-toi-pham|hai|tinh-cam|kinh-di|khoa-hoc-vien-tuong|vo-thuat|chien-tranh|than-thoai|hoat-hinh|anime|am-nhac|the-thao|tam-ly|au-my|trung-quoc|hong-kong|han-quoc|an-do|viet-nam|thai-lan|nuoc-khac'.split('|');
    const titles = 'Xu Hướng|Hành Động|Cổ Trang|Hình Sự Tội Phạm|Hài|Tình Cảm|Kinh Dị|Khoa Học Viễn Tưởng|Võ Thuật|Chiến Tranh|Thần Thoại|Hoạt Hình|Anime|Âm Nhạc|Thể Thao|Tâm Lý|Âu Mỹ|Trung Quốc|Hồng Kông|Hàn Quốc|Ấn Độ|Việt Nam|Thái Lan|Nước Khác'.split('|');
    const movieNodes = tags.map((tag, key) => (
      <li key={key}><Link to={`/movies/${tag}/1`}>{titles[key]}</Link></li>
    ));
    const serieNodes = tags.map((tag, key) => (
      <li key={key}><Link to={`/movies/${tag}/2`}>{titles[key]}</Link></li>
    ));
    return (
      <div id={id} className='side-nav'>
        <div className={styles.logo}>
          <Link to='/' className={styles.logolink}><img src={logo} /></Link>
        </div>
        <div className={styles.menuwrapper}>
          <ul className={`${styles.mainmenu}`} data-collapsible='accordion'>
            <li className='no-padding'>
              <Link to='/' className={styles.outerlink}><i className='material-icons'>home</i><strong>Trang Chủ</strong></Link>
            </li>
            <li className='no-padding'>
              <Link to='/movies/hot-trong-thang' className={styles.outerlink}><i className='material-icons'>star</i><strong>Hot Trong Tháng</strong></Link>
            </li>
            <li className='no-padding'>
              <a className='collapsible-header'><i className='material-icons'>movie</i><strong>Phim Lẻ</strong></a>
              <div className='collapsible-body'>
                <ul>
                  {movieNodes}
                </ul>
              </div>
            </li>
            <li className='no-padding'>
              <a className='collapsible-header'><i className='material-icons'>movie_filter</i><strong>Phim Bộ</strong></a>
              <div className='collapsible-body'>
                <ul>
                  {serieNodes}
                </ul>
              </div>
            </li>
            <li className='no-padding'>
              <Link to='/yeu-thich' className={styles.outerlink}><i className='material-icons'>favorite</i><strong>Phim Yêu Thích</strong></Link>
            </li>
            <li className='no-padding'>
              <Link to='/' className={styles.outerlink}><i className='material-icons'>help</i><strong>Trợ Giúp</strong></Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export class SideNavActivator extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    navId: PropTypes.string.isRequired,
    children: PropTypes.element,
    icon: PropTypes.string
  }

  static defaultProps = {
    id: styles.defaultActivatorId,
    navId: styles.defaultId,
    icon: 'menu'
  }

  componentDidMount () {
    const { id } = this.props;
    if (window.$) {
      window.$(`#${id}`).sideNav({
        closeOnClick: true
      });
    }
  }

  render () {
    const { id, navId, icon } = this.props;
    return (
      <a id={id} data-activates={navId}><i className='material-icons'>{icon}</i></a>
    );
  }
}
