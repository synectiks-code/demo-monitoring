import * as React from 'react';
import { NewPlaylists } from './NewPlaylist';
import { Button } from 'reactstrap';
import { getBackendSrv } from '@grafana/runtime';

export class Playlists extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      openPlaylistComponent: false,
      playlistItems: [],
    };
  }

  componentDidMount = () => {
    this.getPlayListData();
  };

  openNewPlaylist = () => {
    let playlistDisplayData = this.state.openPlaylistComponent;
    playlistDisplayData = !playlistDisplayData;
    this.setState({
      openPlaylistComponent: playlistDisplayData,
    });
  };
  onClickCancel = () => {
    let playlistDisplayData = this.state.openPlaylistComponent;
    playlistDisplayData = !playlistDisplayData;
    this.getPlayListData();
    this.setState({
      openPlaylistComponent: playlistDisplayData,
    });
  };

  getPlayListData = () => {
    getBackendSrv()
      .get('/api/playlists/')
      .then((result: any) => {
        this.setState({
          playlistItems: result,
        });
      });
  };

  displayPlayList = () => {
    const { playlistItems } = this.state;
    let retData = [];
    if (playlistItems.length > 0) {
      for (let i = 0; i < playlistItems.length; i++) {
        retData.push(
          <tr>
            <td>{playlistItems[i].name}</td>
            <td>
              <div className="float-right">
                <select>
                  <option>Start Playlist</option>
                  <option>Start Playlist</option>
                  <option>Start Playlist</option>
                </select>
                <Button className="dashboard-blue-button m-b-0 m-r-0 min-width-inherit">
                  <i className="fa fa-close"></i>
                </Button>
              </div>
            </td>
          </tr>
        );
      }
    }
    return retData;
  };

  render() {
    const { openPlaylistComponent, playlistItems } = this.state;
    return (
      <div className="playlists-container">
        {playlistItems.length === 0 && (
          <div>
            {openPlaylistComponent === false && (
              <div className="playlist-inner">
                <div className="playlist-heading">There are no playlist created yet</div>
                <div className="playlist-btn">
                  <Button onClick={this.openNewPlaylist} className="dashboard-blue-button">
                    Create new Playlist
                  </Button>
                </div>
                <div className="playlist-text">
                  <p>Tip: You can use playlists to cycle dashboards on TVs without user control Learn more</p>
                </div>
              </div>
            )}
            {openPlaylistComponent === true && (
              <div>
                <NewPlaylists onClickCancel={this.onClickCancel} />
              </div>
            )}
          </div>
        )}
        {playlistItems.length > 0 && (
          <div className="save-playlist-container">
            <div className="save-playlist-inner">
              <table className="data-table">{this.displayPlayList()}</table>
            </div>
          </div>
        )}
      </div>
    );
  }
}
