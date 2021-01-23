// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import Table from './tables/table';
import { CreateNewViewPopup } from './CreateNewViewPopup';
import { config } from '../config';
import { getLocationSrv } from '@grafana/runtime';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  updateLocation: typeof updateLocation;
  location: any;
}

class Analytics extends React.Component<any, any> {
  opencreateNewViewRef: any;
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
  perPageLimit: any;
  checkboxValue: any;
  constructor(props: Props) {
    super(props);
    this.perPageLimit = 6;
    this.checkboxValue = false;
    this.state = {
      viewList: [],
      columns: [
        {
          label: 'Name',
          key: 'name',
          renderCallback: (value: any, view: any) => {
            return (
              <td>
                <div style={{ color: '#0099ff', cursor: 'anchor' }} onClick={() => this.onClickView(view)}>
                  {value}
                </div>
              </td>
            );
          },
        },
        {
          label: 'Description',
          key: 'description',
        },
        {
          label: 'Created By',
          key: 'createdBy',
        },
        {
          label: 'Last Modified',
          key: 'lastModified',
        },
        {
          label: 'Action',
          key: 'action',
          renderCallback: (value: any, ticketObj: any) => {
            return (
              <td>
                <div className="d-inline-block">
                  <button className="btn btn-link">
                    <i className="fa fa-edit"></i>
                  </button>
                  <button className="btn btn-link">
                    <i className="fa fa-trash"></i>
                  </button>
                  <button className="btn btn-link">
                    <i className="fa fa-ellipsis-h"></i>
                  </button>
                </div>
              </td>
            );
          },
        },
      ],
    };
    this.opencreateNewViewRef = React.createRef();
  }

  componentDidMount() {
    this.getTableData();
  }

  getTableData = () => {
    let requestOptionsGet: any = {
      method: `GET`,
    };
    fetch(`${config.ANALYTICS_LIST_VIEW}`, requestOptionsGet)
      .then(response => response.json())
      .then((response: any) => {
        console.log(response);
        if (response) {
          this.setState({
            viewList: response,
          });
        }
      });
  };

  onClickCreateNewView = (e: any) => {
    this.opencreateNewViewRef.current.toggle();
  };

  onClickView = (view: any) => {
    getLocationSrv().update({ path: `/analytics/${view.id}` });
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { viewList, columns } = this.state;
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
              <span>
                <img src="/public/img/metrics.svg" alt="" />
              </span>
              <h4>
                Analytics <p>Manage Views</p>
              </h4>
            </div>
            <div className="analytics-table-container">
              <div className="new-view-btn">
                <button className="analytics-blue-button" onClick={this.onClickCreateNewView}>
                  New View
                </button>
              </div>
              <Table
                valueFromData={{
                  columns: columns,
                  data: viewList,
                }}
                perPageLimit={this.perPageLimit}
                visiblecheckboxStatus={this.checkboxValue}
                tableClasses={{
                  table: 'tabel',
                  tableParent: 'analytics-tabel',
                  parentClass: 'analytics-tabels',
                }}
                showingLine="Showing %start% to %end% of %total% Tickets"
              />
            </div>
          </div>
          <CreateNewViewPopup ref={this.opencreateNewViewRef} />
        </div>
      </React.Fragment>
    );
  }
}

export const mapStateToProps = (state: any) => state;

const mapDispatchToProps = {
  updateLocation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
