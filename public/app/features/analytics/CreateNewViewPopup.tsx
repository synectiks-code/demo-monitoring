import * as React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export class CreateNewViewPopup extends React.Component<any, any> {
  steps: any;
  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
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

  render() {
    const { modal } = this.state;
    return (
      <Modal isOpen={modal} toggle={this.toggle} className="catalog-modal-container">
        <ModalHeader toggle={this.toggle}>Creating New View</ModalHeader>
        <ModalBody style={{ height: 'calc(45vh - 50px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="d-block width-100">
            <div className="form-group">
              <label htmlFor="viewName">View Name</label>
              <input
                type="text"
                className="input-group-text"
                id="viewName"
                name="viewName"
                placeholder="A descriptive name of View"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="input-group-text"
                name="description"
                placeholder="What kind of Dashboards are included in this View"
              ></textarea>
            </div>
            <div className="d-block text-right p-t-20">
              <button className="alert-gray-button cancel" onClick={this.handleClose}>
                Cancel
              </button>
              <button className="alert-blue-button m-r-0 continue">Continue</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
