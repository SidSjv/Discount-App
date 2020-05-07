import React from "react";
import "./spinner.scss";

const Select = ({ name, label, options, onChange, value }) => {
    let selectOptions = options.map(item => {
        return (
            <option value={item.value} key={item.value}>
                {item.label}
            </option>
        );
    });
    return (
        <div className="select">
            <label className="Polaris-Label Polaris-Labelled__LabelWrapper">
                {label}
            </label>
            <select name={name} value={value} onChange={onChange}>
                {selectOptions}
            </select>
        </div>
    );
};

export default Select;
