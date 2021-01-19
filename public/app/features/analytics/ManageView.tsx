// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import CustomDashboardLoader from '../custom-dashboard-loader';
import { DeleteTabPopup } from './DeleteTabPopup';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { getLocationSrv } from '@grafana/runtime';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  Id?: string;
}

class ManageView extends React.Component<any, any> {
  openDeleteTabRef: any;
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
          label: 'AWS RDS',
          tabsSidebarContent: [
            {
              label: 'CPUUtilisation, CreditsUsage, CreditBalance',
              slug: '',
              uid: 'dHDp4K-Gz',
            },
            {
              label: 'DatabaseConnections, Transaction Log Generation',
              slug: '',
              uid: '0u_c4F-Mz',
            },
            {
              label: 'ReadWrite Latency, IOPS, Network Receive/Transmit ThroughPut',
              slug: '',
              uid: '8LIhVK-Mk',
            },
            {
              label: 'StorageSpace, RAM, ReadWrite Throughput',
              slug: '',
              uid: 'dHDp4K-Gz',
            },
          ],
        },
        {
          label: 'AWS VPC',
          tabsSidebarContent: [
            {
              label: 'East-1-Logs-Accepts-1',
              slug: '',
              uid: '0u_c4F-Mz',
            },
            {
              label: 'East-1-Logs-Accepts-2',
              slug: '',
              uid: 'ZX9tVKaGz',
            },
            {
              label: 'East-1-Logs-Accepts-1',
              slug: '',
              uid: '8LIhVK-Mk',
            },
            {
              label: 'East-1-Logs-Accepts-2',
              slug: '',
              uid: 'dHDp4K-Gz',
            },
          ],
        },
        {
          label: 'AWS VPN',
          tabsSidebarContent: [
            {
              label: 'East-1-Logs-Accepts-1',
            },
            {
              label: 'DatabaseConnections, Transaction Log Generation',
            },
          ],
        },
      ],
      sideBarData: [
        {
          label: 'CPUUtilisation, CreditsUsage, CreditBalance',
          displayaction: false,
          slug: '',
          uid: 'dHDp4K-Gz',
        },
        {
          label: 'DatabaseConnections, Transaction Log Generation',
          displayaction: false,
          slug: '',
          uid: '0u_c4F-Mz',
        },
        {
          label: 'ReadWrite Latency, IOPS, Network Receive/Transmit ThroughPut',
          displayaction: false,
          slug: '',
          uid: '8LIhVK-Mk',
        },
        {
          label: 'StorageSpace, RAM, ReadWrite Throughput',
          displayaction: false,
          slug: '',
          uid: 'dHDp4K-Gz',
        },
      ],
      activeTab: 0,
      activeSidebar: 0,
      selectedData: { label: 'CPUUtilisation, CreditsUsage, CreditBalance' },
      activeTabData: { label: 'AWS RDS' },
      deletedId: 0,
    };
    this.openDeleteTabRef = React.createRef();
  }

  displayTabs = () => {
    const { tabs, activeTab } = this.state;
    const retData = [];
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      retData.push(
        <li key={`tab-${i}`} className={`nav-item `}>
          <a className={i === activeTab ? 'nav-link active' : 'nav-link'} onClick={e => this.navigateTab(i, tab)}>
            {tab.label}&nbsp; <i className="fa fa-angle-down"></i>
          </a>
        </li>
      );
    }
    return retData;
  };

  navigateTab(index: any, data: any) {
    const { tabs } = this.state;
    this.setState({
      sideBarData: [],
      activeTab: index,
      activeTabData: data,
      activeSidebar: 0,
    });
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      if (i === index && tab.tabsSidebarContent) {
        let data = {};
        for (let j = 0; j < tab.tabsSidebarContent.length; j++) {
          if (j === 0) {
            data = tab.tabsSidebarContent[j];
          }
        }
        this.setState({
          sideBarData: tab.tabsSidebarContent,
          selectedData: data,
        });
      }
    }
  }

  addTab = () => {
    const { tabs } = this.state;
    const length = tabs.length;
    tabs.push({ label: 'Tab' + (length + 1) });
    this.setState({
      tabs,
      activeTab: length,
    });
  };

  deleteTabData = (data: any, index: any) => {
    this.setState({
      selectedData: data,
      deletedId: index,
    });
    this.openDeleteTabRef.current.toggle();
  };

  displayActiveTabSidebar = () => {
    const { sideBarData, activeSidebar } = this.state;
    let retData = [];
    for (let i = 0; i < sideBarData.length; i++) {
      let row = sideBarData[i];
      retData.push(
        <li>
          <a onClick={() => this.setDashboardContent(row, i)}>
            <span className={i === activeSidebar ? 'active' : ''}>{row.label}</span>
            <i className="fa fa-ellipsis-h" id={`PopoverFocus-${i}`}></i>
          </a>
          <UncontrolledPopover trigger="legacy" className="popup-btn" placement="bottom" target={`PopoverFocus-${i}`}>
            <PopoverBody>
              <ul>
                {i !== 0 && (
                  <li onClick={() => this.moveArrayPosition(i, i - 1)}>
                    <a href="#">
                      <i className="fa fa-caret-up"></i>
                      Move Up
                    </a>
                  </li>
                )}
                {i !== sideBarData.length - 1 && (
                  <li onClick={() => this.moveArrayPosition(i, i + 1)}>
                    <a href="#">
                      <i className="fa fa-caret-down"></i>
                      Move Down
                    </a>
                  </li>
                )}
                <li onClick={() => this.deleteTabData(row, i)}>
                  <a href="#">
                    <i className="fa fa-trash"></i>
                    Delete
                  </a>
                </li>
              </ul>
            </PopoverBody>
          </UncontrolledPopover>
        </li>
      );
    }
    return retData;
  };

  setDashboardContent = (content: any, index: any) => {
    this.setState({
      uid: content.uid,
      slug: content.slug,
      activeSidebar: index,
      selectedData: content,
    });
  };

  moveArrayPosition = (fromIndex: any, toIndex: any) => {
    const { sideBarData } = this.state;
    var element = sideBarData[fromIndex];
    sideBarData.splice(fromIndex, 1);
    sideBarData.splice(toIndex, 0, element);
    this.setState({
      sideBarData,
    });
  };

  createDashboard = () => {
    const { activeSidebar, sideBarData } = this.state;
    let retData = [];
    for (let i = 0; i < sideBarData.length; i++) {
      const dashboard = sideBarData[i];
      // if (dashboard.type === 'dash-db') {
      retData.push(
        <div>
          {activeSidebar === i && (
            <CustomDashboardLoader
              $scope={this.props.$scope}
              $injector={this.props.$injector}
              urlUid={dashboard.uid}
              urlSlug={dashboard.slug}
            />
          )}
        </div>
      );
      // }
    }
    return retData;
  };

  removeDashboardRecord = () => {
    const { deletedId, sideBarData } = this.state;
    for (let i = 0; i < sideBarData.length; i++) {
      if (i === deletedId) {
        sideBarData.splice(i, 1);
      }
    }
    this.setState({
      sideBarData,
    });
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { selectedData, activeTabData } = this.state;
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
                <li className="nav-item">
                  <a className="nav-link add-tab">
                    <i className="fa fa-plus"></i>
                  </a>
                </li>
              </ul>
              <div className="analytics-tabs-section-container">
                <div className="tabs-left-section">
                  <h5>AWS RDS</h5>
                  <ul>{this.displayActiveTabSidebar()}</ul>
                </div>
                <div className="tabs-right-section">
                  <div className="analytics-aws-heading">
                    <p>
                      {activeTabData.label} {'>'} {selectedData.label}
                    </p>
                  </div>
                  <div>{this.createDashboard()}</div>
                </div>
              </div>
            </div>
          </div>
          <DeleteTabPopup
            ref={this.openDeleteTabRef}
            deleteContent={selectedData}
            deleteDataFromSidebar={this.removeDashboardRecord}
          />
        </div>
      </React.Fragment>
    );
  }
}

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);
