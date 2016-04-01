import { Component, PropTypes } from 'react'

export default class Query extends Component {
  static propTypes = {
    keyword: PropTypes.string,
    filters: PropTypes.shape({
      isCinema: PropTypes.oneOf([0, 1]),
      tag: PropTypes.string,
      genre: PropTypes.string,
      imdb: PropTypes.string,
      year: PropTypes.string
    }),
    page: PropTypes.number,
    limit: PropTypes.number,
    type: PropTypes.oneOf(['search', 'filter', 'favorite']).isRequired
  }

  static defaultProps = {
    type: 'filter',
    keyword: '',
    filters: {},
    page: 1,
    limit: 24
  }
}
