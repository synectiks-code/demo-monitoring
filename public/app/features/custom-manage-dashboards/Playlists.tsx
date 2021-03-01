import * as React from 'react';
import { NewPlaylists } from './NewPlaylist';
import { Button } from 'reactstrap';

export class Playlists extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      openPlaylistComponent: false,
    };
  }

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
    this.setState({
      openPlaylistComponent: playlistDisplayData,
    });
  };

  render() {
    const { openPlaylistComponent } = this.state;
    return (
      <div className="playlists-container">
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
    );
  }
}
