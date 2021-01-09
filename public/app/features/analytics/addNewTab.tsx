// Libraries
import React from 'react';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import { Collapse } from 'reactstrap';

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
        },
        {
          label: 'New Tab2',
        },
        {
          label: 'New Tab3',
        },
      ],
      folderArray: [
        {
          title: 'General',
          openSubFolder: true,
          checkValueStatus: false,
          subData: [
            {
              tableTitle: 'Amazon CloudWatch Logs',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'AWS',
                  backColorClass: 'aws-bg',
                },
                {
                  attributeName: 'Amazon',
                  backColorClass: 'amazon-bg',
                },
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Logs',
                  backColorClass: 'logs-bg',
                },
              ],
            },
            {
              tableTitle: 'Amazon RDS',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Monitoringartist',
                  backColorClass: 'aws-bg',
                },
              ],
            },
            {
              tableTitle: 'AWS VPN',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Monitoringartist',
                  backColorClass: 'aws-bg',
                },
              ],
            },
            {
              tableTitle: 'AWS VPN Dashboard',
              checkValue: false,
            },
            {
              tableTitle: 'Cloud Trial',
              checkValue: false,
            },
            {
              tableTitle: 'Cloud Watch',
              checkValue: false,
            },
          ],
        },
        {
          title: 'Main',
          openSubFolder: false,
          checkValueStatus: false,
          subData: [
            {
              tableTitle: 'Amazon CloudWatch Logs',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'AWS',
                  backColorClass: 'aws-bg',
                },
                {
                  attributeName: 'Amazon',
                  backColorClass: 'amazon-bg',
                },
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Logs',
                  backColorClass: 'logs-bg',
                },
              ],
            },
            {
              tableTitle: 'Amazon RDS',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Monitoringartist',
                  backColorClass: 'aws-bg',
                },
              ],
            },
            {
              tableTitle: 'AWS VPN',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Monitoringartist',
                  backColorClass: 'aws-bg',
                },
              ],
            },
            {
              tableTitle: 'AWS VPN Dashboard',
              checkValue: false,
            },
            {
              tableTitle: 'Cloud Trial',
              checkValue: false,
            },
            {
              tableTitle: 'Cloud Watch',
              checkValue: false,
            },
          ],
        },
        {
          title: 'Open',
          openSubFolder: false,
          checkValueStatus: false,
          subData: [
            {
              tableTitle: 'Amazon CloudWatch Logs',
              checkValue: false,
            },
            {
              tableTitle: 'Amazon RDS',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Monitoringartist',
                  backColorClass: 'aws-bg',
                },
              ],
            },
            {
              tableTitle: 'AWS VPN',
              checkValue: false,
              attribute: [
                {
                  attributeName: 'Cloud Watch',
                  backColorClass: 'cloudwatch-bg',
                },
                {
                  attributeName: 'Monitoringartist',
                  backColorClass: 'aws-bg',
                },
              ],
            },
            {
              tableTitle: 'AWS VPN Dashboard',
              checkValue: false,
            },
            {
              tableTitle: 'Cloud Trial',
              checkValue: false,
            },
            {
              tableTitle: 'Cloud Watch',
              checkValue: false,
            },
          ],
        },
      ],
      activeTab: 0,
      Enablepreview: false,
    };
  }

  displayTabs = () => {
    const { tabs, activeTab } = this.state;
    const retData = [];
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      retData.push(
        <li key={`tab-${i}`} className={`nav-item `}>
          <a className={i === activeTab ? 'nav-link active' : 'nav-link'} onClick={e => this.navigateTab(i)}>
            {tab.label}&nbsp; <i className="fa fa-angle-down"></i>
          </a>
          <ul>
            <li>
              <a href="#">
                <i className="fa fa-edit"></i>
                Rename Tab
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-caret-right"></i>
                Move Right
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-caret-left"></i>
                Move Left
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-trash"></i>
                Delete
              </a>
            </li>
          </ul>
        </li>
      );
    }
    return retData;
  };

  navigateTab(index: any) {
    this.setState({
      activeTab: index,
    });
  }

  addTab = () => {
    const { tabs } = this.state;
    const length = tabs.length;
    tabs.push({ label: 'New Tab' });
    this.setState({
      tabs,
      activeTab: length,
    });
  };

  onClickChildCheckbox = (parentIndex: any, childIndex: any) => {
    let countCheckedCheckbox = 0;
    const { folderArray } = this.state;
    let enable = false;
    const parentCheckbox = folderArray[parentIndex];
    parentCheckbox.subData[childIndex].checkValue = !parentCheckbox.subData[childIndex].checkValue;
    for (let j = 0; j < parentCheckbox.subData.length; j++) {
      if (parentCheckbox.subData[j].checkValue === true) {
        countCheckedCheckbox++;
        enable = true;
      } else {
        countCheckedCheckbox--;
      }
    }
    if (countCheckedCheckbox === parentCheckbox.subData.length) {
      parentCheckbox.checkValueStatus = true;
      enable = true;
    } else {
      parentCheckbox.checkValueStatus = false;
    }
    this.setState({
      folderArray,
      Enablepreview: enable,
    });
  };

  onClickOpenSubFolder = (index: any) => {
    const { folderArray } = this.state;
    folderArray[index].openSubFolder = !folderArray[index].openSubFolder;
    this.setState({
      folderArray: folderArray,
    });
  };

  onChangeParentCheckbox = (e: any, index: any) => {
    const { folderArray } = this.state;
    let enable = false;
    const parentCheckbox = folderArray[index];
    const checked = e.target.checked;
    for (let j = 0; j < parentCheckbox.subData.length; j++) {
      parentCheckbox.subData[j].checkValue = checked;
      parentCheckbox.checkValueStatus = checked;
      if (parentCheckbox.checkValueStatus === true || parentCheckbox.subData[j].checkValue === true) {
        enable = checked;
      }
    }
    this.setState({
      folderArray,
      Enablepreview: enable,
    });
  };

  openCloseManageDashboardFolder = () => {
    const retData = [];
    const { folderArray } = this.state;
    const length = folderArray.length;
    for (let i = 0; i < length; i++) {
      const folder = folderArray[i];
      const subFolders = folder.subData;
      const subFolderJSX = [];
      for (let j = 0; j < subFolders.length; j++) {
        const attribute = subFolders[j].attribute;
        const subAttributeFolder = [];
        if (subFolders[j].attribute) {
          for (let k = 0; k < attribute.length; k++) {
            const subAtt = attribute[k];
            subAttributeFolder.push(<div className={`${subAtt.backColorClass} tag`}>{subAtt.attributeName}</div>);
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
              <span>{subFolder.tableTitle}</span>
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
    return retData;
  };

  sendData = () => {
    let dashboardData = [];
    const { folderArray } = this.state;
    for (let i = 0; i < folderArray.length; i++) {
      let row = folderArray[i];
      if (row.checkValueStatus === true) {
        for (let j = 0; j < row.subData.length; j++) {
          row.subData[j].checkValue = false;
        }
        dashboardData.push({ label: row.title, tabsSidebarContent: row.subData });
      } else {
        let subData = [];
        for (let j = 0; j < row.subData.length; j++) {
          let subdata = row.subData[j];
          if (subdata.checkValue === true) {
            subdata.checkValue = false;
            subData.push(subdata);
          }
        }
        if (subData.length > 0) {
          dashboardData.push({ label: row.title, tabsSidebarContent: subData });
        }
      }
    }
    console.log(dashboardData);
    localStorage.setItem('newdashboarddata', JSON.stringify(dashboardData));
    window.location.assign(`/analytics/new/dashboard`);
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { Enablepreview } = this.state;
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
                    <button className="alert-white-button min-width-auto m-r-0">
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
                <li className="nav-item">
                  <a className="nav-link add-tab">
                    <i className="fa fa-plus"></i>
                  </a>
                </li>
              </ul>
              <div className="analytics-tabs-section-container">
                <div className="tabs-left-section">
                  <h5>New Tab</h5>
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fa fa-ellipsis-h"></i>
                        <span></span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-ellipsis-h"></i>
                        <span></span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-ellipsis-h"></i>
                        <span></span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="tabs-right-section">
                  <div className="manage-dashboard-search">
                    <div className="row">
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="form-group search-control-group">
                          <form>
                            <input type="text" className="input-group-text" placeholder="Search dashboards by name" />
                            <button>
                              <i className="fa fa-search"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
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
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="sort-checkbox">
                          <input type="checkbox" className="checkbox" />
                          <span>Filter by starred</span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
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
                  <div className="manage-dashboard-general">{this.openCloseManageDashboardFolder()}</div>
                  {Enablepreview === true && (
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
