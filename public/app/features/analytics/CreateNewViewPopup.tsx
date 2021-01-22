import * as React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { CustomTextbox, CustomTextarea } from './components';
import { getLocationSrv } from '@grafana/runtime';

export class CreateNewViewPopup extends React.Component<any, any> {
  steps: any;
  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
      viewName: '',
      description: '',
      isSubmitted: false,
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  handleClose = () => {
    this.setState({
      modal: false,
    });
  };

  handleStateChange = (e: any) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  validate = (isSubmitted: any) => {
    const validObj = {
      isValid: true,
      message: '',
    };
    let isValid = true;
    const retData = {
      viewName: validObj,
      description: validObj,
      isValid,
    };
    if (isSubmitted) {
      const { viewName, description } = this.state;
      if (!viewName) {
        retData.viewName = {
          isValid: false,
          message: 'Name is required',
        };
        isValid = false;
      }
      if (!description) {
        retData.description = {
          isValid: false,
          message: 'Description is required',
        };
        isValid = false;
      }
    }
    retData.isValid = isValid;
    return retData;
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.setState({
      isSubmitted: true,
    });
    const errorData = this.validate(true);
    if (errorData.isValid) {
      getLocationSrv().update({ path: '/analytics/new/dashboard' });
      // window.location.assign('/analytics/f/new');
    }
  };

  render() {
    const { modal, viewName, description, isSubmitted } = this.state;
    const errorData = this.validate(isSubmitted);
    return (
      <Modal isOpen={modal} toggle={this.toggle} className="catalog-modal-container">
        <ModalHeader toggle={this.toggle}>Creating New View</ModalHeader>
        <ModalBody style={{ height: 'calc(54vh - 50px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="d-block width-100">
            <div className="form-group">
              <label htmlFor="viewName">View Name</label>
              <CustomTextbox
                containerClass="form-group mb-4 position-relative"
                inputClass="input-group-text"
                htmlFor="viewName"
                id="viewName"
                placeholder=""
                name="viewName"
                value={viewName}
                onChange={this.handleStateChange}
                isValid={errorData.viewName.isValid}
                message={errorData.viewName.message}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <CustomTextarea
                containerClass="form-group position-relative"
                inputClass="input-group-text"
                htmlFor="description"
                id="description"
                placeholder=""
                name="description"
                value={description}
                onChange={this.handleStateChange}
                isValid={errorData.description.isValid}
                message={errorData.description.message}
              />
            </div>
            <div className="d-block text-right">
              <button className="analytics-gray-button cancel" onClick={this.handleClose}>
                Cancel
              </button>
              <button className="analytics-blue-button m-r-0 continue" onClick={this.handleSubmit}>
                Continue
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
