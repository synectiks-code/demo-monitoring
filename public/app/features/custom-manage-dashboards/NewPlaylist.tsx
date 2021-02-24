import * as React from 'react';
import { Button } from 'reactstrap';
import { config } from '../config';

export class NewPlaylists extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      saveFileName: '',
      createListOpen: true,
      playListArrayData: [
        { label: 'Amazon CloudWatch Logs', id: 0, isChecked: false },
        { label: 'Amazon RDS', id: 1, isChecked: false },
        { label: 'AWS VPN', id: 2, isChecked: false },
        { label: 'AWS VPN Dashboard', id: 3, isChecked: false },
        { label: 'Cloud Trial', id: 4, isChecked: false },
        { label: ' Cloud Watch', id: 5, isChecked: false },
      ],
      duplicatePlayListData: [
        { label: 'Amazon CloudWatch Logs', id: 0, isChecked: false },
        { label: 'Amazon RDS', id: 1, isChecked: false },
        { label: 'AWS VPN', id: 2, isChecked: false },
        { label: 'AWS VPN Dashboard', id: 3, isChecked: false },
        { label: 'Cloud Trial', id: 4, isChecked: false },
        { label: ' Cloud Watch', id: 5, isChecked: false },
      ],
      multipleSelectData: [],
      newPlaylistArrayData: [],
    };
  }
  displayTablePlaylist() {
    const { playListArrayData } = this.state;
    let retData = [];
    for (let i = 0; i < playListArrayData.length; i++) {
      retData.push(
        <tr>
          <td>
            <input
              type="checkbox"
              onClick={e => {
                this.onPlayListChecked(e, i);
              }}
              className="checkbox"
              checked={playListArrayData[i].isChecked}
            />
            {playListArrayData[i].label}
          </td>
          <td>
            <Button className="dashboard-blue-button" onClick={() => this.addNewPlayList(i)}>
              <i className="fa fa-plus"></i>&nbsp;&nbsp; Add to List
            </Button>
          </td>
        </tr>
      );
    }
    return retData;
  }

  onPlayListChecked = (e: any, index: any) => {
    const { playListArrayData } = this.state;
    playListArrayData[index].isChecked = e.target.checked;
    this.setState({
      playListArrayData,
    });
  };

  displayNewPlayListData() {
    const { newPlaylistArrayData } = this.state;
    let newretData = [];
    if (newPlaylistArrayData && newPlaylistArrayData.length > 0) {
      for (let i = 0; i < newPlaylistArrayData.length; i++) {
        newretData.push(
          <tr>
            <td>
              <input type="checkbox" className="checkbox" />
              {newPlaylistArrayData[i].label}
            </td>
            <td>
              <div className="float-right">
                <span
                  onClick={() => this.array_move(newPlaylistArrayData, i, i - 1)}
                  className={i === 0 ? 'down-arrow' : 'arrow-up-arrow'}
                ></span>
                <span
                  onClick={() => this.array_move(newPlaylistArrayData, i, i + 1)}
                  className={i !== 0 && i < newPlaylistArrayData.length - 1 ? 'down-arrow' : ''}
                ></span>
                <Button onClick={() => this.removePlylistData(i)} className="close-arrow"></Button>
              </div>
            </td>
          </tr>
        );
      }
    } else {
      newretData.push(
        <tr className="add-aashboards-text">
          <td>
            <p>Add Dashboards from below list to your playlist</p>
          </td>
        </tr>
      );
    }
    return newretData;
  }

  addNewPlayList = (index: any) => {
    const { newPlaylistArrayData, playListArrayData } = this.state;
    let playlistData = newPlaylistArrayData;
    let saveFile = '';
    for (let i = 0; i < playListArrayData.length; i++) {
      if (i === index) {
        playlistData.push(this.state.playListArrayData[i]);
        playListArrayData.splice(index, 1);
      }
    }
    if (playlistData.length > 0) {
      saveFile = 'AWS Dashboards-Admin';
    } else {
      saveFile = '';
    }
    this.setState({
      playListArrayData: playListArrayData,
      newPlaylistArrayData: playlistData,
      saveFileName: saveFile,
    });
  };

  addMultipleDataToNewPlayList = () => {
    const { newPlaylistArrayData, playListArrayData } = this.state;
    let result = newPlaylistArrayData;
    let playListData = [];
    for (let j = 0; j < playListArrayData.length; j++) {
      if (playListArrayData[j].isChecked) {
        result.push({
          ...playListArrayData[j],
          isChecked: false,
        });
      } else {
        playListData.push(playListArrayData[j]);
      }
    }
    this.setState({
      playListArrayData: playListData,
      newPlaylistArrayData: result,
    });
  };

  removePlylistData = (index: any) => {
    const { newPlaylistArrayData, playListArrayData } = this.state;
    let listData = playListArrayData;
    let saveFile = '';
    for (let i = 0; i < newPlaylistArrayData.length; i++) {
      if (i === index) {
        listData.push(this.state.newPlaylistArrayData[i]);
        newPlaylistArrayData.splice(index, 1);
      }
    }
    if (newPlaylistArrayData.length > 0) {
      saveFile = 'AWS Dashboards-Admin';
    } else {
      saveFile = '';
    }
    this.setState({
      playListArrayData: listData,
      newPlaylistArrayData: newPlaylistArrayData,
      saveFileName: saveFile,
    });
  };

  backToPlayListPage = () => {
    const { createListOpen, duplicatePlayListData } = this.state;
    this.setState({
      createListOpen: !createListOpen,
      newPlaylistArrayData: [],
      playListArrayData: duplicatePlayListData,
      saveFileName: '',
    });
  };

  onClickCancel = () => {
    if (this.props.onClickCancel) {
      this.props.onClickCancel();
    }
  };

  array_move(arr: any, old_index: any, new_index: any) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    this.setState({
      newPlaylistArrayData: arr,
    });
  }
  checkActiveButtonStatus() {
    let buttonStatus = false;
    for (let i = 0; i < this.state.playListArrayData.length; i++) {
      if (this.state.playListArrayData[i].isChecked) {
        buttonStatus = true;
      }
    }
    return buttonStatus;
  }

  render() {
    const { createListOpen, newPlaylistArrayData } = this.state;
    const enabled = newPlaylistArrayData.length > 0;
    const allenabledButton = this.checkActiveButtonStatus();
    return (
      <div className="new-playlist-container">
        {createListOpen === true && (
          <div>
            <div className="row">
              <div className="col-lg-5 col-md-12 col-sm-12">
                <div className="new-playlist-heading">New Playlist</div>
              </div>
              <div className="col-lg-7 col-md-12 col-sm-12">
                <div className="float-right playlist">
                  <Button onClick={this.onClickCancel} className="dashboard-gray-button">
                    Cancel
                  </Button>
                  <Button
                    disabled={!enabled}
                    onClick={() => this.setState({ createListOpen: !createListOpen })}
                    className="dashboard-blue-button m-r-0"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className="playlist-text">
              <p>
                A playlist rotates through a pre-selected list of Dashboards. A Playlist can be a great way to build
                situational awareness, or just show off your metrics to your team or visitors.
              </p>
            </div>
            <div className="playlist-name-input">
              <label>Name</label>
              <input type="text" placeholder="" value={this.state.saveFileName} className="input-group-text" />
            </div>
            <div className="playlist-interval-select">
              <label>Interval</label>
              <select>
                <option>5 m</option>
                <option>10 m</option>
                <option>15 m</option>
                <option>20 m</option>
              </select>
            </div>
            <div className="add-dashboards-playlist">
              <label>Dashboards</label>
              <div className="add-dashboard">
                <div className="add-dashboard-playlist">
                  <table className="data-table">{this.displayNewPlayListData()}</table>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                <div className="add-dashboard-heading">Add Dashboards</div>
              </div>
              <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                <div className="filter-starred float-right">
                  <div className="addalltolist">
                    <Button
                      disabled={!allenabledButton}
                      onClick={() => this.addMultipleDataToNewPlayList()}
                      type="button"
                      className="dashboard-blue-button"
                    >
                      <i className="fa fa-plus"></i>
                      &nbsp;&nbsp; Add all to List
                    </Button>
                  </div>
                  <div className="sort-checkbox">
                    <input type="checkbox" className="checkbox" />
                    <span>Filter by starred</span>
                  </div>
                  <div className="sort-select-menu">
                    <span>
                      <img src="/public/img/tag.png" alt="" />
                    </span>
                    <select>
                      <option>Filter by tag</option>
                      <option>Filter by tag</option>
                      <option>Filter by tag</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="add-dashboard">
              <div className="add-dashboard-inner">
                <table className="data-table">{this.displayTablePlaylist()}</table>
              </div>
            </div>
          </div>
        )}
        {createListOpen === false && (
          <div>
            <div className="save-playlist">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="save-playlist-heading">Playlist</div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="float-right playlist">
                    <a href={config.PARENT_NAME}>
                      <Button onClick={() => this.backToPlayListPage()} className="dashboard-blue-button m-r-0">
                        Create new playlist
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
              <div className="save-playlist-container">
                <div className="save-playlist-inner">
                  <table className="data-table">
                    <tr>
                      <td>AWS Dashboards - Admin</td>
                      <td>
                        <div className="float-right">
                          <select>
                            <option>Start Playlist</option>
                            <option>Start Playlist</option>
                            <option>Start Playlist</option>
                          </select>
                          <Button onClick={() => this.backToPlayListPage()} className="close-arrow"></Button>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
