import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
    Layout,
    Card,
    TextField,
    Icon,
    Button,
    Popover,
    OptionList,
    Checkbox
} from "@shopify/polaris";
import Breadcumb from "../../UI/Breadcumb";
import { Link } from "react-router-dom";
import SeeMoreButton from ".././../UI/SeeMoreButton";
import axios from "axios";
import Spinner from "../../UI/Spinner";
import { DeleteMajorMonotone } from "@shopify/polaris-icons";
import Select from "../../UI/Select";
import "../campaign.scss";

const Bogo = () => {
    let initData = {
        selected: "",
        selectedBuys: ""
    };
    const [state, setState] = useState(initData);
    const [popoverActive, setPopoverActive] = useState(false);

    const { selected, selectedBuys } = state;
    const buysOptions = [
        { label: "Specific collections", value: "specific_collections" },
        { label: "Specific product", value: "specific_product" }
    ];

    //on change
    const togglePopoverActive = useCallback(
        () => setPopoverActive(popoverActive => !popoverActive),
        []
    );

    const setSelectedBuys = value => {
        setState({
            ...state,
            selectedBuys: value
        });
    };

    const handleSelectChange = e => {
        setState({
            ...state,
            selected: e.target.value
        });
    };

    //Options list // Browase
    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            Browse
        </Button>
    );
    return (
        <Fragment>
            <div className="bogo">
                <div className="mb-3">
                    <Breadcumb breadcumb="Back" pathname={`/campaign`} />
                </div>

                <div className="campaign__layout">
                    <Card sectioned>
                        <div className="form__layout">
                            <div className="form__group">
                                <div className="form__field ">
                                    <TextField
                                        type="text"
                                        label="Rule name"
                                        placeholder="e.g. SPRINGSALES"
                                        onChange={() => {}}
                                    />
                                </div>
                                <div className="form__field">
                                    <div className="form__field-wrapper">
                                        <TextField
                                            type="text"
                                            label="Rule type"
                                            onChange={() => {}}
                                        />
                                        <button className="icon link__btn">
                                            <Icon
                                                source={DeleteMajorMonotone}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex__wrapper">
                                <div className="flex__item flex__item-wrapper">
                                    <div className="flex_one">
                                        <Select
                                            name="select"
                                            value={selected}
                                            options={buysOptions}
                                            onChange={handleSelectChange}
                                            label="Customer buys"
                                        />
                                    </div>
                                    <div>
                                        <Popover
                                            active={popoverActive}
                                            activator={activator}
                                            onClose={togglePopoverActive}
                                        >
                                            <OptionList
                                                title="Inventory Location"
                                                onChange={setSelectedBuys}
                                                options={[
                                                    {
                                                        value: "byward_market",
                                                        label: "Byward Market"
                                                    },
                                                    {
                                                        value: "centretown",
                                                        label: "Centretown"
                                                    },
                                                    {
                                                        value: "hintonburg",
                                                        label: "Hintonburg"
                                                    },
                                                    {
                                                        value: "westboro",
                                                        label: "Westboro"
                                                    },
                                                    {
                                                        value: "downtown",
                                                        label: "Downtown"
                                                    }
                                                ]}
                                                selected={selectedBuys}
                                                allowMultiple
                                            />
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex__item">
                                    <div className="field__item">
                                        <TextField
                                            label="Quantity"
                                            type="text"
                                            placeholder="e.g. 0-9"
                                        />
                                    </div>
                                    <div className="field__item">
                                        <Select
                                            name="select"
                                            value={selected}
                                            options={buysOptions}
                                            onChange={handleSelectChange}
                                            label="Customer eligibility"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex__wrapper">
                                <div className="flex__item flex__item-wrapper">
                                    <div className="flex_one">
                                        <Select
                                            name="select"
                                            value={selected}
                                            options={buysOptions}
                                            onChange={handleSelectChange}
                                            label="Customer gets"
                                        />
                                    </div>
                                    <div>
                                        <Popover
                                            active={popoverActive}
                                            activator={activator}
                                            onClose={togglePopoverActive}
                                        >
                                            <OptionList
                                                title="Inventory Location"
                                                onChange={setSelectedBuys}
                                                options={[
                                                    {
                                                        value: "byward_market",
                                                        label: "Byward Market"
                                                    },
                                                    {
                                                        value: "centretown",
                                                        label: "Centretown"
                                                    },
                                                    {
                                                        value: "hintonburg",
                                                        label: "Hintonburg"
                                                    },
                                                    {
                                                        value: "westboro",
                                                        label: "Westboro"
                                                    },
                                                    {
                                                        value: "downtown",
                                                        label: "Downtown"
                                                    }
                                                ]}
                                                selected={selectedBuys}
                                                allowMultiple
                                            />
                                        </Popover>
                                    </div>
                                </div>
                                <div className="flex__item">
                                    <div className="field__item">
                                        <TextField
                                            label="Quantity"
                                            type="text"
                                            placeholder="e.g. 0-9"
                                        />
                                    </div>
                                    <div className="field__item">
                                        <div className="flex__row-equal">
                                            <div className="flex__row-item">
                                                <Select
                                                    name="select"
                                                    value={selected}
                                                    options={buysOptions}
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    label="At discount value"
                                                />
                                            </div>
                                            <div className="flex__row-item">
                                                <TextField
                                                    type="text"
                                                    suffix="$"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field__item">
                                        <div className="checlbox__item">
                                            <Checkbox label="Set maximum bumber of users per order" />
                                        </div>
                                        <div className="checlbox__item">
                                            <Checkbox label="" />
                                        </div>
                                        <div className="checlbox__item">
                                            <Checkbox label="Set maximum bumber of users per order" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="add_rule separator text-center mt-3">
                        <Button> + Add Rule Below</Button>
                    </div>
                    <div className="pull__right mt-3">
                        <Button primary>Continue</Button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Bogo;
