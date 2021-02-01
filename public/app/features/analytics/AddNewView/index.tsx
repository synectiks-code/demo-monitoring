// Libraries
import React from 'react';
import { CustomNavigationBar } from 'app/core/components/CustomNav';
import { Collapse } from 'reactstrap';
import { getLocationSrv } from '@grafana/runtime';
import { UncontrolledPopover, PopoverBody } from 'reactstrap';
import { backendSrv } from 'app/core/services/backend_srv';
import { getTagColorsFromName } from '@grafana/ui';
import { SortPicker } from 'app/core/components/Select/SortPicker';
import { TagFilter } from 'app/core/components/TagFilter/TagFilter';
import { Checkbox } from '@grafana/ui';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';
import ViewNewView from './ViewNewView';

export interface Props {
  $scope: any;
  $injector: any;
}

class AddNewView extends React.Component<any, any> {
  showStarredFilter: any;
  breadCrumbs: any = [
    {
      label: 'Home',
      route: '',
    },
    {
      label: 'Analytics | View',
      isCurrentPage: true,
    },
  ];

  tagsPromiseResolve: any;
  viewRef: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      tabs: [
        {
          label: 'New Tab',
          isEdit: false,
          dashboardList: [],
        },
      ],
      folderArray: [],
      activeTab: 0,
      isPreviewEnabled: false,
      selectedDashboards: [],
      isStarred: false,
      filterData: [
        {
          isStarred: false,
          selectedTags: [],
          sortValue: 'alpha-asc',
          searchKey: '',
        },
      ],
      showView: false,
      viewName: '',
      description: '',
    };
    this.viewRef = React.createRef();
  }

  componentDidMount() {
    let viewData: any = localStorage.getItem('viewData');
    if (viewData) {
      viewData = JSON.parse(viewData);
      this.setState({
        viewName: viewData.viewName,
        description: viewData.description,
      });
    } else {
      getLocationSrv().update({ path: '/analytics' });
      return;
    }
    const sendData = {
      tags: [],
    };
    this.getSearchData(sendData, true);
  }

  getSearchData = (data: any, isFirstTime: any) => {
    backendSrv.search(data).then((result: any) => {
      const retData = this.manipulateData(result, isFirstTime);
      const { tabs, activeTab } = this.state;
      if (tabs[activeTab]) {
        tabs[activeTab].dashboardList = JSON.parse(JSON.stringify(retData));
      }
      if (isFirstTime) {
        this.setState({
          folderArray: JSON.parse(JSON.stringify(retData)),
        });
      }
      this.setState({
        tabs,
      });
    });
  };

  manipulateData(result: any, isFirstTime: any) {
    const retData: any = {};
    let tagList = [];
    for (let i = 0; i < result.length; i++) {
      const dash = result[i];
      dash.checkValue = false;
      if (dash.type === 'dash-db') {
        retData[dash.folderId] = retData[dash.folderId] || { subData: [] };
        retData[dash.folderId].title = dash.folderTitle;
        retData[dash.folderId].folderId = dash.folderId;
        retData[dash.folderId].checkValueStatus = false;
        retData[dash.folderId].openSubFolder = false;
        retData[dash.folderId].subData.push(dash);
      }
      if (dash.tags.length > 0 && isFirstTime) {
        for (let i = 0; i < dash.tags.length; i++) {
          let row = dash.tags[i];
          tagList.push({
            term: row,
            count: i + 1,
          });
        }
      }
    }
    let keys = Object.keys(retData);
    let folders: any = [];
    for (let i = 0; i < keys.length; i++) {
      folders.push(retData[keys[i]]);
    }
    isFirstTime && this.tagsPromiseResolve && this.tagsPromiseResolve(tagList);
    return folders;
  }

  editTabTitle = (index: any) => {
    const { tabs } = this.state;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].isEdit = true;
      }
    }
    this.setState({
      tabs,
    });
  };

  handleStateChange = (e: any, index: any) => {
    const { tabs } = this.state;
    const { value } = e.target;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].label = value;
      }
    }
    this.setState({
      tabs,
    });
  };

  displayTabs = () => {
    const { tabs, activeTab } = this.state;
    const retData = [];
    for (let i = 0; i < tabs.length; i++) {
      let tab = tabs[i];
      retData.push(
        <li key={`tab-${i}`} className={`nav-item `}>
          <a className={i === activeTab ? 'nav-link active' : 'nav-link'}>
            {!tab.isEdit && <span onClick={e => this.navigateTab(i)}>{tab.label}</span>}
            {!tab.isEdit && <i className="fa fa-angle-down" id={`PopoverFocus-${i}`}></i>}
            {tab.isEdit && (
              <input
                type="text"
                className="form-control tab-edit"
                value={tab.label}
                name="title"
                onChange={e => this.handleStateChange(e, i)}
                onBlur={() => this.onFocusOutTitle(i)}
              />
            )}
          </a>
          {!tab.isEdit && (
            <UncontrolledPopover trigger="legacy" className="popup-btn" placement="bottom" target={`PopoverFocus-${i}`}>
              <PopoverBody>
                <ul>
                  <li onClick={() => this.editTabTitle(i)}>
                    <a href="#">
                      <i className="fa fa-edit"></i>
                      Rename Tab
                    </a>
                  </li>
                  {i !== tabs.length - 1 && (
                    <li onClick={() => this.moveArrayPosition(i, i + 1)}>
                      <a href="#">
                        <i className="fa fa-caret-right"></i>
                        Move Right
                      </a>
                    </li>
                  )}
                  {i !== 0 && (
                    <li onClick={() => this.moveArrayPosition(i, i - 1)}>
                      <a href="#">
                        <i className="fa fa-caret-left"></i>
                        Move Left
                      </a>
                    </li>
                  )}
                  <li onClick={() => this.deleteTabData(i)}>
                    <a href="#">
                      <i className="fa fa-trash"></i>
                      Delete
                    </a>
                  </li>
                </ul>
              </PopoverBody>
            </UncontrolledPopover>
          )}
        </li>
      );
    }
    return retData;
  };

  moveArrayPosition = (fromIndex: any, toIndex: any) => {
    const { tabs } = this.state;
    var element = tabs[fromIndex];
    tabs.splice(fromIndex, 1);
    tabs.splice(toIndex, 0, element);
    this.setState({
      tabs,
    });
  };

  onFocusOutTitle = (index: any) => {
    const { tabs } = this.state;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].isEdit = false;
      }
    }
    this.setState({
      tabs,
    });
  };

  deleteTabData = (index: any) => {
    const { tabs, filterData, selectedDashboards } = this.state;
    tabs.splice(index, 1);
    filterData.splice(index, 1);
    selectedDashboards.splice(index, 1);
    this.setState({
      tabs,
      filterData,
      activeTab: tabs.length - 1,
    });
  };

  navigateTab(index: any) {
    this.setState({
      activeTab: index,
    });
  }

  addTab = () => {
    const { tabs, folderArray, filterData, selectedDashboards } = this.state;
    const length = tabs.length;
    selectedDashboards.push([]);
    tabs.push({
      label: 'New Tab' + ' ' + (length + 1),
      isEdit: false,
      dashboardList: JSON.parse(JSON.stringify(folderArray)),
    });
    filterData.push({
      isStarred: false,
      selectedTags: [],
      sortValue: 'alpha-asc',
      searchKey: '',
    });
    this.setState({
      tabs,
      activeTab: length,
      isPreviewEnabled: false,
      selectedDashboards,
    });
  };

  onClickChildCheckbox = (parentIndex: any, childIndex: any) => {
    let countCheckedCheckbox = 0;
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
      const parentCheckbox = dashboardList[parentIndex];
      parentCheckbox.subData[childIndex].checkValue = !parentCheckbox.subData[childIndex].checkValue;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        if (parentCheckbox.subData[j].checkValue === true) {
          countCheckedCheckbox++;
        } else {
          countCheckedCheckbox--;
        }
      }
      parentCheckbox.checkValueStatus = countCheckedCheckbox === parentCheckbox.subData.length;
      this.checkForEnabled(tabs);
      this.setState({
        tabs,
      });
    }
  };

  onClickOpenSubFolder = (index: any) => {
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
      dashboardList[index].openSubFolder = !dashboardList[index].openSubFolder;
      this.setState({
        tabs,
      });
    }
  };

  onChangeParentCheckbox = (e: any, index: any) => {
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
      const parentCheckbox = dashboardList[index];
      const checked = e.target.checked;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        parentCheckbox.subData[j].checkValue = checked;
        parentCheckbox.checkValueStatus = checked;
      }
      this.checkForEnabled(tabs);
      this.setState({
        tabs,
      });
    }
  };

  checkForEnabled = (tabs: any) => {
    let isPreviewEnabled = true;
    let selectedDashboards = [];
    for (let i = 0; i < tabs.length; i++) {
      const dashboardList = tabs[i].dashboardList;
      let isAnyDashboardSelected = false;
      let selectedDashboardsForTab = [];
      for (let j = 0; j < dashboardList.length; j++) {
        const subData = dashboardList[j].subData;
        for (let k = 0; k < subData.length; k++) {
          if (subData[k].checkValue) {
            isAnyDashboardSelected = true;
            selectedDashboardsForTab.push(subData[k].title);
          }
        }
      }
      isPreviewEnabled = isPreviewEnabled && isAnyDashboardSelected;
      selectedDashboards.push(selectedDashboardsForTab);
    }
    this.setState({
      isPreviewEnabled,
      selectedDashboards,
    });
  };

  renderDashboardTree = () => {
    const retData = [];
    const { tabs, activeTab } = this.state;
    if (tabs[activeTab]) {
      const dashboardList = tabs[activeTab].dashboardList;
      const length = dashboardList.length;
      for (let i = 0; i < length; i++) {
        const folder = dashboardList[i];
        const subFolders = folder.subData;
        const subFolderJSX = [];
        for (let j = 0; j < subFolders.length; j++) {
          const attribute = subFolders[j].tags;
          const subAttributeFolder = [];
          if (attribute) {
            for (let k = 0; k < attribute.length; k++) {
              const subAtt = attribute[k];
              const color = getTagColorsFromName(subAtt);
              subAttributeFolder.push(
                <div className={`tag`} style={{ backgroundColor: color.color }}>
                  {subAtt}
                </div>
              );
            }
          }
          const subFolder = subFolders[j];
          subFolderJSX.push(
            <tr>
              <td>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={subFolder.checkValue}
                  onClick={() => this.onClickChildCheckbox(i, j)}
                />
                <span>{subFolder.title}</span>
              </td>
              <td>
                <div className="d-block text-right">{subAttributeFolder}</div>
              </td>
            </tr>
          );
        }
        retData.push(
          <div>
            <div className="general-heading">
              <input
                type="checkbox"
                checked={folder.checkValueStatus}
                onChange={e => this.onChangeParentCheckbox(e, i)}
                className="checkbox"
              />
              <span onClick={() => this.onClickOpenSubFolder(i)}>
                <img src="/public/img/open-folder.png" alt="" />
              </span>
              <h4>{folder.title}</h4>
            </div>
            <Collapse isOpen={folder.openSubFolder}>
              <div className="general-logs">
                <div className="general-logs-inner">
                  <table className="data-table">{subFolderJSX}</table>
                </div>
              </div>
            </Collapse>
          </div>
        );
      }
    }
    return retData;
  };

  sendData = () => {
    // const { tabs } = this.state;
    // localStorage.setItem('newdashboarddata', JSON.stringify(tabs));
    // getLocationSrv().update({ path: '/analytics/new/dashboard' });
    const viewData = {
      viewName: this.state.viewName,
      description: this.state.description,
    };
    this.viewRef.current.setData(this.state.tabs, viewData);
    this.setState({
      showView: true,
    });
  };

  renderSelectedDashboardInLeftSide = () => {
    const { selectedDashboards, activeTab } = this.state;
    const retData = [];
    if (selectedDashboards[activeTab]) {
      const selectedDashboardsForTab = selectedDashboards[activeTab];
      for (let i = 0; i < selectedDashboardsForTab.length; i++) {
        retData.push(
          <li key={`left-side-dash-name-${i}`}>
            <a href="javascript: void(0)">
              <i className="fa fa-ellipsis-h"></i>
              <span>{selectedDashboardsForTab[i]}</span>
            </a>
          </li>
        );
      }
    }
    return retData;
  };

  getTagOptions = () => {
    return new Promise<any>((resolve, reject) => {
      this.tagsPromiseResolve = resolve;
    });
  };

  onTagFilterChange = (tags: any) => {
    const { filterData, activeTab } = this.state;
    const { searchKey, isStarred, sortValue } = filterData[activeTab];
    filterData[activeTab].selectedTags = tags;
    this.setState({
      filterData,
    });
    const sendData = {
      tag: tags,
      sort: sortValue,
      starred: isStarred,
      query: searchKey,
    };
    this.getSearchData(sendData, false);
  };

  onSortChange = (sortvalue: any) => {
    const { filterData, activeTab } = this.state;
    const { searchKey, isStarred, selectedTags } = filterData[activeTab];
    filterData[activeTab].sortValue = sortvalue.value;
    this.setState({
      filterData,
    });
    const sendData = {
      tag: selectedTags,
      sort: sortvalue.value,
      starred: isStarred,
      query: searchKey,
    };
    this.getSearchData(sendData, false);
  };

  onStarredFilterChange = (e: any) => {
    const { activeTab, filterData } = this.state;
    filterData[activeTab].isStarred = e.target.checked;
    const { searchKey, selectedTags, sortValue } = filterData[activeTab];
    this.setState({
      filterData,
    });
    const sendData = {
      tag: selectedTags,
      sort: sortValue,
      starred: e.target.checked,
      query: searchKey,
    };
    this.getSearchData(sendData, false);
  };

  onQueryChange = (search: any) => {
    const { activeTab, filterData } = this.state;
    filterData[activeTab].searchKey = search;
    const { isStarred, selectedTags, sortValue } = filterData[activeTab];
    this.setState({
      filterData,
    });
    const sendData = {
      tag: selectedTags,
      sort: sortValue,
      starred: isStarred,
      query: search,
    };
    this.getSearchData(sendData, false);
  };

  hideDashboardView = () => {
    this.setState({
      showView: false,
    });
  };

  render() {
    const breadCrumbs = this.breadCrumbs;
    const pageTitle = 'ANALYTICS';
    const { isPreviewEnabled, filterData, activeTab, showView, viewName } = this.state;
    const { isStarred, searchKey, selectedTags, sortValue } = filterData[activeTab];
    return (
      <React.Fragment>
        <div style={{ display: `${showView ? 'none' : 'block'}` }}>
          <CustomNavigationBar />
          <div className="scroll-canvas--dashboard monitor-main-body">
            <div className="breadcrumbs-container">
              {pageTitle && <div className="page-title">{pageTitle}</div>}
              <div className="breadcrumbs">
                {breadCrumbs.map((breadcrumb: any, index: any) => {
                  if (breadcrumb.isCurrentPage) {
                    return (
                      <span key={index} className="current-page">
                        {breadcrumb.label}
                      </span>
                    );
                  } else {
                    return (
                      <React.Fragment key={index}>
                        <a className="breadcrumbs-link">{breadcrumb.label}</a>
                        <span className="separator">
                          <i className="fa fa-chevron-right"></i>
                        </span>
                      </React.Fragment>
                    );
                  }
                })}
              </div>
            </div>
            <div className="analytics-container">
              <div className="analytics-heading-container">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <h4 style={{ lineHeight: '36px' }}>{viewName}</h4>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="d-block text-right">
                      <button
                        className="analytics-white-button min-width-auto m-r-0"
                        onClick={() => getLocationSrv().update({ path: '/analytics' })}
                      >
                        <i className="fa fa-arrow-circle-left"></i>
                        &nbsp;&nbsp;Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="analytics-tabs-container">
                <ul className="nav nav-tabs">
                  {this.displayTabs()}
                  <li className="nav-item" onClick={this.addTab}>
                    <a className="nav-link add-tab">
                      <i className="fa fa-plus"></i>
                    </a>
                  </li>
                </ul>
                <div className="analytics-tabs-section-container">
                  <div className="tabs-left-section">
                    <h5>New Tab</h5>
                    <ul>{this.renderSelectedDashboardInLeftSide()}</ul>
                  </div>
                  <div className="tabs-right-section">
                    <div className="manage-dashboard-search">
                      <div className="row" style={{ alignItems: 'center' }}>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                          <div className="form-group search-control-group">
                            <FilterInput
                              labelClassName="gf-form--has-input-icon"
                              inputClassName="gf-form-input"
                              value={searchKey}
                              onChange={this.onQueryChange}
                              placeholder={'Search dashboards by name'}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 tag-filter-container">
                          <TagFilter
                            isClearable
                            tags={selectedTags}
                            tagOptions={this.getTagOptions}
                            onChange={this.onTagFilterChange}
                          />
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12">
                          <Checkbox label="Filter by starred" onChange={this.onStarredFilterChange} value={isStarred} />
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 sort-container">
                          <SortPicker onChange={this.onSortChange} value={sortValue} />
                        </div>
                      </div>
                    </div>
                    <div className="manage-dashboard-general">{this.renderDashboardTree()}</div>
                    {isPreviewEnabled && (
                      <div className="text-right">
                        <button className="analytics-blue-button" onClick={this.sendData}>
                          Preview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: `${showView ? 'block' : 'none'}` }}>
          <ViewNewView
            ref={this.viewRef}
            $scope={this.props.$scope}
            hidedashboardView={this.hideDashboardView}
            $injector={this.props.$injector}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AddNewView;
