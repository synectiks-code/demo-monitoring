import * as React from 'react';
import { NewPlaylists } from './NewPlaylist';
import { EditPlaylists } from './EditPlaylist';
import { Button } from 'reactstrap';
import { getBackendSrv } from '@grafana/runtime';
import { ConfirmModal } from '@grafana/ui';

export class Playlists extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      openPlaylistComponent: false,
      playlistItems: [],
      visibleModal: false,
      deleteIndex: '',
      editData: {},
      openEditPlayListComponent: false,
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

  onclickEditCancel = () => {
    let editPlayList = !this.state.openEditPlayListComponent;
    this.getPlayListData();
    this.setState({
      openEditPlayListComponent: editPlayList,
    });
  };

  getPlayListData = () => {
    getBackendSrv()
      .get('/api/playlists')
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
          <div className="row" key={playlistItems[i]}>
            <div className="col-lg-7 col-md-7">
              <div className="playlist-name">{playlistItems[i].name}</div>
            </div>
            <div className="col-lg-5 col-md-5 text-right">
              <div className="playlist-select">
                <select>
                  <option>Start Playlist</option>
                  <option>Start Playlist</option>
                  <option>Start Playlist</option>
                </select>
              </div>
              <div className="playlist-buttons">
                <Button
                  className="dashboard-blue-button m-b-0 min-width-inherit"
                  onClick={() => this.openEditPlayList(playlistItems[i])}
                >
                  <i className="fa fa-edit"></i>
                </Button>
                <Button
                  className="dashboard-danger-button m-b-0 m-r-0 min-width-inherit"
                  onClick={() => this.toggleModal(playlistItems[i].id)}
                >
                  <i className="fa fa-close"></i>
                </Button>
              </div>
            </div>
          </div>
        );
      }
    }
    return retData;
  };

  deletePlaylist = () => {
    const { deleteIndex, visibleModal } = this.state;
    getBackendSrv()
      .delete(`/api/playlists/${deleteIndex}`)
      .then((res: any) => {
        this.setState({
          deleteIndex: '',
          visibleModal: !visibleModal,
        });
        this.getPlayListData();
      });
  };

  toggleModal = (index: any) => {
    const { visibleModal } = this.state;
    if (index) {
      this.setState({ deleteIndex: index });
    }
    this.setState({
      visibleModal: !visibleModal,
    });
  };

  openEditPlayList = (items: any) => {
    const { openEditPlayListComponent } = this.state;
    let playlist = !openEditPlayListComponent;
    this.setState({
      editData: items,
      openEditPlayListComponent: playlist,
    });
  };

  render() {
    const { openPlaylistComponent, playlistItems, visibleModal, openEditPlayListComponent, editData } = this.state;
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
        {playlistItems.length > 0 && !openEditPlayListComponent && (
          <div className="save-playlist-container">
            <div className="save-playlist-inner">
              <div className="d-block text-right">
                <Button onClick={this.openNewPlaylist} className="dashboard-blue-button m-r-0">
                  Create new Playlist
                </Button>
              </div>
              <div className="data-table">{this.displayPlayList()}</div>
            </div>
          </div>
        )}
        {openEditPlayListComponent === true && (
          <div>
            <EditPlaylists onClickCancel={this.onclickEditCancel} play_list_data={editData} />
          </div>
        )}
        <ConfirmModal
          isOpen={visibleModal}
          title="Delete"
          body="Are you sure you want to delete playlist ssss?"
          confirmText="Delete"
          onConfirm={this.deletePlaylist}
          onDismiss={() => this.toggleModal('')}
        />
      </div>
    );
  }
}
