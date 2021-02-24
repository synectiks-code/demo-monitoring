import * as React from 'react';
import { Collapse } from 'reactstrap';
//import { config } from './../config';
//import { RestService } from './_service/RestService';
import { UnimplementedFeaturePopup } from './components/UnimplementedFeaturePopup';
import { NewDashboard } from './NewDashboard';
import { getTagColorsFromName } from '@grafana/ui';
import { backendSrv } from 'app/core/services/backend_srv';
import { SortPicker } from 'app/core/components/Select/SortPicker';
import { TagFilter } from 'app/core/components/TagFilter/TagFilter';
import { Checkbox } from '@grafana/ui';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';

export class ManageTab extends React.Component<any, any> {
  unimplementedFeatureModalRef: any;
  tagsPromiseResolve: any;
  constructor(props: any) {
    super(props);
    this.state = {
      folderArray: [],
      showNewDashboardPopup: false,
      isStarred: false,
      selectedTags: [],
      sortValue: 'alpha-asc',
      searchKey: '',
    };
    this.unimplementedFeatureModalRef = React.createRef();
  }

  componentDidMount() {
    const sendData = {
      tags: [],
    };
    this.getSearchData(sendData);
  }

  onClickUnImplementedFeature = (link: any) => {
    this.unimplementedFeatureModalRef.current.setLink(link);
    this.unimplementedFeatureModalRef.current.toggle();
  };

  toggleNewDashPopup = () => {
    this.setState({
      showNewDashboardPopup: !this.state.showNewDashboardPopup,
    });
  };

  manipulateData(result: any) {
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
      if (dash.tags.length > 0) {
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
    this.tagsPromiseResolve && this.tagsPromiseResolve(tagList);
    return folders;
  }

  getSearchData = (data: any) => {
    backendSrv.search(data).then((result: any) => {
      const retData = this.manipulateData(result);
      this.setState({
        folderArray: JSON.parse(JSON.stringify(retData)),
      });
    });
  };

  onClickChildCheckbox = (parentIndex: any, childIndex: any) => {
    let countCheckedCheckbox = 0;
    const { folderArray } = this.state;
    if (folderArray) {
      const parentCheckbox = folderArray[parentIndex];
      parentCheckbox.subData[childIndex].checkValue = !parentCheckbox.subData[childIndex].checkValue;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        if (parentCheckbox.subData[j].checkValue === true) {
          countCheckedCheckbox++;
        } else {
          countCheckedCheckbox--;
        }
      }
      parentCheckbox.checkValueStatus = countCheckedCheckbox === parentCheckbox.subData.length;
      this.setState({
        folderArray,
      });
    }
  };

  onChangeParentCheckbox = (e: any, index: any) => {
    const { folderArray } = this.state;
    if (folderArray) {
      const parentCheckbox = folderArray[index];
      const checked = e.target.checked;
      for (let j = 0; j < parentCheckbox.subData.length; j++) {
        parentCheckbox.subData[j].checkValue = checked;
        parentCheckbox.checkValueStatus = checked;
      }
      this.setState({
        folderArray,
      });
    }
  };

  onClickOpenSubFolder = (index: any) => {
    const { folderArray } = this.state;
    if (folderArray) {
      folderArray[index].openSubFolder = !folderArray[index].openSubFolder;
      this.setState({
        folderArray,
      });
    }
  };

  renderDashboardTree = () => {
    const retData = [];
    const { folderArray } = this.state;
    if (folderArray) {
      const length = folderArray.length;
      for (let i = 0; i < length; i++) {
        const folder = folderArray[i];
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

  onQueryChange = (search: any) => {
    const { isStarred, selectedTags, sortValue } = this.state;
    this.setState({
      searchKey: search,
    });
    const sendData = {
      tag: selectedTags,
      sort: sortValue,
      starred: isStarred,
      query: search,
    };
    this.getSearchData(sendData);
  };

  onTagFilterChange = (tags: any) => {
    const { searchKey, isStarred, sortValue } = this.state;
    this.setState({
      selectedTags: tags,
    });
    const sendData = {
      tag: tags,
      sort: sortValue,
      starred: isStarred,
      query: searchKey,
    };
    this.getSearchData(sendData);
  };

  onSortChange = (sortvalue: any) => {
    const { searchKey, isStarred, selectedTags } = this.state;
    this.setState({
      sortValue: sortvalue.value,
    });
    const sendData = {
      tag: selectedTags,
      sort: sortvalue.value,
      starred: isStarred,
      query: searchKey,
    };
    this.getSearchData(sendData);
  };

  onStarredFilterChange = (e: any) => {
    const { searchKey, selectedTags, sortValue } = this.state;
    this.setState({
      isStarred: e.target.checked,
    });
    const sendData = {
      tag: selectedTags,
      sort: sortValue,
      starred: e.target.checked,
      query: searchKey,
    };
    this.getSearchData(sendData);
  };

  getTagOptions = () => {
    return new Promise<any>((resolve, reject) => {
      this.tagsPromiseResolve = resolve;
    });
  };

  render() {
    const { showNewDashboardPopup, isStarred, searchKey, selectedTags, sortValue } = this.state;
    return (
      <div>
        <div className="manage-dashboard-search">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="search-buttons float-right">
                <a className="dashboard-blue-button" onClick={this.toggleNewDashPopup}>
                  New Dashboard
                </a>
                <a className="dashboard-blue-button m-r-0" onClick={() => this.onClickUnImplementedFeature('')}>
                  New Folder
                </a>
              </div>
            </div>
          </div>
        </div>
        {!showNewDashboardPopup && (
          <>
            <div className="manage-dashboard-fliter-sort">
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
          </>
        )}
        {showNewDashboardPopup && (
          <div className="manage-newdashboard-general">
            <NewDashboard closenewDashboard={this.toggleNewDashPopup} />
          </div>
        )}
        <UnimplementedFeaturePopup ref={this.unimplementedFeatureModalRef} />
      </div>
    );
  }
}
