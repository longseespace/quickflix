import React, { PropTypes } from 'react'
import moment from 'moment'
import sanitize from 'sanitize-html'

import Preloader from 'components/Preloader'
import styles from './MovieDetailCard.scss'

export default class MovieDetailCard extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    show: PropTypes.bool,
    poster: PropTypes.string,
    plot: PropTypes.string,
    title: PropTypes.string,
    imdbRating: PropTypes.number,
    imdbVotes: PropTypes.number,
    knownAs: PropTypes.string,
    releaseDate: PropTypes.string,
    director: PropTypes.string,
    writer: PropTypes.string,
    cast: PropTypes.string,
    country: PropTypes.string,
    MPAA: PropTypes.string,
    quality: PropTypes.string,
    tag: PropTypes.string,
    status: PropTypes.oneOf(['init', 'loading', 'loaded'])
  };

  static defaultProps = {
    style: {},
    show: true,
    status: 'init'
  };

  renderIfTrue (condition, content) {
    if (condition) {
      return content
    } else {
      return
    }
  }

  render () {
    const { status } = this.props
    if (status !== 'loaded') {
      return (
        <div className='card'>
          <div className={`valign-wrapper ${styles.preloaderWrapper}`}>
            <div className={styles.preloader}>
              <Preloader show />
            </div>
          </div>
        </div>
      )
    }
    const {
      poster,
      plot,
      title,
      imdbRating,
      imdbVotes,
      knownAs,
      releaseDate,
      director,
      writer,
      cast,
      country,
      MPAA,
      quality,
      tag
    } = this.props
    const plotText = sanitize(plot, {
      allowedTags: [],
      allowedAttributes: []
    })
    const imdbVotesText = imdbVotes ? `(${imdbVotes} votes)` : ''
    const releaseDateText = moment(releaseDate).format('LL')
    return (
      <div>
        <div className='card'>
          <div className='card-content'>
            <div className='row'>
              <div className={`col s12 m4 ${styles.poster}`}>
                <img src={poster} />
              </div>
              <div className='col s12 m8'>
                <span className='card-title'>{title}</span>
                <p>{plotText}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='card'>
          <div className='card-content'>
            <div className='row'>
              <table>
                <tbody>
                  {this.renderIfTrue(imdbRating, (
                    <tr>
                      <td className={styles.label}>IMDB:</td>
                      <td>&nbsp;</td>
                      <td>{`${imdbRating} ${imdbVotesText}`}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(knownAs, (
                    <tr>
                      <td className={styles.label}>Known As:</td>
                      <td>&nbsp;</td>
                      <td>{knownAs}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(director, (
                    <tr>
                      <td className={styles.label}>Director:</td>
                      <td>&nbsp;</td>
                      <td>{director}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(writer, (
                    <tr>
                      <td className={styles.label}>Writer:</td>
                      <td>&nbsp;</td>
                      <td>{writer}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(cast, (
                    <tr>
                      <td className={styles.label}>Cast:</td>
                      <td>&nbsp;</td>
                      <td>{cast}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(releaseDate, (
                    <tr>
                      <td className={styles.label}>Release Date:</td>
                      <td>&nbsp;</td>
                      <td>{releaseDateText}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(country, (
                    <tr>
                      <td className={styles.label}>Country:</td>
                      <td>&nbsp;</td>
                      <td>{country}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(MPAA, (
                    <tr>
                      <td className={styles.label}>MPAA:</td>
                      <td>&nbsp;</td>
                      <td>{MPAA}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(quality, (
                    <tr>
                      <td className={styles.label}>Quality:</td>
                      <td>&nbsp;</td>
                      <td>{quality}</td>
                    </tr>
                  ))}
                  {this.renderIfTrue(tag, (
                    <tr>
                      <td className={styles.label}>Tag:</td>
                      <td>&nbsp;</td>
                      <td>{tag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
