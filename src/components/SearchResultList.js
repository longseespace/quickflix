import React, { PropTypes } from 'react';

export default class SearchResultList extends React.Component {
  static propTypes = {
    searchResults: PropTypes.array,
  };

  static defaultProps = {
    searchResults: [],
  };

  render() {
    const { searchResults } = this.props;
    let items;
    if (searchResults.length > 0) {
      items = searchResults.map((item, key) => {
        return (
          <div key={key} className="col s3 m3">
            <div className="card hoverable">
              <div className="card-image">
                <img src={item.backdrop} />
                <span className="card-title">{item.name}</span>
              </div>
              <div className="card-content">
                <p>{item.summary}</p>
              </div>
              <div className="card-action">
                <a href="#">This is a link</a>
              </div>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="row">
        {items}
      </div>
    );
  }
}
