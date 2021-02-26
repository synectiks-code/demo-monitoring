import * as React from 'react';

export class EditDataSource extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      catalogs: this.props.catalogsData,
      isEdit: false,
    };
  }

  _displaycatalogList = () => {
    const { catalogs } = this.state;
    let retData = [];
    for (let i = 0; i < catalogs.catalogListL.length; i++) {
      let row = catalogs.catalogListL[i];
      retData.push(
        <div className="collapse-card-body">
          <div className="row">
            <div className="col-lg-10 col-md-9 col-sm-9">
              <span>
                <img src="public/img/config-collapse-icon1.png" alt="" />
              </span>
              <p>{row.name}</p>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-3 text-right">
              <button className="btn btn-link" onClick={this.setIsEdit}>
                <i className="fa fa-edit"></i>
              </button>
              <button className="btn btn-link">
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return retData;
  };

  openEditCatalogDetail = (data: any) => {
    this.props.setCatalogDetail(data);
  };

  setIsEdit = () => {
    const { isEdit } = this.state;
    let edit = !isEdit;
    this.setState({
      isEdit: edit,
    });
  };

  render() {
    const { catalogs, isEdit } = this.state;
    return (
      <div className="select-dashboard">
        <div className={isEdit === false ? 'd-block' : 'd-none'}>
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
          <div className="d-block text-right">
            <button className="import-blue-button m-r-0">Bulk edit</button>
          </div>
          <div className="bulk-lists">{this._displaycatalogList()}</div>
        </div>
        <div className={isEdit === true ? 'd-block' : 'd-none'}>
          <div className="edit-dashboard">
            <div className="select-dashboard-heading">
              <div className="row">
                <div className="col-lg-3 col-md-12 col-sm-12 order">
                  <div className="d-block width-100 text-right">
                    <a href="#" className="import-white-button min-width-inherit m-r-0">
                      <i className="fa fa-arrow-circle-left"></i>
                      &nbsp;&nbsp;Back
                    </a>
                  </div>
                </div>
                <div className="col-lg-2 col-md-12 col-sm-12">
                  <div className="heading-image">
                    <img src="public/img/category-image1.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12">
                  <div className="heading-text">
                    <h3>{catalogs.catalogName}</h3>
                    <p>{catalogs.catalogDescription}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-block data-source-heading">Select Data Source</div>
            <div className="d-block">
              <h3 className="d-block">AWS</h3>
              <div className="d-block">
                <div className="d-inline-block text-center data-source-box">
                  <div className="d-inline-block image">
                    <img src="public/img/category-image1.png" alt="" />
                  </div>
                  <div className="d-block name">Amazon CloudWatch</div>
                </div>
                <div className="d-inline-block text-center data-source-box">
                  <div className="d-inline-block image">
                    <img src="public/img/category-image1.png" alt="" />
                  </div>
                  <div className="d-block name">Amazon CloudWatch</div>
                </div>
                <div className="d-inline-block text-center data-source-box">
                  <div className="d-inline-block image">
                    <img src="public/img/category-image1.png" alt="" />
                  </div>
                  <div className="d-block name">Amazon CloudWatch</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
