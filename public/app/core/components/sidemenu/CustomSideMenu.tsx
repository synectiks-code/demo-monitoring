import React, { PureComponent } from 'react';
import { CustomMenuModal } from './CustomMenuModal';
import { getLocationSrv } from '@grafana/runtime';
import Rbac from './Rbac';

const menuStates: any = {
  MENU_OPEN: 1,
  MENU_CLOSE: 2,
  SUBMENU_OPEN: 4,
  SUBMENU_CLOSE: 8,
};

export class CustomSideMenu extends PureComponent<any, any> {
  modalRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      activeMenuLink: '',
      activeSubMenuLink: '',
      clickedMenuItem: {},
      activeMenuItem: null,
      showSubMenu: false,
      menuState: menuStates.MENU_OPEN,
      subMenuState: 0,
      isSubMenuPinned: false,
    };
    this.modalRef = React.createRef();
  }

  updateState = (newState: any, lastState: any) => {
    if (newState !== lastState) {
      const grafanaApp: any = document.getElementsByClassName('grafana-app');
      if (grafanaApp.length > 0) {
        grafanaApp[0].classList.remove('menu_state_' + lastState);
        grafanaApp[0].classList.add('menu_state_' + newState);
      }
    }
  };

  handleLocationChange = () => {
    const pathName = location.pathname;
    // let isActive = false;
    const totalItem = this.mainMenu.length;
    let menuState = menuStates.MENU_OPEN;
    let subMenuState = 0;
    let showSubMenu = false;
    let activeMenuItem = null;
    let isSubMenuPinned = false;
    if (pathName === '/') {
      this.setState({
        activeMenuLink: '/',
      });
      return {
        menuState,
        subMenuState,
        showSubMenu,
        activeMenuItem,
        isSubMenuPinned,
      };
    }
    for (let i = 0; i < totalItem; i++) {
      const item = this.mainMenu[i];
      if (
        (pathName.indexOf(item.activeLink) !== -1 || (item.tempLink && pathName.indexOf(item.tempLink) !== -1)) &&
        item.activeLink !== '/'
      ) {
        if (item.tempLink && pathName.indexOf(item.tempLink) !== -1) {
          this.setState({
            activeMenuLink: item.tempLink,
          });
        } else {
          this.setState({
            activeMenuLink: item.activeLink,
          });
        }
        if (item.subMenu && item.subMenu.length > 0) {
          for (let j = 0; j < item.subMenu.length; j++) {
            const sMenu = item.subMenu[j];
            if (pathName.indexOf(sMenu.activeSLink) !== -1) {
              this.setState({
                activeSubMenuLink: sMenu.activeSLink,
              });
              subMenuState = menuStates.SUBMENU_OPEN;
              menuState = menuStates.MENU_CLOSE;
              showSubMenu = true;
              isSubMenuPinned = true;
              break;
            }
          }
        }
        // isActive = true;
        activeMenuItem = item;
        break;
      }
    }
    return {
      menuState,
      subMenuState,
      showSubMenu,
      activeMenuItem,
      isSubMenuPinned,
    };
  };

  componentDidMount() {
    const that = this;
    window.addEventListener('locationchange', () => {
      that.handleLocationChange();
    });

    history.pushState = (f =>
      function pushState(this: any) {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.pushState);

    history.replaceState = (f =>
      function replaceState(this: any) {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
      })(history.replaceState);

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('locationchange'));
    });

    const menuData: any = this.handleLocationChange();
    this.updateState(menuData.menuState | menuData.subMenuState, -1);
    this.setState({
      menuState: menuData.menuState,
      subMenuState: menuData.subMenuState,
      showSubMenu: menuData.showSubMenu,
      activeMenuItem: menuData.activeMenuItem,
      isSubMenuPinned: menuData.isSubMenuPinned,
    });
  }

  mainMenu: any = [
    {
      link: '/',
      text: 'Overview',
      cssClass: 'overview',
      activeLink: '/',
      isImplemented: true,
      childName: 'overview',
    },
    {
      link: '/activity-log',
      text: 'Activity Log',
      cssClass: 'activity-log',
      activeLink: '/activity-log',
      childName: 'activity-log',
    },
    {
      link: '/plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
      text: 'Alerts',
      cssClass: 'alerts',
      activeLink: 'plugins/xformation-alertmanager-ui-plugin',
      tempLink: 'alerting/list',
      isImplemented: true,
      childName: 'alerts',
      subMenu: [
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
          text: 'Dashboard',
          cssClass: 'dashboard',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          isImplemented: true,
          childName: 'alert-manager-dashboard',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/alertrulebuilder',
          text: 'New Alert Rule',
          cssClass: 'new-alert-rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/alertrulebuilder',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          isImplemented: true,
          childName: 'new-alert-rule',
        },
        {
          link: '/alerting/list',
          text: 'All Alert Rules',
          cssClass: 'new-alert-rule',
          activeSLink: 'alerting/list',
          activeLink: 'alerting/list',
          isImplemented: true,
          childName: 'all-alert-rule',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          text: 'Manage Alert Rule',
          cssClass: 'new-alert-rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          isImplemented: true,
          childName: 'new-alert-rule',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/manageworkflow',
          text: 'Manage Workflows',
          cssClass: 'new-alert-rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/manageworkflow',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          childName: 'new-alert-rule',
        },
      ],
    },
    {
      link: 'plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
      text: 'Metrics',
      cssClass: 'metrics',
      activeLink: 'plugins/xformation-perfmanager-ui-plugin',
      isImplemented: true,
      childName: 'metrics',
      subMenu: [
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
          text: 'Dashboard',
          cssClass: 'metrics-catalog',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-catalog',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/catalog',
          text: 'Catalog',
          cssClass: 'metrics-catalog',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/catalog',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-catalog',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/library',
          text: 'Library',
          cssClass: 'metrics-library',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/library',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-library',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/collectionview',
          text: 'Collection',
          cssClass: 'metrics-collection',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/collectionview',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-collection',
        },
        {
          link: 'plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          text: 'Rule',
          cssClass: 'metrics-rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-rule',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/preferences',
          text: 'Preferences',
          cssClass: 'metrics-preferences',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/preferences',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/discovery',
          text: 'Discovery',
          cssClass: 'metrics-preferences',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/discovery',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/view',
          text: 'View',
          cssClass: 'metrics-preferences',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/view',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
      ],
    },
    {
      link: 'plugins/xformation-logmanager-ui-plugin/page/dashboard',
      text: 'Logs',
      cssClass: 'logs',
      activeLink: 'plugins/xformation-logmanager-ui-plugin',
      isImplemented: true,
      childName: 'grafana-logs',
    },
    {
      link: '/service-health',
      text: 'Service Health',
      cssClass: 'service-health',
      activeLink: '/service-health',
      childName: 'service-health',
    },
    {
      link: '/workbooks',
      text: 'Workbooks',
      cssClass: 'workbooks',
      activeLink: '/workbooks',
      childName: 'workbooks',
    },
    {
      link: 'plugins/xformation-compliancemanager-ui-plugin/page/dashboard',
      text: 'Compliance',
      cssClass: 'compliance',
      activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
      isImplemented: true,
      childName: 'compliance',
      subMenu: [
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/dashboard',
          text: 'Dashboard',
          cssClass: 'compliance-dashboard',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/dashboard',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-dashboard',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancerulesets',
          text: 'Compliance Rulesets',
          cssClass: 'compliance-rulesets',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancerulesets',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-rulesets',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/gslbuilder',
          text: 'GSL Builder',
          cssClass: 'compliance-builder',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/gslbuilder',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-builder',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceremediation',
          text: 'Remediation',
          cssClass: 'compliance-remediation',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceremediation',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-remediation',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceassessmenthistory',
          text: 'Assessment History',
          cssClass: 'compliance-assessment',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceassessmenthistory',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-assessment-history',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceexclusions',
          text: 'Exclusions',
          cssClass: 'compliance-exclusions',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceexclusions',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-exclusions',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancepolicy',
          text: 'Compliance Policies',
          cssClass: 'compliance-exclusions',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancepolicy',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-policies',
        },
      ],
    },
    {
      link: 'plugins/xformation-servicedesk-ui-plugin/page/dashboard',
      text: 'Tickets',
      cssClass: 'tickets',
      activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
      isImplemented: true,
      childName: 'tickets',
      subMenu: [
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/dashboard',
          text: 'Dashboard',
          cssClass: 'tickets-dashboard',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/dashboard',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-dashboard',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/allcontacts',
          text: 'Contacts',
          cssClass: 'tickets-contacts',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/allcontacts',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-contacts',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/allcompanies',
          text: 'Companies',
          cssClass: 'tickets-companies',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/allcompanies',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-companies',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/tickets',
          text: 'Reports',
          cssClass: 'tickets-reports',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/tickets',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-reports',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/opentickets',
          text: 'Preferences',
          cssClass: 'tickets-preferences',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/opentickets',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-preferences',
        },
      ],
    },
  ];
  insights: any = [
    {
      link: '/analytics',
      text: 'Applications',
      cssClass: 'applications',
      activeLink: '/analytics',
      childName: 'analytics',
      isImplemented: true,
    },
    {
      link: '/virtual-machines',
      text: 'Virtual Machines',
      cssClass: 'virtual-machines',
      activeLink: '/virtual-machines',
      childName: 'virtual-machines',
    },
    {
      link: '/networks',
      text: 'Networks (preview)',
      cssClass: 'networks',
      activeLink: '/networks',
      childName: 'networks',
    },
    {
      link: '/jobs',
      text: 'Jobs',
      cssClass: 'jobs',
      activeLink: '/jobs',
      childName: 'jobs',
    },
  ];
  settings: any = [
    {
      link: '/diagnostic-settings',
      text: 'Diagnostic Settings',
      cssClass: 'diagnostic-settings',
      activeLink: '/diagnostic-settings',
      childName: 'diagnostic-settings',
    },
    {
      link: '/plugins/xformation-rbac-ui-plugin/page/home',
      text: 'RBAC Settings',
      cssClass: 'diagnostic-settings',
      activeSLink: '/plugins/xformation-rbac-ui-plugin/page/home',
      activeLink: '/plugins/xformation-rbac-ui-plugin',
      childName: 'rbac-settings',
    },
  ];

  onClickToggleMenu = () => {
    // //This is patch to toggle the menu
    // //never directly use dom elements like this
    // const grafanaApp: any = document.getElementsByClassName('grafana-app');
    // if (grafanaApp.length > 0) {
    //   grafanaApp[0].classList.toggle('wide-side-menu');
    // }
    let { menuState, subMenuState } = this.state;
    const lastState = menuState | subMenuState;
    if (menuState === menuStates.MENU_OPEN) {
      menuState = menuStates.MENU_CLOSE;
    } else {
      menuState = menuStates.MENU_OPEN;
    }
    this.updateState(menuState | subMenuState, lastState);
    this.setState({
      menuState,
    });
  };

  onClickToggleSubMenu = (e: any) => {
    let { menuState, subMenuState, isSubMenuPinned } = this.state;
    const lastState = menuState | subMenuState;
    if (subMenuState === menuStates.SUBMENU_OPEN) {
      if (isSubMenuPinned) {
        subMenuState = menuStates.SUBMENU_CLOSE;
        isSubMenuPinned = false;
      } else {
        isSubMenuPinned = true;
      }
    } else {
      subMenuState = menuStates.SUBMENU_OPEN;
    }
    this.updateState(menuState | subMenuState, lastState);
    this.setState({
      subMenuState,
      isSubMenuPinned,
    });
  };

  setMenuStates = (menuNewState: any, subMenuNewState: any) => {
    let { menuState, subMenuState } = this.state;
    const lastState = menuState | subMenuState;
    this.updateState(menuNewState | subMenuNewState, lastState);
    this.setState({
      menuState: menuNewState,
      subMenuState: subMenuNewState,
    });
  };

  onClickLink = (e: any, menuItem: any) => {
    if (menuItem.isImplemented) {
      let isSubMenuPinned = false;
      const showSubMenu = menuItem && menuItem.subMenu && menuItem.subMenu.length > 0;
      this.setState({
        activeMenuLink: menuItem.activeLink,
        activeSubMenuLink: menuItem.activeLink,
        activeMenuItem: menuItem,
        showSubMenu: showSubMenu,
      });
      if (showSubMenu) {
        this.setMenuStates(menuStates.MENU_CLOSE, menuStates.SUBMENU_OPEN);
        isSubMenuPinned = true;
      } else {
        this.setMenuStates(menuStates.MENU_OPEN, 0);
      }
      getLocationSrv().update({ path: menuItem.link });
      this.setState({
        isSubMenuPinned,
      });
    } else {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      this.setState({
        clickedMenuItem: menuItem,
      });
      this.modalRef.current.toggleModal();
    }
  };

  onClickSubLink = (e: any, sMenuItem: any) => {
    if (sMenuItem.isImplemented) {
      this.setState({
        activeMenuLink: sMenuItem.activeLink,
        activeSubMenuLink: sMenuItem.activeSLink,
      });
      getLocationSrv().update({ path: sMenuItem.link });
    } else {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      this.setState({
        clickedMenuItem: sMenuItem,
      });
      this.modalRef.current.toggleModal();
    }
  };

  onClickContinue = () => {
    const { clickedMenuItem } = this.state;
    this.setState({
      activeMenuLink: clickedMenuItem.activeLink,
      activeSubMenuLink: clickedMenuItem.activeSLink ? clickedMenuItem.activeSLink : clickedMenuItem.activeLink,
    });
    getLocationSrv().update({ path: clickedMenuItem.link });
    this.setState({
      clickedMenuItem: {},
      showSubMenu: false,
    });
    this.setMenuStates(menuStates.MENU_OPEN, 0);
  };

  createOpenMenu = (menuItems: any) => {
    const retItem: any = [];
    const { activeMenuLink } = this.state;
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i];
      retItem.push(
        <Rbac parentName="grafana-ui" childName={menuItem.childName || ''}>
          <li className="item">
            <a
              href={'#'}
              className={`menu-item ${
                activeMenuLink === menuItem.activeLink || activeMenuLink === menuItem.tempLink ? 'active' : ''
              }`}
              onClick={(e: any) => this.onClickLink(e, menuItem)}
            >
              <div className={`menu-item-image ${menuItem.cssClass}`}></div>
              <div className="menu-item-text">{menuItem.text}</div>
            </a>
          </li>
        </Rbac>
      );
    }
    return retItem;
  };

  createCloseMenu = (menuItems: any) => {
    const retItem: any = [];
    const { activeMenuLink } = this.state;
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i];
      retItem.push(
        <Rbac parentName="grafana-ui" childName={menuItem.childName || ''}>
          <li className="item">
            <a
              href={'#'}
              className={`menu-item ${
                activeMenuLink === menuItem.activeLink || activeMenuLink === menuItem.tempLink ? 'active' : ''
              }`}
              onClick={(e: any) => this.onClickLink(e, menuItem)}
            >
              <div className={`menu-item-image ${menuItem.cssClass}`}></div>
              <div className="menu-item-text">{menuItem.text}</div>
            </a>
          </li>
        </Rbac>
      );
    }
    return retItem;
  };

  createOpenSubMenu = () => {
    const { activeMenuItem, activeSubMenuLink } = this.state;
    const retData = [];
    if (activeMenuItem && activeMenuItem.subMenu && activeMenuItem.subMenu.length > 0) {
      for (let j = 0; j < activeMenuItem.subMenu.length; j++) {
        retData.push(
          <Rbac parentName="grafana-ui" childName={activeMenuItem.subMenu[j].childName || ''}>
            <li>
              <a
                className={`menu-item ${activeSubMenuLink === activeMenuItem.subMenu[j].activeSLink ? 'active' : ''}`}
                href={activeMenuItem.subMenu[j].link}
                onClick={(e: any) => this.onClickSubLink(e, activeMenuItem.subMenu[j])}
              >
                <div className={`menu-item-image ${activeMenuItem.subMenu[j].cssClass}`}></div>
                <div className="menu-item-text">{activeMenuItem.subMenu[j].text}</div>
              </a>
            </li>
          </Rbac>
        );
      }
    }
    return retData;
  };

  createCloseSubMenu = () => {
    const { activeMenuItem, activeSubMenuLink } = this.state;
    const retData = [];
    if (activeMenuItem && activeMenuItem.subMenu && activeMenuItem.subMenu.length > 0) {
      for (let j = 0; j < activeMenuItem.subMenu.length; j++) {
        retData.push(
          <Rbac parentName="grafana-ui" childName={activeMenuItem.subMenu[j].childName || ''}>
            <li>
              <a
                className={`menu-item ${activeSubMenuLink === activeMenuItem.subMenu[j].activeSLink ? 'active' : ''}`}
                href={activeMenuItem.subMenu[j].link}
                onClick={(e: any) => this.onClickSubLink(e, activeMenuItem.subMenu[j])}
              >
                <div className={`menu-item-image ${activeMenuItem.subMenu[j].cssClass}`}></div>
                <div className="menu-item-text">{activeMenuItem.subMenu[j].text}</div>
              </a>
            </li>
          </Rbac>
        );
      }
    }
    return retData;
  };

  onMouseEnterClosedSubMenu = () => {
    const { menuState } = this.state;
    this.setMenuStates(menuState, menuStates.SUBMENU_OPEN);
  };

  onMouseLeaveOpenedSubMenu = () => {
    const { menuState, isSubMenuPinned } = this.state;
    if (!isSubMenuPinned) {
      this.setMenuStates(menuState, menuStates.SUBMENU_CLOSE);
    }
  };

  render() {
    const { showSubMenu, isSubMenuPinned } = this.state;
    return [
      <div className="sidemenu__logo_small_breakpoint">
        <i className="fa fa-bars" />
        <span className="sidemenu__close">
          <i className="fa fa-times" />
          &nbsp;Close
        </span>
      </div>,
      <div className="menu-item-container">
        <div className="open-menu">
          <div className="sidemenu-search-container">
            <label className="gf-form--has-input-icon mr-auto">
              <input type="text" placeholder="Search" className="gf-form-input sidemenu-search-box" />
              <i className="gf-form-input-icon fa fa-search"></i>
            </label>
            <div className="side-menu-toggle" onClick={this.onClickToggleMenu}>
              <i className="fa fa-arrow-left left-arrow"></i>
            </div>
          </div>
          <ul>{this.createOpenMenu(this.mainMenu)}</ul>
          <div className="menu-item-header">INSIGHTS</div>
          <ul>{this.createOpenMenu(this.insights)}</ul>
          <div className="menu-item-header">SETTINGS</div>
          <ul>{this.createOpenMenu(this.settings)}</ul>
        </div>
        <div className="close-menu">
          <div className="sidemenu-search-container">
            <div className="side-menu-toggle" onClick={this.onClickToggleMenu}>
              <i className="fa fa-arrow-right right-arrow"></i>
            </div>
          </div>
          <ul>{this.createCloseMenu(this.mainMenu)}</ul>
          <div className="menu-item-header"></div>
          <ul>{this.createCloseMenu(this.insights)}</ul>
          <div className="menu-item-header"></div>
          <ul>{this.createCloseMenu(this.settings)}</ul>
        </div>
        <div className={`sub-menu ${showSubMenu ? 'active-sub-menu' : ''}`}>
          <div className="open-menu" onMouseLeave={this.onMouseLeaveOpenedSubMenu}>
            <div className="side-menu-toggle text-right" onClick={this.onClickToggleSubMenu}>
              <i
                className="fa fa-thumb-tack"
                style={{ transform: isSubMenuPinned ? 'rotate(0deg)' : 'rotate(-90deg)' }}
              ></i>
            </div>
            <ul>{this.createOpenSubMenu()}</ul>
          </div>
          <div className="close-menu" onMouseEnter={this.onMouseEnterClosedSubMenu}>
            <div className="side-menu-toggle" onClick={this.onClickToggleSubMenu}>
              <i className="fa fa-thumb-tack" style={{ transform: 'rotate(-90deg)' }}></i>
            </div>
            <ul>{this.createCloseSubMenu()}</ul>
          </div>
        </div>
        <CustomMenuModal ref={this.modalRef} onClickContinue={this.onClickContinue} />
      </div>,
    ];
  }
}
