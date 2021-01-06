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
      ],
      folderArray: [
        {
          title: 'General',
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
            {tab.label}&nbsp;
          </a>
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
    const parentCheckbox = folderArray[parentIndex];
    parentCheckbox.subData[childIndex].checkValue = !parentCheckbox.subData[childIndex].checkValue;
    for (let j = 0; j < parentCheckbox.subData.length; j++) {
      if (parentCheckbox.subData[j].checkValue === true) {
        countCheckedCheckbox++;
      } else {
        countCheckedCheckbox--;
      }
    }
    if (countCheckedCheckbox === parentCheckbox.subData.length) {
      parentCheckbox.checkValueStatus = true;
    } else {
      parentCheckbox.checkValueStatus = false;
    }
    this.setState({
      folderArray,
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
    const parentCheckbox = folderArray[index];
    const checked = e.target.checked;
    for (let j = 0; j < parentCheckbox.subData.length; j++) {
      parentCheckbox.subData[j].checkValue = checked;
      parentCheckbox.checkValueStatus = checked;
    }
    this.setState({
      folderArray,
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
              <div className="float-right">{subAttributeFolder}</div>
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

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
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
          <div className="analytics-manage-dashboard-container manage-dashboard-general">
            <div className="manage-dashboard-heading">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="d-block">
                    <ul className="nav nav-tabs">
                      {this.displayTabs()}
                      <li className="nav-item">
                        <a className="nav-link">
                          <i className="fa fa-plus"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <div className="filter-starred float-right">
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
              <div className="">
                <div className="left" style={{ width: '200px', display: 'inline-block', verticalAlign: 'top' }}>
                  dfsdfhk
                </div>
                <div className="right" style={{ width: '800px', display: 'inline-block', verticalAlign: 'top' }}>
                  <div className="manage-dashboard-search">
                    <div className="row">
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group search-control-group">
                          <form>
                            <input type="text" className="input-group-text" placeholder="Search dashboards by name" />
                            <button>
                              <i className="fa fa-search"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>{this.openCloseManageDashboardFolder()}</div>
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
