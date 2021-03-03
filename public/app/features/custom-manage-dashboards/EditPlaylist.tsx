import * as React from 'react';
import { Button } from 'reactstrap';
import { config } from '../config';
import { backendSrv } from 'app/core/services/backend_srv';
import { getBackendSrv } from '@grafana/runtime';

export class EditPlaylists extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      playListName: this.props.play_list_data.name,
      createListOpen: true,
      dashboardList: [],
      duplicatePlayListData: [],
      createdPlayList: [],
      Interval: this.props.play_list_data.interval,
    };
  }

  handleStateChange = (e: any) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  componentDidMount() {
    const sendData = {
      type: 'dash-db',
      limit: 20,
      starred: false,
    };
    const edit_id = this.props.play_list_data.id;
    Promise.all([backendSrv.search(sendData), getBackendSrv().get(`api/playlists/${edit_id}`)]).then(
      ([dashboardListData, playlist]) => {
        let dashboardList = JSON.parse(JSON.stringify(dashboardListData));
        let createdPlayList = playlist.items;
        let retObj = this.mergeData(dashboardList, createdPlayList);
        createdPlayList = retObj.itemList;
        dashboardList = retObj.dashboardList;
        this.setState({
          dashboardList: dashboardList,
          duplicatePlayListData: JSON.parse(JSON.stringify(dashboardListData)),
          createdPlayList,
        });
      }
    );
  }

  mergeData = (dashboardList: any, itemList: any) => {
    for (let i = 0; i < itemList.length; i++) {
      for (let j = 0; j < dashboardList.length; j++) {
        if (parseInt(dashboardList[j].id, 10) === parseInt(itemList[i].value, 10)) {
          dashboardList.splice(j, 1);
          itemList[i].id = parseInt(itemList[i].value, 10);
          break;
        }
      }
    }
    return {
      dashboardList,
      itemList,
    };
  };

  displayTablePlaylist() {
    const { dashboardList } = this.state;
    let retData = [];
    for (let i = 0; i < dashboardList.length; i++) {
      retData.push(
        <tr>
          <td>
            <input
              type="checkbox"
              onClick={e => {
                this.onPlayListChecked(e, i);
              }}
              className="checkbox"
              checked={dashboardList[i].isChecked}
            />
            {dashboardList[i].title}
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
    const { dashboardList } = this.state;
    dashboardList[index].isChecked = e.target.checked;
    this.setState({
      dashboardList,
    });
  };

  displayNewPlayListData() {
    const { createdPlayList } = this.state;
    let newretData = [];
    if (createdPlayList && createdPlayList.length > 0) {
      for (let i = 0; i < createdPlayList.length; i++) {
        newretData.push(
          <tr>
            <td>{createdPlayList[i].title}</td>
            <td>
              <div className="float-right">
                <span
                  onClick={() => this.array_move(createdPlayList, i, i - 1)}
                  className={i === 0 ? 'down-arrow' : 'arrow-up-arrow'}
                ></span>
                <span
                  onClick={() => this.array_move(createdPlayList, i, i + 1)}
                  className={i !== 0 && i < createdPlayList.length - 1 ? 'down-arrow' : ''}
                ></span>
                <Button onClick={() => this.removePlayList(i)} className="close-arrow"></Button>
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
    const { createdPlayList, dashboardList } = this.state;
    if (dashboardList[index]) {
      createdPlayList.push(dashboardList[index]);
      dashboardList.splice(index, 1);
    }
    this.setState({
      dashboardList,
      createdPlayList,
    });
  };

  addMultipleDataToNewPlayList = () => {
    const { createdPlayList, dashboardList } = this.state;
    let result = createdPlayList;
    let playListData = [];
    for (let j = 0; j < dashboardList.length; j++) {
      if (dashboardList[j].isChecked) {
        createdPlayList.push({
          ...dashboardList[j],
          isChecked: false,
        });
      } else {
        playListData.push(dashboardList[j]);
      }
    }
    this.setState({
      dashboardList: playListData,
      createdPlayList: result,
    });
  };

  removePlayList = (index: any) => {
    const { createdPlayList, dashboardList } = this.state;
    dashboardList.push({
      ...createdPlayList[index],
    });
    createdPlayList.splice(index, 1);
    this.setState({
      dashboardList,
      createdPlayList,
    });
  };

  backToPlayListPage = () => {
    const { createListOpen, duplicatePlayListData } = this.state;
    this.setState({
      createListOpen: !createListOpen,
      createdPlayList: [],
      dashboardList: duplicatePlayListData,
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
      createdPlayList: arr,
    });
  }

  checkActiveButtonStatus() {
    let buttonStatus = false;
    for (let i = 0; i < this.state.dashboardList.length; i++) {
      if (this.state.dashboardList[i].isChecked) {
        buttonStatus = true;
      }
    }
    return buttonStatus;
  }

  createPlaylist = () => {
    const { createdPlayList, Interval, playListName } = this.state;
    let edit_id = this.props.play_list_data.id;
    for (let i = 0; i < createdPlayList.length; i++) {
      createdPlayList[i].value = createdPlayList[i].id.toString();
    }
    getBackendSrv()
      .put(`/api/playlists/${edit_id}`, {
        interval: Interval,
        items: createdPlayList,
        name: playListName,
        id: edit_id,
      })
      .then((result: any) => {
        this.onClickCancel();
      });
  };

  render() {
    const { createListOpen, createdPlayList, playListName, Interval } = this.state;
    const enabled = createdPlayList && createdPlayList.length > 0 && playListName !== '';
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
                  <Button disabled={!enabled} onClick={this.createPlaylist} className="dashboard-blue-button m-r-0">
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
              <input
                type="text"
                placeholder=""
                name="playListName"
                value={playListName}
                className="input-group-text"
                onChange={this.handleStateChange}
              />
            </div>
            <div className="playlist-interval-select">
              <label>Interval</label>
              <input
                type="text"
                placeholder=""
                name="Interval"
                value={Interval}
                className="input-group-text"
                onChange={this.handleStateChange}
              />
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
                      disabled={!this.checkActiveButtonStatus()}
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
