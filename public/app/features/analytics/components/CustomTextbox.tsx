import * as React from 'react';

export class CustomTextbox extends React.Component<any, any> {
  onChange = (e: any) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };
  render() {
    const { containerClass, inputClass, id, name, placeholder, value, isValid, message, type } = this.props;
    return (
      <div className={containerClass}>
        <input
          type={type ? type : 'text'}
          className={`${inputClass} ${isValid ? '' : 'is-invalid'}`}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={this.onChange}
        />
        {!isValid && <div className="invalid-feedback"> {message} </div>}
      </div>
    );
  }
}
