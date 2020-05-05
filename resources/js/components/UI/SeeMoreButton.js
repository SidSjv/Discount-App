import React, { Fragment } from "react";
import { Icon } from "@shopify/polaris";
import { CaretDownMinor, CaretUpMinor } from "@shopify/polaris-icons";

const SeeMoreButton = ({ isOpen, click, seeMoreText, seeLessText }) => {
    return (
        <Fragment>
            <button onClick={click} className="see__more">
                <span className="see__more-wrapper">
                    <span> {isOpen ? seeLessText : seeMoreText}</span>
                    <span>
                        <Icon
                            source={isOpen ? CaretUpMinor : CaretDownMinor}
                            color="teal"
                        />
                    </span>
                </span>
            </button>
        </Fragment>
    );
};

export default SeeMoreButton;
