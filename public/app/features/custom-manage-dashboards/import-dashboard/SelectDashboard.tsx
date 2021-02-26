import * as React from 'react';

export class SelectDashboard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      catalogs: this.props.catalogsData,
    };
  }

  _displaycatalogList = () => {
    const { catalogs } = this.state;
    let retData = [];
    for (let i = 0; i < catalogs.catalogListL.length; i++) {
      let row = catalogs.catalogListL[i];
      retData.push(
        <div className="collapse-card-body" onClick={() => this.openEditCatalogDetail(catalogs)}>
          <input type="checkbox" />
          <span>
            <img src="public/img/config-collapse-icon1.png" alt="" />
          </span>
          <p>{row.name}</p>
        </div>
      );
    }
    return retData;
  };

  openEditCatalogDetail = (data: any) => {
    this.props.setCatalogDetail(data);
  };

  render() {
    const { catalogs } = this.state;
    console.log(catalogs);
    return (
      <div className="select-dashboard">
        <div className="select-dashboard-heading">
          <div className="row">
            <div className="col-lg-2 col-md-3 col-sm-12">
              <div className="heading-image">
                <img src="public/img/category-image1.png" alt="" />
              </div>
            </div>
            <div className="col-lg-10 col-md-9 col-sm-12">
              <div className="heading-text">
                <h3>{catalogs.catalogName}</h3>
                <p>{catalogs.catalogDescription}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="select-dashboard-lists">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="lists">{this._displaycatalogList()}</div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="list-right-content">
                <div className="heading">
                  <span>
                    <img src="public/img/config-collapse-icon1.png" alt="" />
                  </span>
                  <p>{catalogs.catalogName}</p>
                </div>
                <div className="content">
                  <h3>Dashboard Panels</h3>
                  <ul>
                    <li>Changed Resources by Type</li>
                    <li>Configuration Activity by AWS Region</li>
                    <li>Deleted Resources by Type</li>
                    <li>Discovered Resources by Type</li>
                    <li>Modifications by Day - Outlier</li>
                    <li>Modifications by Day - Trend</li>
                    <li>Recent Modifications</li>
                    <li>Resource Modifications Trend</li>
                  </ul>
                  <h3>Data Access Level</h3>
                  <ul>
                    <li>Sharing Outside The Org: This dashboard is inaccessible to people outside the organization.</li>
                    <li>Last Modified On: 12/03/2019 6:27:14 AM +0530</li>
                    <li>Created On: 12/03/2019 6:27:14 AM +0530</li>
                    <li>Type: Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
