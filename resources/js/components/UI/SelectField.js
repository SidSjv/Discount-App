import React from "react";
import "./spinner.scss";

const SelectField = ({ name, label, options, onChange, value, error }) => {
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
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`${error ? "select__error" : ""} `}
            >
                {selectOptions}
            </select>
            {error && (
                <div className="Polaris-Labelled__Error">
                    <div className="Polaris-InlineError">
                        <div className="Polaris-InlineError__Icon">
                            <span className="Polaris-Icon">
                                <svg
                                    viewBox="0 0 20 20"
                                    className="Polaris-Icon__Svg"
                                    focusable="false"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2V6H9v4zm0 4h2v-2H9v2z"
                                        fill-rule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                        </div>
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectField;
