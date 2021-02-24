import * as React from 'react';
import { config } from '../../config';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './UnimplementedFeaturePopup.css';

export class UnimplementedFeaturePopup extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
      link: '',
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  setLink = (link: any) => {
    this.setState({
      link,
    });
  };

  render() {
    const state = this.state;
    return (
      <Modal isOpen={state.modal} toggle={this.toggle} className="modal-container unimplemented-modal-container">
        <ModalHeader toggle={this.toggle}>Unimplemented Feature</ModalHeader>
        <ModalBody style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <p>The feature you are asking is not implemented yet. Do you want to continue?</p>
        </ModalBody>
        <ModalFooter>
          <div className="d-block text-center">
            {state.link && (
              <a href={`${config.basePath}${state.link}`} onClick={this.toggle} className="dashboard-blue-button m-b-0">
                Continue
              </a>
            )}
            <button className="dashboard-gray-button" onClick={this.toggle}>
              Close
            </button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}
