// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import 'react-circular-progressbar/dist/styles.css';
import Table from '../table';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  updateLocation: typeof updateLocation;
  location: any;
}

class AllTasks extends React.Component<any, any> {
  breadCrumbs: any = [
    {
      label: 'Home',
      route: `/`,
    },
    {
      label: 'Task Manager',
      isCurrentPage: true,
    },
  ];
  tableValue: any;
  perPageLimit: any;
  checkboxValue: any;
  constructor(props: Props) {
    super(props);
    this.tableValue = {
      columns: [
        {
          label: 'Name',
          key: 'name',
        },
        {
          label: 'Rule Type',
          key: 'ruleType',
        },
        {
          label: 'Message',
          key: 'message',
        },
        {
          label: 'Alert Handlers',
          key: 'alertHandlers',
        },
        {
          label: 'Action',
          key: 'action',
          renderCallback: () => {
            return (
              <td>
                <div className="d-inline-block">
                  <div className="enabled"></div>
                  <button className="btn btn-link">
                    <i className="fa fa-edit"></i>
                  </button>
                  <button className="btn btn-link">
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            );
          },
        },
      ],
      data: [
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'CPU Percentage',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Read Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
        {
          name: 'Disk Write Bytes	',
          ruleType: 'Threshold',
          message: '{{.ID}} {{.Name}} {{.TaskName}} {{….',
          alertHandlers: 'Slack (default)',
        },
      ],
    };
    this.perPageLimit = 9;
    this.checkboxValue = true;
  }

  isLightTheme() {
    const w: any = window;
    if (w.grafanaBootData && w.grafanaBootData.user) {
      return w.grafanaBootData.user.lightTheme;
    }
    return false;
  }

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'TASK MANAGER';
    return (
      <React.Fragment>
        <CustomNavigationBar />
        <div className="task-manager monitor-main-body">
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
                      <a href={`${breadcrumb.route}`} className="breadcrumbs-link">
                        {breadcrumb.label}
                      </a>
                      <span className="separator">
                        <i className="fa fa-chevron-right"></i>
                      </span>
                    </React.Fragment>
                  );
                }
              })}
            </div>
          </div>
          <div className="task-dashboard-page-container">
            <div className="common-container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                  <div className="heading">
                    <h3>Task Manager</h3>
                    <span>Provider</span>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                  <button className="float-right m-b-0 m-r-0 task-gray-button new-task-button">New Task</button>
                </div>
              </div>
            </div>
            <div className="common-container border-bottom-0">
              <div className="task-table-container">
                <div className="heading">All Tasks</div>
                <Table
                  valueFromData={this.tableValue}
                  perPageLimit={this.perPageLimit}
                  visiblecheckboxStatus={this.checkboxValue}
                  tableClasses={{
                    table: 'task-data-tabel',
                    tableParent: 'tasks-data-table',
                    parentClass: 'all-task-data-table',
                  }}
                  searchKey="name"
                  showingLine="Showing %start% to %end% of %total%"
                  dark={!this.isLightTheme()}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(AllTasks);
