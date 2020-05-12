import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
    Layout,
    Card,
    TextField,
    Icon,
    Button,
    Checkbox,
    Spinner,
    InlineError,
    Frame,
    Toast
} from "@shopify/polaris";
import Breadcumb from "../../UI/Breadcumb";
import { Link } from "react-router-dom";
import SeeMoreButton from ".././../UI/SeeMoreButton";
import axios from "axios";
import SpinnerUI from "../../UI/Spinner";
import { DeleteMajorMonotone, CancelSmallMinor } from "@shopify/polaris-icons";
import SelectField from "../../UI/SelectField";
import InputField from "../../UI/InputField";
import CustomModal from "./../../UI/CustomModal";
import LunchPage from "./../LunchPage";
import { getCurrentTime } from "../../Utils";
import Form from "./Form";

import "../campaign.scss";

const Discount = () => {
    let initData = {
        store_id: "",
        campaign_name: "",
        start_date: new Date(),
        start_time: getCurrentTime(),
        end_date: new Date(),
        end_time: getCurrentTime(),
        discount: [
            {
                name: "",
                discount_type: "percentage",
                discount_value: "",
                applies_to: "",
                applied_ids: "",
                min_requirements: "",
                min_req_value: "",
                eligible_customers: "",
                customer_eligibility: "",
                max_no_of_uses: "",
                max_uses: false,
                limit_to_one_use_per_customer: false,
                error: {},
                isOpen: false
            }
        ],
        pushIndex: 0,
        page: 1,
        isFetching: false,
        loading: false,
        fetchData: "",
        lunchErr: {}
    };
    const [state, setState] = useState(initData);
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastErr, setToastErr] = useState(false);
    const [search, setSearch] = useState("");

    //Desctruct the state
    const {
        campaign_name,
        start_date,
        start_time,
        end_date,
        end_time,
        discount,
        isFetching,
        loading,

        page,
        pushIndex,
        param_id,
        lunchErr,
        store_id
    } = state;

    /****** On Chnage Handlers *******/

    const toggleActive = useCallback(() => setToast(toast => !toast), []);
    //Step form
    const nextStep = () => {
        // if (handleValidations()) {
        //     setStep(step + 1);
        // }
        setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };

    //handle text field

    const handleInputChange = (e, i) => {
        const { name, value } = e.target;
        let discounts = [...discount];
        discounts[i] = { ...discounts[i], [name]: value };
        setState({
            ...state,
            discount: discounts
        });
    };
    //handle select
    const handleSelectChange = (e, i) => {
        //console.log(e, i);
        const { value, name } = e.target;
        let discounts = [...discount];
        discounts[i] = { ...discounts[i], [name]: value };
        setState({
            ...state,
            discount: discounts,
            pushIndex: i
        });
    };

    const handleMaxUses = (value, i) => {
        let discounts = [...discount];
        discounts[i] = { ...discounts[i], max_uses: value };
        setState({
            ...state,
            discount: discounts
        });
    };

    const handleLimitUser = (value, i) => {
        let discounts = [...discount];
        discounts[i] = {
            ...discounts[i],
            limit_to_one_use_per_customer: value
        };
        setState({
            ...state,
            discount: discounts
        });
    };

    //Actions
    const addClick = () => {
        let obj = {
            name: "",
            discount_type: "percentage",
            discount_value: "",
            applies_to: "",
            applied_ids: "",
            min_requirements: "",
            min_req_value: "",
            eligible_customers: "",
            customer_eligibility: "",
            max_no_of_uses: "",
            max_uses: false,
            limit_to_one_use_per_customer: false,
            error: {},
            isOpen: false
        };

        setState({
            ...state,
            discount: [...discount, obj]
        });
    };

    //Remove click
    const removeClick = i => {
        let discounts = [...discount];
        if (discounts.length > 1) {
            discounts.splice(i, 1);
        }
        setState({
            ...state,
            discount: discounts
        });
    };

    //Handle seeMore seeLess
    const handleSeeMore = i => {
        let discounts = [...discount];
        discounts[i].isOpen = !discounts[i].isOpen;
        setState({
            ...state,
            discount: discounts
        });
        console.log(discounts, i);
    };

    const toastMarkup = toast ? (
        <Toast content={toastMsg} error={toastErr} onDismiss={toggleActive} />
    ) : null;
    return (
        <Fragment>
            <Frame>
                {toastMarkup}
                {step === 1 && (
                    <div className="bogo">
                        <div className="mb-3">
                            <Breadcumb
                                breadcumb="Back"
                                pathname={`/campaign`}
                            />
                        </div>
                        <div className="campaign__layout">
                            {discount.map((el, idx) => (
                                <Form
                                    key={idx}
                                    idx={idx}
                                    el={el}
                                    handleInputChange={handleInputChange}
                                    handleSelectChange={handleSelectChange}
                                    handleMaxUses={handleMaxUses}
                                    handleLimitUser={handleLimitUser}
                                    addClick={addClick}
                                    removeClick={removeClick}
                                    handleSeeMore={handleSeeMore}
                                />
                            ))}

                            <div className="add_rule separator text-center mt-3">
                                <Button onClick={addClick}>
                                    {" "}
                                    + Add Rule Below
                                </Button>
                            </div>
                            <div className="pull__right mt-3">
                                <Button primary onClick={nextStep}>
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && <p>Lunch page</p>}
            </Frame>
        </Fragment>
    );
};

export default Discount;
