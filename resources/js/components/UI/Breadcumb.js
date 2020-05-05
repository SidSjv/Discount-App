import React, { Fragment } from "react";
import { ChevronLeftMinor } from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";
import { useHistory, Link } from "react-router-dom";

const Breadcumb = ({ pathname, breadcumb, title }) => {
    return (
        <Fragment>
            <div className="title__bar-wrapper">
                <div className="title__bar">
                    <div className="title__bar-navigation">
                        <div className="breadcumbs">
                            <Link to={pathname}>
                                <Icon source={ChevronLeftMinor} />
                                <span>
                                    {" "}
                                    {breadcumb ? breadcumb : "Dashboard"}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <h1 className="title"> {title} </h1> */}
            </div>
        </Fragment>
    );
};

export default Breadcumb;
