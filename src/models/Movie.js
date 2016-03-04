import React, { PropTypes } from 'react'

export default class Movie extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    trailer: PropTypes.string,
    releaseDate: PropTypes.string,
    plot: PropTypes.string,
    director: PropTypes.string,
    poster: PropTypes.string,
    backdrop: PropTypes.string,
    bitrate: PropTypes.string,
    season: PropTypes.number,
    episode: PropTypes.number,
    sequence: PropTypes.number,
    imdbRating: PropTypes.number
  }

  static fromSearchResult (searchResult) {
    const base = new Movie()
    const movie = { ...base,
      id: +searchResult.id,
      name: {
        en: searchResult.mo_name,
        vi: searchResult.mo_known_as
      },
      releaseDate: searchResult.mo_release_date,
      plot: {
        vi: searchResult.mo_plot_vi,
        en: searchResult.mo_plot_en
      },
      director: searchResult.mo_director,
      imdbRating: +searchResult.mo_imdb_rating,
      poster: `http://t.hdviet.com/thumbs/124x184/${searchResult.mo_new_poster}`,
      backdrop: `http://t.hdviet.com/backdrops/945x530/${searchResult.mo_backdrop}`,
      bitrate: searchResult.mo_bit_rate,
      season: +searchResult.mo_season,
      isTVSerie: searchResult.mo_season > 0,
      episode: +searchResult.mo_episode,
      sequence: +searchResult.mo_sequence
    }

    return movie
  }

  static fromFilterResult (filterResult) {
    const base = new Movie()
    const movie = { ...base,
      id: filterResult.MovieID,
      name: {
        en: filterResult.MovieName,
        vi: filterResult.KnownAs
      },
      trailer: filterResult.Trailer,
      releaseDate: filterResult.ReleaseDate,
      plot: {
        vi: filterResult.PlotVI,
        en: filterResult.PlotEN
      },
      director: filterResult.Director,
      imdbRating: +filterResult.ImdbRating,
      poster: `http://t.hdviet.com/thumbs/124x184/${filterResult.NewPoster}`,
      backdrop: `http://t.hdviet.com/backdrops/945x530/${filterResult.Backdrop}`,
      bitrate: filterResult.BitRate,
      season: +filterResult.Season,
      isTVSerie: filterResult.Season > 0,
      episode: +filterResult.Episode,
      sequence: +filterResult.Sequence
    }

    return movie
  }
}
