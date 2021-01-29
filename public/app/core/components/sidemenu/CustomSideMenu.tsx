import React, { PureComponent } from 'react';
import { CustomMenuModal } from './CustomMenuModal';
import { getLocationSrv } from '@grafana/runtime';
import Rbac from './Rbac';

const menuStates: any = {
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
    // let isActive = false;
    let subMenuState = 0;
    let showSubMenu = false;
    let activeMenuItem = null;
    let isSubMenuPinned = false;
    if (pathName === '/') {
      this.setState({
        activeMenuLink: '/',
      });
      return {
        subMenuState,
        showSubMenu,
        activeMenuItem,
        isSubMenuPinned,
      };
    }
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
    for (let i = 0; i < totalItem; i++) {
      const item = menuList[i];
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
              showSubMenu = true;
              isSubMenuPinned = true;
              break;
            }
          }
        }
        // isActive = true;
        activeMenuItem = item;
        isFound = true;
        break;
      }
    }
    return {
      subMenuState,
      showSubMenu,
      activeMenuItem,
      isSubMenuPinned,
      isFound,
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
    this.updateState(menuData.subMenuState, -1);
    this.setState({
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
      link: '/assets',
      text: 'Assets',
      cssClass: 'assets',
      activeLink: '/assets',
      childName: 'assets',
      isImplemented: true,
      subMenu: [
        {
          link: '/environments',
          text: 'Environments',
          activeSLink: '/environments',
          activeLink: '/environments',
          childName: 'assets',
        },
        {
          link: '/discovered-assets',
          text: 'Discovered Assets',
          activeSLink: '/discovered-assets',
          activeLink: '/discovered-assets',
          childName: 'assets',
        },
        {
          link: '/monitored-assets',
          text: 'Monitored Assets',
          activeSLink: '/monitored-assets',
          activeLink: '/monitored-assets',
          childName: 'assets',
        },
        {
          link: '/org-unit',
          text: 'Org Unit',
          activeSLink: '/org-unit',
          activeLink: '/org-unit',
          childName: 'assets',
        },
        {
          link: '/custom-resources',
          text: 'Custom-Resources',
          cssClass: 'workbooks',
          activeLink: '/custom-resources',
          childName: 'custom-resources',
        },
      ],
    },
    {
      link: '/import-assets',
      text: 'App Catalogue',
      cssClass: 'catalogue',
      activeLink: '/import-assets',
      childName: 'catalogue',
      tempLink: 'plugins/xformation-perfmanager-ui-plugin/page/catalog',
      isImplemented: true,
      subMenu: [
        {
          link: '/plugins/xformation-perfmanager-ui-plugin/page/catalog',
          text: 'View And Search Catalogue ',
          activeSLink: '/plugins/xformation-perfmanager-ui-plugin/page/catalog',
          activeLink: '/plugins/xformation-perfmanager-ui-plugin',
          childName: 'app-catalogue',
          isImplemented: true,
        },
        {
          link: '/import-assets',
          text: 'Import Assets From Module Pack ',
          activeSLink: '/import-assets',
          activeLink: '/import-assets',
          childName: 'app-catalogue',
        },
        {
          link: '/create-module',
          text: 'Create Or Import Module Packs',
          activeSLink: '/create-module',
          activeLink: '/create-module',
          childName: 'create-module',
        },
      ],
    },
    {
      link: '/plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
      text: 'Events',
      cssClass: 'events',
      activeLink: 'plugins/xformation-alertmanager-ui-plugin',
      tempLink: 'alerting/list',
      isImplemented: true,
      childName: 'events',
      subMenu: [
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
          text: 'Dashboard',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/monitoralerts',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          isImplemented: true,
          childName: 'alert-manager-dashboard',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/alertrulebuilder',
          text: 'New Alert Rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/alertrulebuilder',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          isImplemented: true,
          childName: 'new-alert-rule',
        },
        {
          link: '/alerting/list',
          text: 'All Alert Rules',
          activeSLink: 'alerting/list',
          activeLink: 'alerting/list',
          isImplemented: true,
          childName: 'all-alert-rule',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          text: 'Manage Alert Rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          isImplemented: true,
          childName: 'new-alert-rule',
        },
        {
          link: '/plugins/xformation-alertmanager-ui-plugin/page/manageworkflow',
          text: 'Manage Workflows',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/manageworkflow',
          activeLink: 'plugins/xformation-alertmanager-ui-plugin',
          childName: 'new-alert-rule',
        },
      ],
    },
    {
      link: '/analytics',
      text: 'Analytics',
      cssClass: 'metrics',
      activeLink: '/analytics',
      childName: 'analytics',
      tempLink: 'dashboards',
      isImplemented: true,
      subMenu: [
        {
          link: '/dashboards',
          text: 'Manage Dashboards',
          activeSLink: '/dashboards',
          activeLink: '/analytics',
          childName: 'manage-dashboards',
          isImplemented: true,
        },
        {
          link: '/analytics',
          text: 'Manage Views',
          activeSLink: '/analytics',
          activeLink: '/analytics',
          childName: 'analytics',
          isImplemented: true,
        },
      ],
    },
  ];

  opsCentral: any = [
    {
      link: 'plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
      text: 'Performance & Availability',
      cssClass: 'availability',
      activeLink: 'plugins/xformation-perfmanager-ui-plugin',
      isImplemented: true,
      childName: 'availability',
      subMenu: [
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
          text: 'Dashboard',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/managedashboard',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-catalog',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/library',
          text: 'Library',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/library',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-library',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/collectionview',
          text: 'Collection',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/collectionview',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-collection',
        },
        {
          link: 'plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          text: 'Rule',
          activeSLink: 'plugins/xformation-alertmanager-ui-plugin/page/managealertrule',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-rule',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/preferences',
          text: 'Preferences',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/preferences',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/discovery',
          text: 'Discovery',
          activeSLink: 'plugins/xformation-perfmanager-ui-plugin/page/discovery',
          activeLink: 'plugins/xformation-perfmanager-ui-plugin',
          isImplemented: true,
          childName: 'metrics-preferences',
        },
        {
          link: 'plugins/xformation-perfmanager-ui-plugin/page/view',
          text: 'View',
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
      subMenu: [
        {
          link: 'plugins/xformation-logmanager-ui-plugin/page/overview',
          text: 'Overview',
          activeSLink: 'plugins/xformation-logmanager-ui-plugin/page/overview',
          activeLink: 'plugins/xformation-logmanager-ui-plugin',
          childName: 'grafana-logs',
        },
        {
          link: 'plugins/xformation-logmanager-ui-plugin/page/dashboard',
          text: 'Dashboard',
          activeSLink: 'plugins/xformation-logmanager-ui-plugin/page/dashboard',
          activeLink: 'plugins/xformation-logmanager-ui-plugin',
          isImplemented: true,
          childName: 'grafana-logs',
        },
        {
          link: 'plugins/xformation-logmanager-ui-plugin/page/alerts',
          text: 'Alerts',
          activeSLink: 'plugins/xformation-logmanager-ui-plugin/page/alerts',
          activeLink: 'plugins/xformation-logmanager-ui-plugin',
          childName: 'grafana-logs',
        },
        {
          link: 'plugins/xformation-logmanager-ui-plugin/page/preference',
          text: 'Preference',
          activeSLink: 'plugins/xformation-logmanager-ui-plugin/page/preference',
          activeLink: 'plugins/xformation-logmanager-ui-plugin',
          isImplemented: true,
          childName: 'grafana-logs',
        },
      ],
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
          text: 'Overview',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/dashboard',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-dashboard',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancerulesets',
          text: 'Rulesets',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancerulesets',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-rulesets',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/gslbuilder',
          text: 'Rule Builder',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/gslbuilder',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-builder',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/audits',
          text: 'Audits',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/audits',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          childName: 'compliance-builder',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancepolicy',
          text: 'Policies',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/compliancepolicy',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-policies',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceremediation',
          text: 'Remediation',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceremediation',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-remediation',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceassessmenthistory',
          text: 'Assessment History',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceassessmenthistory',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-assessment-history',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceexclusions',
          text: 'Exclusions',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/complianceexclusions',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          isImplemented: true,
          childName: 'compliance-exclusions',
        },
        {
          link: 'plugins/xformation-compliancemanager-ui-plugin/page/preference',
          text: 'Preference',
          activeSLink: 'plugins/xformation-compliancemanager-ui-plugin/page/preference',
          activeLink: 'plugins/xformation-compliancemanager-ui-plugin',
          childName: 'compliance-preference',
        },
      ],
    },
    {
      link: 'plugins/xformation-servicedesk-ui-plugin/page/dashboard',
      text: 'Service desk',
      cssClass: 'tickets',
      activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
      isImplemented: true,
      childName: 'tickets',
      subMenu: [
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/dashboard',
          text: 'Dashboard',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/dashboard',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-dashboard',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/allcontacts',
          text: 'Contacts',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/allcontacts',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-contacts',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/allcompanies',
          text: 'Companies',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/allcompanies',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-companies',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/tickets',
          text: 'Reports',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/tickets',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-reports',
        },
        {
          link: 'plugins/xformation-servicedesk-ui-plugin/page/opentickets',
          text: 'Preferences',
          activeSLink: 'plugins/xformation-servicedesk-ui-plugin/page/opentickets',
          activeLink: 'plugins/xformation-servicedesk-ui-plugin/',
          isImplemented: true,
          childName: 'tickets-preferences',
        },
      ],
    },
    {
      link: '/automation',
      text: 'Automation',
      cssClass: 'automation',
      activeLink: '/automation',
      childName: 'automation',
    },
  ];

  devCentral: any = [
    {
      link: '/generators',
      text: 'Generators',
      cssClass: 'generator',
      activeLink: '/generators',
      childName: 'generators',
    },
    {
      link: '/delivery',
      text: 'Delivery',
      cssClass: 'delivery',
      activeLink: '/delivery',
      childName: 'delivery',
    },
    {
      link: '/quality',
      text: 'Quality',
      cssClass: 'quality',
      activeLink: '/quality',
      childName: 'quality',
    },
    {
      link: '/test',
      text: 'Test',
      cssClass: 'test',
      activeLink: '/test',
      childName: 'test',
    },
  ];

  diagnostics: any = [
    {
      link: '/change-manager',
      text: 'Change Manager',
      cssClass: 'generator',
      activeLink: '/change-manager',
      childName: 'change-manager',
    },
    {
      link: '/explorer',
      text: 'Explorer',
      cssClass: 'quality',
      activeLink: '/explorer',
      childName: 'explorer',
    },
    {
      link: '/rca',
      text: 'RCA',
      cssClass: 'delivery',
      activeLink: '/rca',
      childName: 'rca',
    },
    {
      link: '/search-act',
      text: 'Search & Act',
      cssClass: 'generator',
      activeLink: '/search-act',
      childName: 'search-act',
    },
    {
      link: '/script-manager',
      text: 'Script Manager',
      cssClass: 'test',
      activeLink: '/script-manager',
      childName: 'script-manager',
    },
    {
      link: '/optimizer',
      text: 'Optimizer',
      cssClass: 'delivery',
      activeLink: '/optimizer',
      childName: 'optimizer',
    },
    {
      link: '/migration-manager',
      text: 'Migration Manager',
      cssClass: 'generator',
      activeLink: '/migration-manager',
      childName: 'migration-manager',
    },
  ];

  extra: any = [
    {
      link: '/preference',
      text: 'Preference',
      cssClass: 'preference',
      activeLink: '/preference',
      childName: 'preference',
    },
    // {
    //   link: '/plugins/xformation-rbac-ui-plugin/page/home',
    //   text: 'RBAC Settings',
    //   cssClass: 'diagnostic-settings',
    //   activeSLink: '/plugins/xformation-rbac-ui-plugin/page/home',
    //   activeLink: '/plugins/xformation-rbac-ui-plugin',
    //   childName: 'rbac-settings',
    // },
    {
      link: '/resource',
      text: 'Resource',
      cssClass: 'diagnostic-settings',
      activeSLink: '/resource',
      activeLink: '/plugins/xformation-rbac-ui-plugin',
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
        activeMenuLink: menuItem.activeLink,
        activeSubMenuLink: menuItem.activeLink,
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
    this.setMenuStates(0);
  };

  createOpenMenu = (menuItems: any) => {
    const retItem: any = [];
    const { activeMenuLink } = this.state;
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i];
      const isActive = activeMenuLink === menuItem.activeLink || activeMenuLink === menuItem.tempLink;
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
    const { activeMenuLink } = this.state;
    for (let i = 0; i < menuItems.length; i++) {
      const menuItem = menuItems[i];
      const isActive = activeMenuLink === menuItem.activeLink || activeMenuLink === menuItem.tempLink;
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
        if (activeSubMenuLink === activeMenuItem.subMenu[j].activeSLink) {
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
