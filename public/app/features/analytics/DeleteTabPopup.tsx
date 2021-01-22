import * as React from 'react';
import { Modal, ModalBody } from 'reactstrap';

export class DeleteTabPopup extends React.Component<any, any> {
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

  deleteData = () => {
    this.props.deleteDataFromSidebar();
    this.toggle();
  };

  render() {
    const { modal } = this.state;
    const { deleteContent } = this.props;
    return (
      <Modal isOpen={modal} toggle={this.toggle} className="catalog-modal-container">
        <h4 className="warning-heading">
          <i className="fa fa-exclamation-circle"></i>Warning
        </h4>
        <ModalBody style={{ height: 'calc(30vh - 50px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="d-block width-100 warning-content">
            <p>Are you Sure you want to delete this Dashboard from your view tab?</p>
            <a href="#">{deleteContent.title}</a>
          </div>
          <div className="d-block text-center p-t-20">
            <button className="analytics-gray-button cancel" onClick={this.handleClose}>
              Cancel
            </button>
            <button onClick={this.deleteData} className="analytics-blue-button m-r-0 continue">
              Continue
            </button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}
