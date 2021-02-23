import React, { PureComponent } from 'react';
import { CustomMenuModal } from './CustomMenuModal';
import { getLocationSrv } from '@grafana/runtime';
import Rbac from './Rbac';
import { Scrollbars } from 'react-custom-scrollbars';

const menuStates: any = {
  SUBMENU_OPEN: 4,
  SUBMENU_CLOSE: 8,
};

export class CustomSideMenu extends PureComponent<any, any> {
  modalRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      clickedMenuItem: {},
      activeMenuItem: null,
      activeSubMenuItem: null,
      showSubMenu: false,
      subMenuState: 0,
      isSubMenuPinned: false,
      collapsedMenus: [false, false],
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
    let retData = this.findActiveItem(pathName, this.mainMenu);
    if (retData.isFound) {
      return retData;
    }
    retData = this.findActiveItem(pathName, this.opsCentral);
    if (retData.isFound) {
      return retData;
    }
    retData = this.findActiveItem(pathName, this.devCentral);
    if (retData.isFound) {
      return retData;
    }
    retData = this.findActiveItem(pathName, this.diagnostics);
    if (retData.isFound) {
      return retData;
    }
    retData = this.findActiveItem(pathName, this.extra);
    return retData;
  };

  findActiveItem = (pathName: any, menuList: any) => {
    let totalItem = menuList.length;
    let isFound = false;
    let subMenuState = 0;
    let showSubMenu = false;
    let activeMenuItem = null;
    let isSubMenuPinned = false;
    let activeSubMenuItem = null;
    for (let i = 0; i < totalItem; i++) {
      const item = menuList[i];
      if (item.subMenu && item.subMenu.length > 0) {
        for (let j = 0; j < item.subMenu.length; j++) {
          const sMenu = item.subMenu[j];
          if (pathName === sMenu.link) {
            subMenuState = menuStates.SUBMENU_OPEN;
            showSubMenu = true;
            isSubMenuPinned = true;
            activeSubMenuItem = sMenu;
            activeMenuItem = item;
            isFound = true;
            break;
          }
        }
      } else {
        if (pathName === item.link) {
          activeMenuItem = item;
          isFound = true;
          break;
        }
      }
    }
    return {
      subMenuState,
      showSubMenu,
      activeMenuItem,
      isSubMenuPinned,
      isFound,
      activeSubMenuItem,
    };
  };

  componentDidMount() {
    window.addEventListener('locationchange', () => {
      const menuData: any = this.handleLocationChange();
      this.updateState(menuData.subMenuState, this.state.subMenuState);
      this.setState({
        subMenuState: menuData.subMenuState,
        showSubMenu: menuData.showSubMenu,
        activeMenuItem: menuData.activeMenuItem,
        isSubMenuPinned: menuData.isSubMenuPinned,
        activeSubMenuItem: menuData.activeSubMenuItem,
      });
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
    this.updateState(menuData.subMenuState, -1);
    this.setState({
      subMenuState: menuData.subMenuState,
      showSubMenu: menuData.showSubMenu,
      activeMenuItem: menuData.activeMenuItem,
      isSubMenuPinned: menuData.isSubMenuPinned,
      activeSubMenuItem: menuData.activeSubMenuItem,
    });
  }

  mainMenu: any = [
    {
      link: '/',
      text: 'Overview',
      cssClass: 'overview',
      isImplemented: true,
      childName: 'overview',
    },
    {
      link: '/plugins/xformation-assetmanager-ui-plugin/page/environments',
      text: 'Assets',
      cssClass: 'assets',
      childName: 'assets',
      isImplemented: true,
      subMenu: [
        {
          link: '/plugins/xformation-assetmanager-ui-plugin/page/environments',
          text: 'Environments',
          childName: 'assets',
        },
        {
          link: '/assets/discovered-assets',
          text: 'Discovered Assets',
          childName: 'assets',
        },
        {
          link: '/assets/monitored-assets',
          text: 'Monitored Assets',
          childName: 'assets',
        },
        {
          link: '/assets/org-unit',
          text: 'Org Unit',
          childName: 'assets',
        },
        {
          link: '/assets/custom-resources',
          text: 'Custom-Resources',
          childName: 'custom-resources',
        },
      ],
    },
    {
      link: '/import-module-pack',
      text: 'App Catalogue',
      cssClass: 'catalogue',
      childName: 'catalogue',
      isImplemented: true,
      subMenu: [
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/catalog',
          text: 'View And Search Catalogue ',
          childName: 'app-catalogue',
          isImplemented: true,
        },
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/library',
          text: 'Library',
          isImplemented: true,
          childName: 'metrics-library',
        },
        {
          link: '/import-module-pack',
          text: 'Import Assets From Module Pack ',
          childName: 'app-catalogue',
        },
        {
          link: '/create-module',
          text: 'Create Or Import Module Packs',
          childName: 'create-module',
        },
      ],
    },
    {
      link: '/plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
      text: 'Events',
      cssClass: 'events',
      isImplemented: true,
      childName: 'events',
      subMenu: [
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
          text: 'Dashboard',
          isImplemented: true,
          childName: 'alert-manager-dashboard',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/alertrulebuilder',
          text: 'New Alert Rule',
          isImplemented: true,
          childName: 'new-alert-rule',
        },
        {
          link: '/alerting/list',
          text: 'All Alert Rules',
          isImplemented: true,
          childName: 'all-alert-rule',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          text: 'Manage Alert Rule',
          isImplemented: true,
          childName: 'new-alert-rule',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/manageworkflow',
          text: 'Manage Workflows',
          childName: 'new-alert-rule',
        },
      ],
    },
    {
      link: '/analytics',
      text: 'Analytics',
      cssClass: 'metrics',
      childName: 'analytics',
      isImplemented: true,
      subMenu: [
        {
          link: '/dashboards',
          text: 'Manage Dashboards',
          childName: 'manage-dashboards',
          isImplemented: true,
        },
        {
          link: '/analytics',
          text: 'Manage Views',
          childName: 'analytics',
          isImplemented: true,
        },
      ],
    },
  ];

  opsCentral: any = [
    {
      link: '/plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
      text: 'Performance & Availability',
      cssClass: 'availability',
      isImplemented: true,
      childName: 'availability',
      subMenu: [
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
          text: 'Dashboard',
          isImplemented: true,
          childName: 'metrics-catalog',
        },
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/collectionview',
          text: 'Collection',
          isImplemented: true,
          childName: 'metrics-collection',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          text: 'Rule',
          isImplemented: true,
          childName: 'metrics-rule',
        },
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/preferences',
          text: 'Preferences',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/discovery',
          text: 'Discovery',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/view',
          text: 'View',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
      ],
    },
    {
      link: '/plugins/xformation-logmanager-ui-plugin/page/dashboard',
      text: 'Logs',
      cssClass: 'logs',
      isImplemented: true,
      childName: 'grafana-logs',
      subMenu: [
        {
          link: '/plugins/xformation-logmanager-ui-plugin/page/overview',
          text: 'Overview',
          childName: 'grafana-logs',
        },
        {
          link: '/plugins/xformation-logmanager-ui-plugin/page/dashboard',
          text: 'Dashboard',
          isImplemented: true,
          childName: 'grafana-logs',
        },
        {
          link: '/plugins/xformation-logmanager-ui-plugin/page/alerts',
          text: 'Alerts',
          childName: 'grafana-logs',
        },
        {
          link: '/plugins/xformation-logmanager-ui-plugin/page/preference',
          text: 'Preference',
          isImplemented: true,
          childName: 'grafana-logs',
        },
      ],
    },
    {
      link: '/plugins/xformation-compliancemanager-ui-plugin/page/dashboard',
      text: 'Compliance',
      cssClass: 'compliance',
      isImplemented: true,
      childName: 'compliance',
      subMenu: [
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/dashboard',
          text: 'Overview',
          isImplemented: true,
          childName: 'compliance-dashboard',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/compliancerulesets',
          text: 'Rulesets',
          isImplemented: true,
          childName: 'compliance-rulesets',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/gslbuilder',
          text: 'Rule Builder',
          isImplemented: true,
          childName: 'compliance-builder',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/audits',
          text: 'Audits',
          childName: 'compliance-builder',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/compliancepolicy',
          text: 'Policies',
          isImplemented: true,
          childName: 'compliance-policies',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/complianceremediation',
          text: 'Remediation',
          isImplemented: true,
          childName: 'compliance-remediation',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/complianceassessmenthistory',
          text: 'Assessment History',
          isImplemented: true,
          childName: 'compliance-assessment-history',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/complianceexclusions',
          text: 'Exclusions',
          isImplemented: true,
          childName: 'compliance-exclusions',
        },
        {
          link: '/plugins/xformation-compliancemanager-ui-plugin/page/preference',
          text: 'Preference',
          childName: 'compliance-preference',
        },
      ],
    },
    {
      link: '/plugins/xformation-servicedesk-ui-plugin/page/dashboard',
      text: 'Service desk',
      cssClass: 'tickets',
      isImplemented: true,
      childName: 'tickets',
      subMenu: [
        {
          link: '/plugins/xformation-servicedesk-ui-plugin/page/dashboard',
          text: 'Dashboard',
          isImplemented: true,
          childName: 'tickets-dashboard',
        },
        {
          link: '/plugins/xformation-servicedesk-ui-plugin/page/allcontacts',
          text: 'Contacts',
          isImplemented: true,
          childName: 'tickets-contacts',
        },
        {
          link: '/plugins/xformation-servicedesk-ui-plugin/page/allcompanies',
          text: 'Companies',
          isImplemented: true,
          childName: 'tickets-companies',
        },
        {
          link: '/plugins/xformation-servicedesk-ui-plugin/page/tickets',
          text: 'Reports',
          isImplemented: true,
          childName: 'tickets-reports',
        },
        {
          link: '/plugins/xformation-servicedesk-ui-plugin/page/opentickets',
          text: 'Preferences',
          isImplemented: true,
          childName: 'tickets-preferences',
        },
      ],
    },
    {
      link: '/automation',
      text: 'Automation',
      cssClass: 'automation',
      childName: 'automation',
    },
  ];

  devCentral: any = [
    {
      link: '/generators',
      text: 'Generators',
      cssClass: 'generator',
      childName: 'generators',
    },
    {
      link: '/delivery',
      text: 'Delivery',
      cssClass: 'delivery',
      childName: 'delivery',
    },
    {
      link: '/quality',
      text: 'Quality',
      cssClass: 'quality',
      childName: 'quality',
    },
    {
      link: '/test',
      text: 'Test',
      cssClass: 'test',
      childName: 'test',
    },
  ];

  diagnostics: any = [
    {
      link: '/change-manager',
      text: 'Change Manager',
      cssClass: 'generator',
      childName: 'change-manager',
    },
    {
      link: '/explorer',
      text: 'Explorer',
      cssClass: 'quality',
      childName: 'explorer',
    },
    {
      link: '/rca',
      text: 'RCA',
      cssClass: 'delivery',
      childName: 'rca',
    },
    {
      link: '/search-act',
      text: 'Search & Act',
      cssClass: 'generator',
      childName: 'search-act',
    },
    {
      link: '/script-manager',
      text: 'Script Manager',
      cssClass: 'test',
      childName: 'script-manager',
    },
    {
      link: '/optimizer',
      text: 'Optimizer',
      cssClass: 'delivery',
      childName: 'optimizer',
    },
    {
      link: '/migration-manager',
      text: 'Migration Manager',
      cssClass: 'generator',
      childName: 'migration-manager',
    },
  ];

  extra: any = [
    {
      link: '/preference',
      text: 'Preference',
      cssClass: 'preference',
      childName: 'preference',
    },
    // {
    //   link: '/plugins/xformation-rbac-ui-plugin/page/home',
    //   text: 'RBAC Settings',
    //   cssClass: 'diagnostic-settings',
    //   childName: 'rbac-settings',
    // },
    {
      link: '/resource',
      text: 'Resource',
      cssClass: 'resources',
      childName: 'rbac-settings',
    },
  ];

  onClickToggleSubMenu = (e: any) => {
    let { subMenuState, isSubMenuPinned } = this.state;
    const lastState = subMenuState;
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
    this.updateState(subMenuState, lastState);
    this.setState({
      subMenuState,
      isSubMenuPinned,
    });
  };

  setMenuStates = (subMenuNewState: any) => {
    let { subMenuState } = this.state;
    const lastState = subMenuState;
    this.updateState(subMenuNewState, lastState);
    this.setState({
      subMenuState: subMenuNewState,
    });
  };

  onClickLink = (e: any, menuItem: any) => {
    if (menuItem.isImplemented) {
      let isSubMenuPinned = false;
      const showSubMenu = menuItem && menuItem.subMenu && menuItem.subMenu.length > 0;
      this.setState({
        activeMenuItem: menuItem,
        showSubMenu: showSubMenu,
      });
      if (showSubMenu) {
        this.setMenuStates(menuStates.SUBMENU_OPEN);
        isSubMenuPinned = true;
      } else {
        this.setMenuStates(0);
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
        activeSubMenuItem: sMenuItem,
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
    getLocationSrv().update({ path: clickedMenuItem.link });
    this.setState({
      clickedMenuItem: {},
      showSubMenu: false,
    });
    this.setMenuStates(0);
  };

  createOpenMenu = (menuItems: any) => {
    const retItem: any = [];
    const { activeMenuItem } = this.state;
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i];
      const isActive = activeMenuItem.link === menuItem.link;
      retItem.push(
        <Rbac parentName="grafana-ui" childName={menuItem.childName || ''}>
          <li className="item">
            <a
              href={'#'}
              className={`menu-item ${isActive ? 'active' : ''}`}
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
    const { activeMenuItem } = this.state;
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i];
      let isActive = false;
      if (activeMenuItem) {
        isActive = activeMenuItem.link === menuItem.link;
      }
      retItem.push(
        <Rbac parentName="grafana-ui" childName={menuItem.childName || ''}>
          <li className="item" title={menuItem.text}>
            <a
              href={'#'}
              className={`menu-item ${isActive ? 'active' : ''}`}
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
    const { activeMenuItem, activeSubMenuItem } = this.state;
    const retData = [];
    if (activeMenuItem && activeMenuItem.subMenu && activeMenuItem.subMenu.length > 0) {
      for (let j = 0; j < activeMenuItem.subMenu.length; j++) {
        let isActive = false;
        if (activeSubMenuItem) {
          isActive = activeSubMenuItem.link === activeMenuItem.subMenu[j].link;
        }
        retData.push(
          <Rbac parentName="grafana-ui" childName={activeMenuItem.subMenu[j].childName || ''}>
            <li>
              <a
                className={`menu-item ${isActive ? 'active' : ''}`}
                href={activeMenuItem.subMenu[j].link}
                onClick={(e: any) => this.onClickSubLink(e, activeMenuItem.subMenu[j])}
              >
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
    const { activeMenuItem, activeSubMenuItem } = this.state;
    const retData = [];
    if (activeMenuItem && activeMenuItem.subMenu && activeMenuItem.subMenu.length > 0) {
      for (let j = 0; j < activeMenuItem.subMenu.length; j++) {
        if (activeSubMenuItem && activeSubMenuItem.link === activeMenuItem.subMenu[j].link) {
          retData.push(
            <Rbac parentName="grafana-ui" childName={activeMenuItem.subMenu[j].childName || ''}>
              <li>
                <div className="menu-item-text">{activeMenuItem.subMenu[j].text}</div>
              </li>
            </Rbac>
          );
          break;
        }
      }
    }
    return retData;
  };

  onMouseEnterClosedSubMenu = () => {
    this.setMenuStates(menuStates.SUBMENU_OPEN);
  };

  onMouseLeaveOpenedSubMenu = () => {
    const { isSubMenuPinned } = this.state;
    if (!isSubMenuPinned) {
      this.setMenuStates(menuStates.SUBMENU_CLOSE);
    }
  };

  collapseMainMenu = (index: any) => {
    const { collapsedMenus } = this.state;
    collapsedMenus[index] = !collapsedMenus[index];
    this.setState({
      collapsedMenus: [...collapsedMenus],
      index,
    });
  };

  render() {
    const { showSubMenu, isSubMenuPinned, collapsedMenus } = this.state;
    return (
      <div className="menu-item-container">
        <Scrollbars autoHide>
          <div className="main-menu">
            <div className="sidemenu-search-container"></div>
            <ul className="m-0">{this.createCloseMenu(this.mainMenu)}</ul>

            <div className="menu-item-header" onClick={() => this.collapseMainMenu(0)}>
              OPS
              <br />
              CENTRAL
              <br />
              <i className={`fa ${!collapsedMenus[0] ? 'fa-arrow-circle-right' : 'fa-arrow-circle-down'}`}></i>
            </div>
            <ul className={`m-0 main-menu-items ${!collapsedMenus[0] ? 'main-menu-collapsed' : ''}`}>
              {this.createCloseMenu(this.opsCentral)}
            </ul>

            <div className="menu-item-header" onClick={() => this.collapseMainMenu(1)}>
              DEV
              <br />
              CENTRAL
              <br />
              <i className={`fa ${!collapsedMenus[1] ? 'fa-arrow-circle-right' : 'fa-arrow-circle-down'}`}></i>
            </div>
            <ul className={`m-0 main-menu-items ${!collapsedMenus[1] ? 'main-menu-collapsed' : ''}`}>
              {this.createCloseMenu(this.devCentral)}
            </ul>

            <div className="menu-item-header" onClick={() => this.collapseMainMenu(2)}>
              TOOLS &amp;
              <br />
              DIAGNOSTICS
              <br />
              <i className={`fa ${!collapsedMenus[2] ? 'fa-arrow-circle-right' : 'fa-arrow-circle-down'}`}></i>
            </div>
            <ul className={`m-0 main-menu-items ${!collapsedMenus[2] ? 'main-menu-collapsed' : ''}`}>
              {this.createCloseMenu(this.diagnostics)}
            </ul>

            <ul className="m-0">{this.createCloseMenu(this.extra)}</ul>
          </div>
        </Scrollbars>
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
      </div>
    );
  }
}
