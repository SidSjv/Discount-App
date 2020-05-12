import React from "react";
import "./spinner.scss";

const InputField = ({
    label,
    type,
    name,
    onChange,
    value,
    placeholder,
    error,
    suffix,
    prefix
}) => {
    return (
        <div className="input_field">
            {label && (
                <label className="Polaris-Label Polaris-Labelled__LabelWrapper">
                    {label}
                </label>
            )}

            <div className="Polaris-Connected">
                <div
                    className={`Polaris-TextField ${
                        error ? "Polaris-TextField--error" : ""
                    }`}
                >
                    {prefix && (
                        <div
                            className="Polaris-TextField__Prefix"
                            id="PolarisTextField4Prefix"
                        >
                            {prefix}
                        </div>
                    )}
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="Polaris-TextField__Input"
                        placeholder={placeholder}
                    />
                    {suffix && (
                        <div
                            className="Polaris-TextField__Suffix"
                            id="PolarisTextField4Suffix"
                        >
                            {suffix}
                        </div>
                    )}
                    <div className="Polaris-TextField__Backdrop"></div>
                </div>
            </div>
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

export default InputField;
