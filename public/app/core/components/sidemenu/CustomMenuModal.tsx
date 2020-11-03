import React from 'react';
import { Button, HorizontalGroup, Modal, VerticalGroup } from '@grafana/ui';
import { css } from 'emotion';

export class CustomMenuModal extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  onClickContinue = () => {
    this.setState({
      isOpen: false,
    });
    this.props.onClickContinue();
  };

  onClickCancel = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <Modal
        isOpen={isOpen}
        title="Unimplemented Feature"
        icon="exclamation-triangle"
        className={css`
          width: 500px;
        `}
      >
        <VerticalGroup align={'center'} spacing={'md'}>
          <h4>The feature you are asking is not implemented yet. Do you want to continue?</h4>
          <HorizontalGroup justify="center">
            <Button variant="primary" onClick={this.onClickContinue}>
              Continue
            </Button>
            <Button variant="secondary" onClick={this.onClickCancel}>
              Cancel
            </Button>
          </HorizontalGroup>
        </VerticalGroup>
      </Modal>
    );
  }
}
