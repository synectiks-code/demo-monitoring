// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import { DeleteTabPopup } from './DeleteTabPopup';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import CustomDashboardLoader from '../custom-dashboard-loader';
import { config } from '../config';
import { getLocationSrv } from '@grafana/runtime';
// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  Id?: string;
}

class ViewNewView extends React.Component<any, any> {
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
      tabs: [],
      sideBarData: [],
      activeTab: 0,
      selectedData: {},
      deletedId: 0,
      activeSidebar: 0,
    };
    this.openDeleteTabRef = React.createRef();
  }

  componentDidMount = () => {
    const { activeTab } = this.state;
    let data: any;
    let arryData: any;
    let selectedLabel = {};
    data = localStorage.getItem('newdashboarddata');
    arryData = JSON.parse(data);
    let sidebar = [];
    for (let i = 0; i < arryData.length; i++) {
      if (i === activeTab) {
        for (let j = 0; j < arryData[i].dashboardList.length; j++) {
          let row = arryData[i].dashboardList[j];
          for (let j = 0; j < row.subData.length; j++) {
            let sideData = row.subData[j];
            if (sideData.checkValue === true) {
              sidebar.push(sideData);
              selectedLabel = sideData;
            }
          }
        }
      }
    }
    this.setState({
      tabs: arryData,
      sideBarData: sidebar,
      selectedData: selectedLabel,
    });
  };

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
        </li>
      );
    }
    return retData;
  };

  navigateTab(index: any) {
    const { tabs } = this.state;
    let sidebar = [];
    this.setState({
      sideBarData: [],
      activeTab: index,
      activeSidebar: 0,
    });
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      if (i === index && tab.dashboardList) {
        for (let j = 0; j < tab.dashboardList.length; j++) {
          let tabData = tab.dashboardList[j];
          if (tabData.subData) {
            for (let k = 0; k < tabData.subData.length; k++) {
              let row = tabData.subData[k];
              if (row.checkValue === true) {
                sidebar.push(row);
              }
            }
          }
        }
      }
    }
    this.setState({
      sideBarData: sidebar,
    });
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

  displayAction = (index: any) => {
    const { sideBarData } = this.state;
    sideBarData[index].checkValue = !sideBarData[index].checkValue;
    this.setState({
      sideBarData,
    });
  };

  deleteTabData = (data: any, index: any) => {
    console.log(data);
    this.setState({
      selectedData: data,
      deletedId: index,
    });
    this.openDeleteTabRef.current.toggle();
  };

  setDashboardContent = (content: any, index: any) => {
    this.setState({
      uid: content.uid,
      slug: content.slug,
      activeSidebar: index,
      selectedData: content,
    });
  };

  displayActiveTabSidebar = () => {
    const { sideBarData, activeSidebar } = this.state;
    let retData = [];
    for (let i = 0; i < sideBarData.length; i++) {
      let sideData = sideBarData[i];
      retData.push(
        <li>
          <a>
            <span className={i === activeSidebar ? 'active' : ''} onClick={() => this.setDashboardContent(sideData, i)}>
              {sideData.title}
            </span>
            <i className="fa fa-ellipsis-h" id={`PopoverFocus-${i}`}></i>
          </a>
          <UncontrolledPopover trigger="legacy" placement="bottom" target={`PopoverFocus-${i}`}>
            <PopoverBody className="popup-btn">
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
                      <i className="fa fa-caret-down"></i>Move Down
                    </a>
                  </li>
                )}
                <li onClick={() => this.deleteTabData(sideData, i)}>
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
      if (dashboard.type === 'dash-db') {
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
      }
    }
    return retData;
  };

  saveDashboard = () => {
    const { selectedData } = this.state;
    let sendData = {
      data: selectedData,
    };
    let requestOptions: any = {
      method: `POST`,
      headers: {
        ...{ 'Content-Type': 'application/json;charset=UTF-8' },
      },
      body: JSON.stringify(sendData),
    };
    console.log(requestOptions);
    fetch(`${config.ADD_DASHBOARD}`, requestOptions)
      .then(response => response.json())
      .then((response: any) => {
        console.log(response);
      });
    getLocationSrv().update({ path: '/analytics' });
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { selectedData } = this.state;
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
                    <a>
                      <button className="analytics-blue-button" onClick={this.saveDashboard}>
                        Save and add to View list
                      </button>
                    </a>
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
                    <p>AWS RDS {'>'} CPUUtilisation, CreditsUsage, CreditBalance</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewNewView);
