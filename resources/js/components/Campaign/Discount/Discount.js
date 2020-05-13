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
                data_list: "",
                name: "",
                discount_type: "percentage",
                discount_value: "",
                applies_to: "",
                applied_ids: "",
                countries_applicable: "",
                select_country: "*",
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
        checkedId: [],
        customerModalOpen: false,
        customerGroupModalOpen: false,
        collectionsModalOpen: false,
        productsModalOpen: false,
        countryModalOpen: false,
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
        customerModalOpen,
        customerGroupModalOpen,
        countryModalOpen,
        collectionsModalOpen,
        productsModalOpen,
        fetchData,
        page,
        pushIndex,
        param_id,
        lunchErr,
        store_id,
        checkedId
    } = state;

    //Fetch Data
    // Get customers
    const getCustomers = searchText => {
        let discounts = [...discount];
        let params = {
            page: page
        };
        if (searchText) {
            params.searchTerm = searchText;
        }
        if (search) {
            params.searchTerm = search;
        }

        setState({
            ...state,
            loading: true
        });

        axios
            .get("/customer", { params: params })
            .then(res => {
                let data = res.data;
                console.log("get customers", data);
                let list = [];
                data.customers.data &&
                    data.customers.data.length > 0 &&
                    data.customers.data.map(item => {
                        if (discounts[pushIndex].eligible_customers) {
                            discounts[pushIndex].eligible_customers.map(el => {
                                if (el.id === item.id) {
                                    item["isChecked"] = true;
                                }
                            });
                        } else {
                            item["isChecked"] = false;
                        }

                        list.push(item);
                    });

                discounts[pushIndex].data_list = list;
                setState({
                    ...state,
                    fetchData: data.customers,
                    discount: discounts,
                    isFetching: false,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    loading: false
                });
            });
    };

    useEffect(() => {
        let id = localStorage.discountapp_storeId;
        if (!store_id) {
            setState({
                ...state,
                store_id: id
            });
        }

        if (customerModalOpen) {
            getCustomers();
        }
    }, [customerModalOpen]);

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

    //customer modal
    const handleCustomerSelect = (e, i) => {
        const { value, name } = e.target;
        let discounts = [...discount];
        discounts[i] = { ...discounts[i], [name]: value };

        let customerModalOpen = false,
            customerGroupModalOpen = false;
        if (value === "specific_customer") {
            customerModalOpen = true;
        }
        if (value === "specific_group_customer") {
            customerGroupModalOpen = true;
        }
        setState({
            ...state,
            discount: discounts,
            customerModalOpen,
            customerGroupModalOpen,
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
            countries_applicable: "",
            select_country: "*",
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

    //handleModalClose
    const handleModalClose = () => {
        setState({
            ...state,
            customerModalOpen: false,
            customerGroupModalOpen: false,
            collectionsModalOpen: false,
            productsModalOpen: false,
            countryModalOpen: false,
            isFetching: false,
            loading: false,
            page: 1,
            pushIndex: 0
        });
    };

    const handleScrollBottom = () => {
        const { next_page_url } = fetchData;
        if (next_page_url) {
            if (customerModalOpen) {
                fetchCustomers();
            }
            // if (customerGroupModalOpen) {
            //     fetchCustomerGroups();
            // }
            // if (BuyCollectionsModalOpen || GetCollectionsModalOpen) {
            //     fetchCollections();
            // }
            // if (BuyProductsModalOpen || GetProductsModalOpen) {
            //     fetchProducts();
            // }
        }
    };
    //Search
    const handleSearch = e => {
        const { value } = e.target;

        setSearch(value);

        setTimeout(() => {
            if (customerModalOpen) {
                getCustomers(value);
            }
            // if (customerGroupModalOpen) {
            //     getCustomerGroups(value);
            // }
            // if (BuyCollectionsModalOpen || GetCollectionsModalOpen) {
            //     getCollections(value);
            // }
            // if (BuyProductsModalOpen || GetProductsModalOpen) {
            //     fetchProducts(value);
            // }
        }, 1000);
    };

    const handleCheckbox = (value, id) => {
        discount[pushIndex].data_list.forEach(item => {
            if (item.id === id) {
                item.isChecked = value;
            }
        });

        let checkedIds = [...checkedId];

        if (value === true) {
            checkedIds.push(id);
        } else {
            checkedIds = checkedIds.filter(el => el !== id);
        }
        setState({
            ...state,
            discount,
            checkedId: checkedIds
        });
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
                                    handleCustomerSelect={handleCustomerSelect}
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

            {/* Customer Modal */}
            {customerModalOpen && (
                <CustomModal
                    open={customerModalOpen}
                    onClose={handleModalClose}
                    titleOne="Add"
                    titleTwo="Cancel"
                    // handleSave={addCustomers}
                    onScrolledToBottom={handleScrollBottom}
                    disabled={checkedId && checkedId.length > 0 ? false : true}
                    heading="Add customers"
                    placeholder="Search customers"
                    searchText={search}
                    handleSearch={handleSearch}
                >
                    <Fragment>
                        {loading && <Spinner />}
                        <div className="result__list">
                            {discount[pushIndex].data_list &&
                            discount[pushIndex].data_list.length > 0
                                ? discount[pushIndex].data_list.map(item => (
                                      <div className="list" key={item.id}>
                                          <div className="left__item">
                                              <Checkbox
                                                  checked={item.isChecked}
                                                  id={item.id}
                                                  onChange={handleCheckbox}
                                              />
                                          </div>
                                          <div className="right__item">
                                              <p className="primary_name">
                                                  {item.first_name}{" "}
                                                  {item.last_name}
                                              </p>
                                          </div>
                                      </div>
                                  ))
                                : ""}

                            {isFetching && (
                                <p className="text-center">loading...</p>
                            )}
                        </div>
                    </Fragment>
                </CustomModal>
            )}

            {/* Customer Group Modal */}
            {customerGroupModalOpen && (
                <CustomModal
                    open={customerGroupModalOpen}
                    onClose={handleModalClose}
                    titleOne="Add"
                    titleTwo="Cancel"
                    // handleSave={addCustomers}
                    // onScrolledToBottom={handleScrollBottom}
                    disabled={false}
                    heading="Add customers groups"
                    placeholder="search customers groups"
                    // searchText={searchCustomer}
                    // handleSearch={handleCustomerSearch}
                >
                    <Fragment>
                        {loading && <Spinner />}
                        <div className="result__list">
                            {discount[pushIndex].data_list &&
                            discount[pushIndex].data_list.length > 0
                                ? discount[pushIndex].data_list.map(item => (
                                      <div className="list" key={item.id}>
                                          <div className="left__item">
                                              <Checkbox
                                                  checked={item.isChecked}
                                                  id={item.id}
                                                  //   onChange={
                                                  //       handleCustomerCheckbox
                                                  //   }
                                              />
                                          </div>
                                          <div className="right__item">
                                              <p className="primary_name">
                                                  {item.name}
                                              </p>
                                          </div>
                                      </div>
                                  ))
                                : ""}

                            {isFetching && (
                                <p className="text-center">loading...</p>
                            )}
                        </div>
                    </Fragment>
                </CustomModal>
            )}
        </Fragment>
    );
};

export default Discount;
