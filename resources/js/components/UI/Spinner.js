import React, { Fragment } from "react";
import { Spinner } from "@shopify/polaris";
import "./spinner.scss";

const spinner = () => {
    return (
        <Fragment>
            <div className="spinner">
                <Spinner size="large" color="teal" />
            </div>
        </Fragment>
    );
};

export default spinner;
