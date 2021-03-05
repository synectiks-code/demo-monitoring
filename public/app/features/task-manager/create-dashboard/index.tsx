// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { updateLocation } from 'app/core/actions';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import 'react-circular-progressbar/dist/styles.css';
import { Workflow } from './Workflow';

// Services & Utils
export interface Props {
  $scope: any;
  $injector: any;
  updateLocation: typeof updateLocation;
  location: any;
}

class CreateDashboard extends React.Component<any, any> {
  breadCrumbs: any = [
    {
      label: 'Home',
      route: `/`,
    },
    {
      label: 'Analytics',
      route: '/analytics',
    },
    {
      label: 'Task Manager',
      riute: '/taskmanager',
    },
    {
      label: 'Create Dashboard',
      isCurrentPage: true,
    },
  ];
  workflowRef: any = null;
  createEditDashboardJsx = (
    <div className="create-edit-dashboard">
      <div className="form-group task-id">
        <label htmlFor="label">Task Id:&nbsp;</label>
        <span>1958781</span>
      </div>
      <div className="general-center-contain">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 own-dashboard">
            <div className="d-inline-block" style={{ cursor: 'pointer' }}>
              <a href="/dashboard/new?orgId=1" target="_blank">
                <span>
                  <img src="/public/img/create-dashboard-image.png" alt="Create your own dashboard" />
                </span>
              </a>
              <label>Create your own dashboard</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  approveJsx = (
    <div className="approve-tab-container">
      <div className="approve-dashboard-content">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-xs-12">
            <div className="form-group">
              <label>Dashboard Name:</label>
              <span>RDS Alerts Inbound</span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-xs-12">
            <div className="form-group">
              <label>Task id:</label>
              <span>
                <a href="#">1958741</a>
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-xs-12">
            <div className="form-group">
              <label>Dashboard id:</label>
              <span>
                <a href="#">NDB958741</a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="approve-dashboard-content border-bottom-0">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-xs-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Description</label>
                  <span>Description of dashboard will be displayed here</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Priority</label>
                  <span>Medium</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Environment</label>
                  <span>AWS</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Category</label>
                  <span>RDS</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-xs-12">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Status</label>
                  <span>Sent for Approvat</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Approver</label>
                  <span>Zakir</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-xs-12">
                <div className="form-group">
                  <label>Approver status</label>
                  <span>
                    <span>Pending</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="approve-dashboard-table">
        <table className="table">
          <tbody>
            <tr>
              <td>
                <div className="content">
                  <label>Task Created</label>
                  <span>Day 1</span>
                </div>
                <p>Created by Zakir on 25 Feb 2021 at 03:00 PM</p>
              </td>
            </tr>
            <tr>
              <td>
                <div className="content">
                  <label>Task Created</label>
                  <span>Day 1</span>
                </div>
                <p>Created by Zakir on 25 Feb 2021 at 03:00 PM</p>
              </td>
            </tr>
            <tr>
              <td>
                <div className="content">
                  <label>Task Created</label>
                  <span>Day 1</span>
                </div>
                <p>Created by Zakir on 25 Feb 2021 at 03:00 PM</p>
              </td>
            </tr>
            <tr>
              <td>
                <div className="content">
                  <label>Task Created</label>
                  <span>Day 1</span>
                </div>
                <p>Created by Zakir on 25 Feb 2021 at 03:00 PM</p>
              </td>
            </tr>
            <tr>
              <td>
                <div className="content">
                  <label>Task Created</label>
                  <span>Day 1</span>
                </div>
                <p>Created by Zakir on 25 Feb 2021 at 03:00 PM</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [
        {
          title: '',
          subHeading: '',
          apiEndPoint: '',
          tabTitle: 'Task Details',
          content: [
            {
              name: 'label',
              title: 'Task Id',
              value: '1958781',
              type: 'label',
            },
            {
              id: 'dashboardName',
              name: 'dashboardName',
              title: 'Dashboard Name',
              isRequired: false,
              placeHolder: 'Title for this Event Definition, Events Alerts created from it.',
              errorMessage: 'This field is required.',
              notice: '',
              validations: [
                {
                  regEx: '',
                  message: '',
                },
              ],
              value: '',
              type: 'text',
            },
            {
              id: 'Description',
              name: 'Description',
              value: '',
              title: 'Description',
              isRequired: false,
              placeHolder: 'Optional: Longer description for this Event Definition.',
              errorMessage: 'This field is required.',
              notice: '',
              validations: [
                {
                  regEx: '',
                  message: '',
                },
              ],
              type: 'textarea',
            },
            {
              id: 'Priority',
              name: 'Priority',
              title: 'Priority',
              isRequired: false,
              options: [
                {
                  label: 'Normal',
                  isEdit: false,
                },
              ],
              errorMessage: 'Error message',
              notice: '',
              value: '',
              type: 'select',
            },
            {
              id: 'Environment',
              name: 'Environment',
              title: 'Environment',
              isRequired: false,
              options: [
                {
                  label: 'Select Environment',
                  isEdit: false,
                },
              ],
              errorMessage: 'Error message',
              notice: '',
              value: '',
              type: 'select',
            },
            {
              id: 'Category',
              name: 'Category',
              title: 'Category',
              isRequired: false,
              options: [
                {
                  label: 'Select Category',
                  isEdit: false,
                },
              ],
              errorMessage: 'Error message',
              notice: '',
              value: '',
              type: 'select',
            },
            {
              id: 'Assignee',
              name: 'Assignee',
              title: 'Assign to',
              isRequired: false,
              options: [
                {
                  label: 'Select Assignee',
                  isEdit: false,
                },
              ],
              errorMessage: 'Error message',
              notice: '',
              value: '',
              type: 'select',
            },
          ],
        },
        {
          title: '',
          subHeading: '',
          apiEndPoint: '',
          tabTitle: 'Dashboard Details',
          content: [
            {
              name: 'label',
              title: 'Task Id',
              value: '1958781',
              type: 'label',
            },
            {
              id: 'dashboardImage',
              name: 'dashboardImage',
              title: 'Dashboard Image',
              isRequired: false,
              errorMessage: 'This field is required.',
              notice: '',
              type: 'file',
            },
            {
              id: 'Description',
              name: 'Description',
              value: '',
              title: 'Description',
              isRequired: false,
              placeHolder: 'Optional: Longer description for this Event Definition.',
              errorMessage: 'This field is required.',
              notice: '',
              validations: [],
              type: 'textarea',
            },
          ],
        },
        {
          title: '',
          subHeading: '',
          apiEndPoint: '',
          tabTitle: 'Create / Edit Dashboard',
          htmlContent: this.createEditDashboardJsx,
        },
        {
          title: '',
          subHeading: '',
          apiEndPoint: '',
          tabTitle: 'Approve',
          htmlContent: this.approveJsx,
        },
      ],
    };
    this.workflowRef = React.createRef();
  }

  onFormSubmitted = (step: any, response: any) => {
    console.log(step, response);
  };

  onChangeComponent = (e: any, type: any, tabIndex: any, componentIndex: any) => {
    console.log(e, type, tabIndex, componentIndex);
  };

  onChangeTab = (activeTab: any, data: any) => {
    if (activeTab === this.state.data.length - 1) {
      // this.props.sendData(data);
    } else {
      // this.workflowRef.current.showNextTab();
    }
  };
  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'TASK MANAGER';
    const { data } = this.state;
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
                  <a href="/taskmanager" className="float-right m-b-0 m-r-0 task-white-button">
                    <i className="fa fa-arrow-circle-left"></i>
                    &nbsp;&nbsp; Back
                  </a>
                </div>
              </div>
            </div>
            <div className="common-container border-bottom-0">
              <Workflow
                formData={data}
                onFormSubmitted={this.onFormSubmitted}
                ref={this.workflowRef}
                onChangeComponent={this.onChangeComponent}
                onChangeTab={this.onChangeTab}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateDashboard);
