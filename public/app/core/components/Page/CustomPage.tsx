// Libraries
import React, { Component } from 'react';
import { getTitleFromNavModel } from 'app/core/selectors/navModel';

// Components
import PageHeader from '../PageHeader/PageHeader';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
// import { Footer } from '../Footer/Footer';
import PageContents from './PageContents';
import { CustomScrollbar } from '@grafana/ui';
import { NavModel } from '@grafana/data';
import { isEqual } from 'lodash';
import { Branding } from '../Branding/Branding';

interface Props {
  children: JSX.Element[] | JSX.Element;
  navModel: NavModel;
}

class CustomPage extends Component<Props> {
  static Header = PageHeader;
  static Contents = PageContents;

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.navModel, this.props.navModel)) {
      this.updateTitle();
    }
  }

  updateTitle = () => {
    const title = this.getPageTitle;
    document.title = title ? title + ' - ' + Branding.AppTitle : Branding.AppTitle;
  };

  get getPageTitle() {
    const { navModel } = this.props;
    if (navModel) {
      return getTitleFromNavModel(navModel) || undefined;
    }
    return undefined;
  }

  render() {
    // const { navModel } = this.props;
    return (
      <React.Fragment>
        <CustomNavigationBar />
        <div className="scroll-canvas--dashboard monitor-main-body">
          <CustomScrollbar autoHeightMin={'100%'} className="custom-scrollbar--page">
            <div className="page-scrollbar-content">
              {/* <PageHeader model={navModel} /> */}
              {this.props.children}
              {/* <Footer /> */}
            </div>
          </CustomScrollbar>
        </div>
      </React.Fragment>
    );
  }
}

export default CustomPage;
