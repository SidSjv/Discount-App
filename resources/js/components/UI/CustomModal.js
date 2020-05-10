import React, { Fragment } from "react";
import { Modal } from "@shopify/polaris";

const CustomModal = props => {
    const {
        open,
        titleOne,
        titleTwo,
        handleSave,
        onClose,
        children,
        disabled,
        onScrolledToBottom,
        heading,
        placeholder,
        searchText,
        handleSearch
    } = props;

    const modalTitle = (
        <Fragment>
            <div className="modal__title">
                <div className="header__title">
                    <h2>{heading}</h2>
                </div>
                <div className="search_box">
                    <div className="Polaris-TextField">
                        <div className="Polaris-TextField__Prefix">
                            <span className="Polaris-Filters__SearchIcon">
                                <span className="Polaris-Icon">
                                    <svg
                                        viewBox="0 0 20 20"
                                        className="Polaris-Icon__Svg"
                                        focusable="false"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8m9.707 4.293l-4.82-4.82A5.968 5.968 0 0 0 14 8 6 6 0 0 0 2 8a6 6 0 0 0 6 6 5.968 5.968 0 0 0 3.473-1.113l4.82 4.82a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414"
                                            fillRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </span>
                        </div>
                        <input
                            type="text"
                            className="Polaris-TextField__Input search_input"
                            placeholder={placeholder}
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <div className="Polaris-TextField__Backdrop"></div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={modalTitle}
            primaryAction={{
                disabled: disabled,
                content: titleOne,
                onAction: handleSave
            }}
            secondaryActions={[
                {
                    content: titleTwo,
                    onAction: onClose
                }
            ]}
            onScrolledToBottom={onScrolledToBottom}
        >
            <Modal.Section>{children}</Modal.Section>
        </Modal>
    );
};
export default CustomModal;
