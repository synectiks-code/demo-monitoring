import React, { Component } from 'react';
export class CustomLabel extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  onChange = (e: any) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };
  render() {
    const { containerClass, labelClass, label, htmlFor, value } = this.props;
    return (
      <div className={containerClass}>
        <label className={labelClass} htmlFor={htmlFor}>
          {label}:&nbsp;
        </label>
        <span>{value}</span>
      </div>
    );
  }
}
