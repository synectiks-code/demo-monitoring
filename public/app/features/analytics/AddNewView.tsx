// Libraries
import React from 'react';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import { Collapse } from 'reactstrap';
import { getLocationSrv } from '@grafana/runtime';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { backendSrv } from 'app/core/services/backend_srv';
import { getTagColorsFromName } from '@grafana/ui';

// Services & Utils

export interface Props {
  $scope: any;
  $injector: any;
}

class AddNewTab extends React.Component<any, any> {
  breadCrumbs: any = [
    {
      label: 'Home',
      route: '',
    },
    {
      label: 'Analytics | View',
      isCurrentPage: true,
    },
  ];
  constructor(props: Props) {
    super(props);
    this.state = {
      tabs: [
        {
          label: 'New Tab',
          isEdit: false,
          dashboardList: [],
        },
      ],
      folderArray: [],
      activeTab: 0,
      isPreviewEnabled: false,
      selectedDashboards: [],
    };
  }

  componentDidMount() {
    backendSrv.search({}).then((result: any) => {
      const retData = this.manipulateData(result);
      const { tabs, activeTab } = this.state;
      if (tabs[activeTab]) {
        tabs[activeTab].dashboardList = JSON.parse(JSON.stringify(retData));
      }
      this.setState({
        folderArray: JSON.parse(JSON.stringify(retData)),
        tabs,
      });
    });
  }

  manipulateData(result: any) {
    const retData: any = {};
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
    }
    let keys = Object.keys(retData);
    let folders: any = [];
    for (let i = 0; i < keys.length; i++) {
      folders.push(retData[keys[i]]);
    }
    return folders;
  }

  editTabTitle = (index: any) => {
    const { tabs } = this.state;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].isEdit = true;
        console.log(tabs[i].isEdit);
      }
    }
    this.setState({
      tabs,
    });
  };

  handleStateChange = (e: any, index: any) => {
    const { tabs } = this.state;
    const { value } = e.target;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].label = value;
      }
    }
    this.setState({
      tabs,
    });
  };

  displayTabs = () => {
    const { tabs, activeTab } = this.state;
    const retData = [];
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      retData.push(
        <li key={`tab-${i}`} className={`nav-item `}>
          <a className={i === activeTab ? 'nav-link active' : 'nav-link'}>
            {!tab.isEdit && <span onClick={e => this.navigateTab(i)}>{tab.label}</span>}
            {!tab.isEdit && <i className="fa fa-angle-down" id={`PopoverFocus-${i}`}></i>}
            {tab.isEdit && (
              <input
                type="text"
                className="form-control tab-edit"
                value={tab.label}
                name="title"
                onChange={e => this.handleStateChange(e, i)}
                onBlur={() => this.onFocusOutTitle(i)}
              />
            )}
          </a>
          {!tab.isEdit && (
            <UncontrolledPopover trigger="legacy" className="popup-btn" placement="bottom" target={`PopoverFocus-${i}`}>
              <PopoverBody>
                <ul>
                  <li onClick={() => this.editTabTitle(i)}>
                    <a href="#">
                      <i className="fa fa-edit"></i>
                      Rename Tab
                    </a>
                  </li>
                  {i !== tabs.length - 1 && (
                    <li onClick={() => this.moveArrayPosition(i, i + 1)}>
                      <a href="#">
                        <i className="fa fa-caret-right"></i>
                        Move Right
                      </a>
                    </li>
                  )}
                  {i !== 0 && (
                    <li onClick={() => this.moveArrayPosition(i, i - 1)}>
                      <a href="#">
                        <i className="fa fa-caret-left"></i>
                        Move Left
                      </a>
                    </li>
                  )}
                  <li onClick={() => this.deleteTabData(i)}>
                    <a href="#">
                      <i className="fa fa-trash"></i>
                      Delete
                    </a>
                  </li>
                </ul>
              </PopoverBody>
            </UncontrolledPopover>
          )}
        </li>
      );
    }
    return retData;
  };

  moveArrayPosition = (fromIndex: any, toIndex: any) => {
    const { tabs } = this.state;
    var element = tabs[fromIndex];
    tabs.splice(fromIndex, 1);
    tabs.splice(toIndex, 0, element);
    this.setState({
      tabs,
    });
  };

  onFocusOutTitle = (index: any) => {
    const { tabs } = this.state;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].isEdit = false;
      }
    }
    this.setState({
      tabs,
    });
  };

  deleteTabData = (index: any) => {
    const { tabs } = this.state;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs.splice(i, 1);
      }
    }
    this.setState({
      tabs,
    });
  };

  navigateTab(index: any) {
    this.setState({
      activeTab: index,
    });
  }

  addTab = () => {
    const { tabs, folderArray } = this.state;
    const length = tabs.length;
    tabs.push({
      label: 'New Tab' + ' ' + (length + 1),
      isEdit: false,
      dashboardList: JSON.parse(JSON.stringify(folderArray)),
    });
    this.setState({
      tabs,
      activeTab: length,
      isPreviewEnabled: false,
    });
    this.checkForEnabled(tabs);
  };

  onClickChildCheckbox = (parentIndex: any, childIndex: any) => {
    let countCheckedCheckbox = 0;
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
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
      this.checkForEnabled(tabs);
      this.setState({
        tabs,
      });
    }
  };

  onClickOpenSubFolder = (index: any) => {
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
      dashboardList[index].openSubFolder = !dashboardList[index].openSubFolder;
      this.setState({
        tabs,
      });
    }
  };

  onChangeParentCheckbox = (e: any, index: any) => {
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
      const parentCheckbox = dashboardList[index];
      const checked = e.target.checked;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        parentCheckbox.subData[j].checkValue = checked;
        parentCheckbox.checkValueStatus = checked;
      }
      this.checkForEnabled(tabs);
      this.setState({
        tabs,
      });
    }
  };

  checkForEnabled = (tabs: any) => {
    let isPreviewEnabled = true;
    let selectedDashboards = [];
    for (let i = 0; i < tabs.length; i++) {
      const dashboardList = tabs[i].dashboardList;
      let isAnyDashboardSelected = false;
      let selectedDashboardsForTab = [];
      for (let j = 0; j < dashboardList.length; j++) {
        const subData = dashboardList[j].subData;
        for (let k = 0; k < subData.length; k++) {
          if (subData[k].checkValue) {
            isAnyDashboardSelected = true;
            selectedDashboardsForTab.push(subData[k].title);
          }
        }
      }
      isPreviewEnabled = isPreviewEnabled && isAnyDashboardSelected;
      selectedDashboards.push(selectedDashboardsForTab);
    }
    this.setState({
      isPreviewEnabled,
      selectedDashboards,
    });
  };

  renderDashboardTree = () => {
    const retData = [];
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
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

  sendData = () => {
    const { tabs } = this.state;
    localStorage.setItem('newdashboarddata', JSON.stringify(tabs));
    getLocationSrv().update({ path: '/analytics/new/dashboard' });
  };

  renderSelectedDashboardInLeftSide = () => {
    const { selectedDashboards, activeTab } = this.state;
    const retData = [];
    if (selectedDashboards[activeTab]) {
      const selectedDashboardsForTab = selectedDashboards[activeTab];
      for (let i = 0; i < selectedDashboardsForTab.length; i++) {
        retData.push(
          <li key={`left-side-dash-name-${i}`}>
            <a href="javascript: void(0)">
              <i className="fa fa-ellipsis-h"></i>
              <span>{selectedDashboardsForTab[i]}</span>
            </a>
          </li>
        );
      }
    }
    return retData;
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { isPreviewEnabled } = this.state;
    return (
      <React.Fragment>
        <CustomNavigationBar />
        <div className="scroll-canvas--dashboard monitor-main-body">
          <div className="breadcrumbs-container">
            {pageTitle && <div className="page-title">{pageTitle}</div>}
            <div className="breadcrumbs">
              {breadCrumbs.map((breadcrumb: any, index: any) => {
                if (breadcrumb.isCurrentPage) {
                  return (
                    <span key={index} className="current-page">
                      {breadcrumb.label}
                    </span>
                  );
                } else {
                  return (
                    <React.Fragment key={index}>
                      <a className="breadcrumbs-link">{breadcrumb.label}</a>
                      <span className="separator">
                        <i className="fa fa-chevron-right"></i>
                      </span>
                    </React.Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="analytics-container">
            <div className="analytics-heading-container">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <h4 style={{ lineHeight: '36px' }}>NGINX</h4>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="d-block text-right">
                    <button
                      className="alert-white-button min-width-auto m-r-0"
                      onClick={() => getLocationSrv().update({ path: '/analytics' })}
                    >
                      <i className="fa fa-arrow-circle-left"></i>
                      &nbsp;&nbsp;Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="analytics-tabs-container">
              <ul className="nav nav-tabs">
                {this.displayTabs()}
                <li className="nav-item" onClick={this.addTab}>
                  <a className="nav-link add-tab">
                    <i className="fa fa-plus"></i>
                  </a>
                </li>
              </ul>
              <div className="analytics-tabs-section-container">
                <div className="tabs-left-section">
                  <h5>New Tab</h5>
                  <ul>{this.renderSelectedDashboardInLeftSide()}</ul>
                </div>
                <div className="tabs-right-section">
                  <div className="manage-dashboard-search">
                    <div className="row">
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group search-control-group">
                          <form>
                            <input type="text" className="input-group-text" placeholder="Search dashboards by name" />
                            <button>
                              <i className="fa fa-search"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
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
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                        <div className="sort-checkbox">
                          <input type="checkbox" className="checkbox" />
                          <span>Filter by starred</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                        <div className="sort-select-menu">
                          <span>
                            <img src="/public/img/sort.png" alt="" />
                          </span>
                          <select>
                            <option>Sort (Default A-Z)</option>
                            <option>Sort (Default A-Z)</option>
                            <option>Sort (Default A-Z)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="manage-dashboard-general">{this.renderDashboardTree()}</div>
                  {isPreviewEnabled && (
                    <div className="text-right">
                      <button className="alert-blue-button" onClick={this.sendData}>
                        Preview
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddNewTab;
