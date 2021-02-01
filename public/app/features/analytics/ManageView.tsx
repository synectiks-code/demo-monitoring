// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import CustomDashboardLoader from '../custom-dashboard-loader';
// import { DeleteTabPopup } from './DeleteTabPopup';
// import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { getLocationSrv } from '@grafana/runtime';
import { config } from '../config';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  Id?: string;
}

class ManageView extends React.Component<any, any> {
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

  componentDidMount() {
    const { location } = this.props;
    if (location && location.routeParams && location.routeParams.id) {
      this.getDashData(location.routeParams.id);
    } else {
      getLocationSrv().update({ path: `/analytics` });
    }
  }

  getDashData = (id: any) => {
    let requestOptionsGet: any = {
      method: `GET`,
    };
    this.setState({
      loading: true,
    });
    fetch(`${config.GET_ANALYTICS_VIEW}/${id}`, requestOptionsGet)
      .then(response => response.json())
      .then((response: any) => {
        const { viewJson, name, description } = response;
        this.setState({
          viewName: name,
          description: description,
          tabs: JSON.parse(viewJson),
          loading: false,
        });
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
            <span>{tab.label}</span>
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

  setActiveSideTab = (index: any) => {
    this.setState({
      activeSideTab: index,
    });
  };

  // addTab = () => {
  //   const { tabs } = this.state;
  //   const length = tabs.length;
  //   tabs.push({ label: 'Tab' + (length + 1) });
  //   this.setState({
  //     tabs,
  //     activeTab: length,
  //   });
  // };

  // deleteTabData = (data: any, index: any) => {
  //   this.setState({
  //     selectedData: data,
  //     deletedId: index,
  //   });
  //   this.openDeleteTabRef.current.toggle();
  // };

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
    const { loading, viewName, tabs } = this.state;
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
          {loading && <div style={{ textAlign: 'center', marginTop: '40px' }}>View is loading</div>}
          {!loading && tabs && tabs.length > 0 && (
            <div className="analytics-container">
              <div className="analytics-heading-container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <h4 style={{ lineHeight: '36px' }}>{viewName}</h4>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="d-block text-right">
                      <button
                        className="analytics-white-button min-width-auto m-r-0"
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
                  {/* <li className="nav-item">
                    <a className="nav-link add-tab">
                      <i className="fa fa-plus"></i>
                    </a>
                  </li> */}
                </ul>
                <div className="analytics-tabs-section-container">
                  <div className="tabs-left-section">
                    <ul>{this.renderSideBar()}</ul>
                  </div>
                  <div className="tabs-right-section">
                    <div>{this.createDashboard()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!loading && (!tabs || (tabs && !tabs.length)) && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>There no data in this view</div>
          )}
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

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageView);
