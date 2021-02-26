import * as React from 'react';
export class CatalogList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      catalogs: this.props.catalogsData,
    };
  }

  _displayCatalogBox() {
    const catalogBox = this.state.catalogs.map((val: any, key: any) => {
      return (
        <div className="catalog-list-box" onClick={() => this.openCatalogDetail(val)}>
          <div className="row">
            <div className="col-lg-5 col-md-4 col-sm-12 p-r-0">
              <div className="catalog-list-image confit-image">
                <img src="public/img/category-image1.png" alt="" />
              </div>
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <div className="catalog-list-name">{val.catalogName} </div>
            </div>
          </div>
        </div>
      );
    });
    return catalogBox;
  }

  openCatalogDetail = (arryData: any) => {
    this.props.setCatalogDetail(arryData);
  };

  render() {
    return <div className="select-catalog-lists">{this._displayCatalogBox()}</div>;
  }
}
