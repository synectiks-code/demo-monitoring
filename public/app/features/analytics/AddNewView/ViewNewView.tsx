// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
// import { DeleteTabPopup } from '../DeleteTabPopup';
// import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import CustomDashboardLoader from '../../custom-dashboard-loader';
import { config } from '../../config';
import { getLocationSrv } from '@grafana/runtime';

interface Props {
  $scope: any;
  $injector: any;
  ref: any;
  hidedashboardView: any;
}

class ViewNewView extends React.Component<Props, any> {
  // openDeleteTabRef: any;
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
      activeSideTab: 0,
      deletedId: 0,
      activeSidebar: 0,
      loading: false,
      viewName: '',
      description: '',
    };
    // this.openDeleteTabRef = React.createRef();
  }

  setData = (tabs: any, viewData: any) => {
    const data = [];
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const dashboardList = tab.dashboardList;
      const selectedDashboards = [];
      for (let j = 0; j < dashboardList.length; j++) {
        let subData = dashboardList[j].subData;
        for (let k = 0; k < subData.length; k++) {
          if (subData[k].checkValue) {
            selectedDashboards.push(subData[k]);
          }
        }
      }
      data.push({
        label: tab.label,
        dashboards: selectedDashboards,
      });
    }
    this.setState({
      tabs: data,
      viewName: viewData.viewName,
      description: viewData.description,
    });
  };

  displayTabs = () => {
    const { tabs, activeTab } = this.state;
    const retData = [];
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      retData.push(
        <li key={`tab-${i}`} className={`nav-item `}>
          <a className={i === activeTab ? 'nav-link active' : 'nav-link'} onClick={e => this.setActiveTab(i)}>
            {tab.label}&nbsp;
          </a>
        </li>
      );
    }
    return retData;
  };

  setActiveTab(index: any) {
    this.setState({
      activeTab: index,
      activeSideTab: 0,
    });
  }

  // displayAction = (index: any) => {
  //   const { sideBarData } = this.state;
  //   sideBarData[index].checkValue = !sideBarData[index].checkValue;
  //   this.setState({
  //     sideBarData,
  //   });
  // };

  // deleteTabData = (data: any, index: any) => {
  //   console.log(data);
  //   this.setState({
  //     selectedData: data,
  //     deletedId: index,
  //   });
  //   this.openDeleteTabRef.current.toggle();
  // };

  setActiveSideTab = (index: any) => {
    this.setState({
      activeSideTab: index,
    });
  };

  renderSideBar = () => {
    const { activeTab, tabs, activeSideTab } = this.state;
    let retData = [];
    const sidebarData = tabs[activeTab];
    if (sidebarData) {
      const dashboards = sidebarData.dashboards;
      for (let i = 0; i < dashboards.length; i++) {
        let sideData = dashboards[i];
        retData.push(
          <li>
            <a>
              <span className={i === activeSideTab ? 'active' : ''} onClick={() => this.setActiveSideTab(i)}>
                {sideData.title}
              </span>
              <i className="fa fa-ellipsis-h" id={`PopoverFocus-${i}`}></i>
            </a>
            {/* <UncontrolledPopover trigger="legacy" placement="bottom" target={`PopoverFocus-${i}`}>
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
          </UncontrolledPopover> */}
          </li>
        );
      }
    }
    return retData;
  };

  // removeDashboardRecord = () => {
  //   const { deletedId, sideBarData } = this.state;
  //   for (let i = 0; i < sideBarData.length; i++) {
  //     if (i === deletedId) {
  //       sideBarData.splice(i, 1);
  //     }
  //   }
  //   this.setState({
  //     sideBarData,
  //   });
  // };

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
    const { activeTab, activeSideTab, tabs } = this.state;
    let retData = [];
    if (tabs[activeTab] && tabs[activeTab].dashboards && tabs[activeTab].dashboards.length > 0) {
      const dashboards = tabs[activeTab].dashboards;
      for (let j = 0; j < dashboards.length; j++) {
        const dashboard = dashboards[j];
        retData.push(
          <div key={dashboard.uid}>
            {activeSideTab === j && (
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
    const { tabs, viewName, description } = this.state;
    const formData = new FormData();
    formData.append('viewName', viewName);
    formData.append('description', description);
    formData.append('viewJson', JSON.stringify(tabs));
    let requestOptions: any = {
      method: `POST`,
      body: formData,
    };
    this.setState({
      loading: true,
    });
    fetch(`${config.ADD_ANALYTICS_VIEW}`, requestOptions).then((response: any) => {
      this.setState({
        loading: false,
      });
      getLocationSrv().update({ path: '/analytics' });
    });
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { loading } = this.state;
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
                      <button
                        className="analytics-white-button min-width-auto m-r-1"
                        onClick={() => this.props.hidedashboardView()}
                      >
                        <i className="fa fa-arrow-circle-left"></i>
                        &nbsp;&nbsp;Back
                      </button>
                      <button
                        disabled={loading}
                        className={`analytics-blue-button ${loading ? 'disabled' : ''}`}
                        onClick={this.saveDashboard}
                      >
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
                  {/* <h5>AWS RDS</h5> */}
                  <ul>{this.renderSideBar()}</ul>
                </div>
                <div className="tabs-right-section">
                  {/* <div className="analytics-aws-heading">
                    <p>AWS RDS {'>'} CPUUtilisation, CreditsUsage, CreditBalance</p>
                  </div> */}
                  <div>{this.createDashboard()}</div>
                </div>
              </div>
            </div>
          </div>
          {/* <DeleteTabPopup
            ref={this.openDeleteTabRef}
            deleteContent={selectedData}
            deleteDataFromSidebar={this.removeDashboardRecord}
          /> */}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ViewNewView);
