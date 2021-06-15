import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextFieldGroup = ({ name, placeholder, value, error, info, type, onChange, disabled, extraClass }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={classnames("TextFieldGroupInput", {
          [extraClass]: extraClass,
        })}
        // className={classnames("form-control form-control-lg", {
        //     'is-invalid': error
        // })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoCorrect="-1"
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <span className="errorSpan errorSpanLogin">{error}</span>}
    </div>
  );
};

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TextFieldGroup.defaultProps = {
  type: "text",
};

export default TextFieldGroup;
