import * as React from 'react';
import { Collapse } from 'reactstrap';
//import { config } from './../config';
//import { RestService } from './_service/RestService';
import { UnimplementedFeaturePopup } from './components/UnimplementedFeaturePopup';
import { NewDashboard } from './NewDashboard';
import { getTagColorsFromName } from '@grafana/ui';
import { backendSrv } from 'app/core/services/backend_srv';
import { getLocationSrv } from '@grafana/runtime';

export class ManageTab extends React.Component<any, any> {
  unimplementedFeatureModalRef: any;
  tagsPromiseResolve: any;
  constructor(props: any) {
    super(props);
    this.state = {
      newDashboard: false,
      tags: [
        { term: 'tag', id: 1 },
        { term: 'tag', id: 2 },
      ],
      folderArray: [],
    };
    this.unimplementedFeatureModalRef = React.createRef();
  }
  componentDidMount() {
    let viewData: any = localStorage.getItem('viewData');
    if (viewData) {
      viewData = JSON.parse(viewData);
      this.setState({
        viewName: viewData.viewName,
        description: viewData.description,
      });
    } else {
      getLocationSrv().update({ path: '/analytics' });
      return;
    }
    const sendData = {
      tags: [],
    };
    this.getSearchData(sendData, true);
  }
  onClickUnImplementedFeature = (link: any) => {
    this.unimplementedFeatureModalRef.current.setLink(link);
    this.unimplementedFeatureModalRef.current.toggle();
  };
  openNewDashboard = () => {
    let page = !this.state.newDashboard;
    this.setState({
      newDashboard: page,
    });
  };
  manipulateData(result: any, isFirstTime: any) {
    const retData: any = {};
    let tagList = [];
    for (let i = 0; i < result.length; i++) {
      const dash = result[i];
      dash.checkValue = false;
      if (dash.type === 'dash-db') {
        retData[dash.folderId] = retData[dash.folderId] || { subData: [] };
        retData[dash.folderId].title = dash.folderTitle;
        retData[dash.folderId].folderId = dash.folderId;
        retData[dash.folderId].checkValueStatus = false;
        retData[dash.folderId].openSubFolder = false;
        retData[dash.folderId].subData.push(dash);
      }
      if (dash.tags.length > 0 && isFirstTime) {
        for (let i = 0; i < dash.tags.length; i++) {
          let row = dash.tags[i];
          tagList.push({
            term: row,
            count: i + 1,
          });
        }
      }
    }
    let keys = Object.keys(retData);
    let folders: any = [];
    for (let i = 0; i < keys.length; i++) {
      folders.push(retData[keys[i]]);
    }
    isFirstTime && this.tagsPromiseResolve && this.tagsPromiseResolve(tagList);
    return folders;
  }
  getSearchData = (data: any, isFirstTime: any) => {
    backendSrv.search(data).then((result: any) => {
      const retData = this.manipulateData(result, isFirstTime);
      const { folderArray } = this.state;
      if (folderArray) {
        folderArray.dashboardList = JSON.parse(JSON.stringify(retData));
      }
      if (isFirstTime) {
        this.setState({
          folderArray: JSON.parse(JSON.stringify(retData)),
        });
      }
      this.setState({
        folderArray,
      });
    });
  };
  onClickChildCheckbox = (parentIndex: any, childIndex: any) => {
    let countCheckedCheckbox = 0;
    const { folderArray } = this.state;
    if (folderArray) {
      const dashboardList = folderArray.dashboardList;
      const parentCheckbox = dashboardList[parentIndex];
      parentCheckbox.subData[childIndex].checkValue = !parentCheckbox.subData[childIndex].checkValue;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        if (parentCheckbox.subData[j].checkValue === true) {
          countCheckedCheckbox++;
        } else {
          countCheckedCheckbox--;
        }
      }
      parentCheckbox.checkValueStatus = countCheckedCheckbox === parentCheckbox.subData.length;
      //this.checkForEnabled(tabs);
      this.setState({
        folderArray,
      });
    }
  };
  onChangeParentCheckbox = (e: any, index: any) => {
    const { folderArray } = this.state;
    if (folderArray) {
      const dashboardList = folderArray.dashboardList;
      const parentCheckbox = dashboardList[index];
      const checked = e.target.checked;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        parentCheckbox.subData[j].checkValue = checked;
        parentCheckbox.checkValueStatus = checked;
      }
      //this.checkForEnabled(tabs);
      this.setState({
        folderArray,
      });
    }
  };
  onClickOpenSubFolder = (index: any) => {
    const { folderArray } = this.state;
    if (folderArray) {
      const dashboardList = folderArray.dashboardList;
      dashboardList[index].openSubFolder = !dashboardList[index].openSubFolder;
      this.setState({
        folderArray,
      });
    }
  };
  renderDashboardTree = () => {
    const retData = [];
    const { folderArray } = this.state;
    if (folderArray) {
      const dashboardList = folderArray;
      const length = dashboardList.length;
      for (let i = 0; i < length; i++) {
        const folder = dashboardList[i];
        const subFolders = folder.subData;
        const subFolderJSX = [];
        for (let j = 0; j < subFolders.length; j++) {
          const attribute = subFolders[j].tags;
          const subAttributeFolder = [];
          if (attribute) {
            for (let k = 0; k < attribute.length; k++) {
              const subAtt = attribute[k];
              const color = getTagColorsFromName(subAtt);
              subAttributeFolder.push(
                <div className={`tag`} style={{ backgroundColor: color.color }}>
                  {subAtt}
                </div>
              );
            }
          }
          const subFolder = subFolders[j];
          subFolderJSX.push(
            <tr>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={subFolder.checkValue}
                  onClick={() => this.onClickChildCheckbox(i, j)}
                />
                <span>{subFolder.title}</span>
              </td>
              <td>
                <div className="d-block text-right">{subAttributeFolder}</div>
              </td>
            </tr>
          );
        }
        retData.push(
          <div>
            <div className="general-heading">
              <input
                type="checkbox"
                checked={folder.checkValueStatus}
                onChange={e => this.onChangeParentCheckbox(e, i)}
                className="checkbox"
              />
              <span onClick={() => this.onClickOpenSubFolder(i)}>
                <img src="/public/img/open-folder.png" alt="" />
              </span>
              <h4>{folder.title}</h4>
            </div>
            <Collapse isOpen={folder.openSubFolder}>
              <div className="general-logs">
                <div className="general-logs-inner">
                  <table className="data-table">{subFolderJSX}</table>
                </div>
              </div>
            </Collapse>
          </div>
        );
      }
    }
    return retData;
  };
  render() {
    const { newDashboard } = this.state;
    return (
      <div>
        <div className="manage-dashboard-search">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="search-buttons float-right">
                <a className="dashboard-blue-button" onClick={this.openNewDashboard}>
                  New Dashboard
                </a>
                <a className="dashboard-blue-button m-r-0" onClick={() => this.onClickUnImplementedFeature('')}>
                  New Folder
                </a>
              </div>
            </div>
          </div>
        </div>
        {newDashboard === false && (
          <div className="manage-dashboard-fliter-sort">
            {/* <div className="manage-dashboard-general">{this.renderDashboardTree()}</div> */}
          </div>
        )}
        {newDashboard === false && <div className="manage-dashboard-general">{this.renderDashboardTree()}</div>}
        {newDashboard === true && (
          <div className="manage-newdashboard-general">
            <NewDashboard closenewDashboard={this.openNewDashboard} />
          </div>
        )}
        <UnimplementedFeaturePopup ref={this.unimplementedFeatureModalRef} />
      </div>
    );
  }
}
