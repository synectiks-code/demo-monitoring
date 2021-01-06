import * as React from 'react';
import { Modal, ModalBody } from 'reactstrap';

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
      <Modal isOpen={modal} toggle={this.toggle} className="modal-container">
        <ModalBody style={{ height: 'calc(75vh - 50px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="d-block width-100">
            <div className="d-block p-b-20 heading">
              <div className="d-inline-block width-75 v-a-top">
                <h4 className="d-block">Creating New View</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="form-group">
                  <label htmlFor="viewName">View Name</label>
                  <input type="text" id="viewName" name="viewName" placeholder="A descriptive name of View" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="What kind of Dashboards are included in this View"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="d-block text-center p-t-20">
                  <button className="cancel" onClick={this.handleClose}>
                    Cancel
                  </button>
                  <button className="continue">Continue</button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
