// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  Id?: string;
}

class ManageDashboard extends React.Component<any, any> {
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
        },
        {
          label: 'AWS VPC',
        },
        {
          label: 'AWS VPN',
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
    tabs.push({ label: 'Tab' + (length + 1) });
    this.setState({
      tabs,
      activeTab: length,
    });
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
          <div className="analytics-manage-dashboard-container">
            <div className="manage-dashboard-heading">
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
            <div className="">
              <div className="left" style={{ width: '200px', display: 'inline-block', verticalAlign: 'top' }}>
                <label>AWS</label>
                <ul>
                  <li>
                    <span>Amazon VloudWatch Logs</span>
                    <i className="fa fa-ellipsis-h"></i>
                  </li>
                  <li>
                    <span>Amazon RDS</span>
                    <i className="fa fa-ellipsis-h"></i>
                  </li>
                  <li>
                    <span>AWS VPN</span>
                    <i className="fa fa-ellipsis-h"></i>
                  </li>
                </ul>
              </div>
              <div className="right" style={{ width: '800px', display: 'inline-block', verticalAlign: 'top' }}>
                <div>
                  <label>AWS RDS {'>'} CPUUtilisation, CreditsUsage, CreditBalance</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDashboard);
