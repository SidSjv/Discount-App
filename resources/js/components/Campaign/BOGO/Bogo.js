import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
    Layout,
    Card,
    TextField,
    Icon,
    Button,
    Popover,
    OptionList,
    Checkbox,
    Modal,
    Spinner
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

import "../campaign.scss";

const Bogo = props => {
    let initData = {
        selected: "",
        selectedBuys: "",
        param_id: "",
        bogo: [
            {
                name: "",
                buy_type: "",
                buy_ids: "",
                buy_quantity: "",
                customer_ids_eligible: "",
                customer_eligible: "",
                get_type: "",
                get_ids: "",
                get_quantity: "",
                discount_type: "",
                discount_value: "",
                max_user: false,
                max_use_per_order: "",
                min_user: false,
                min_use_per_order: "",
                limit_to_one_use_per_customer: false,
                isOpen: false
            }
        ],
        customerModalOpen: false,
        page: 1,
        isFetching: false,
        loading: false,
        customerList: [],
        selectedCustomers: [],
        customers: "",
        pushIndex: null
    };
    const [state, setState] = useState(initData);
    const [searchCustomer, setSearchCustomer] = useState("");

    //Desctruct the state
    const {
        selected,
        selectedBuys,
        bogo,
        customerModalOpen,
        isFetching,
        loading,
        customerList,
        selectedCustomers,
        page,
        customers,
        pushIndex,
        param_id
    } = state;

    const {
        buy_type,
        buy_ids,
        buy_quantity,
        customer_ids_eligible,
        get_type,
        get_ids,
        get_quantity,
        discount_type,
        discount_value,
        max_user,
        max_use_per_order,
        min_user,
        min_use_per_order,
        limit_to_one_use_per_customer,
        isOpen,
        customer_eligible
    } = bogo;
    //Use effect

    // Get customers

    const getCustomers = search => {
        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }
        if (searchCustomer) {
            params.searchTerm = searchCustomer;
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
                let customerList = [];
                data.customers.data &&
                    data.customers.data.length > 0 &&
                    data.customers.data.map(item => {
                        item["isChecked"] = false;
                        customerList.push(item);
                    });

                setState({
                    ...state,
                    customers: data.customers,
                    customerList,
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
        let param_id = props.match.params.id;

        let new_bogo;
        if (param_id === "buy-two-get-one") {
            new_bogo = bogo.map(obj => {
                obj.buy_quantity = 2;
                obj.get_quantity = 1;
                return obj;
            });
        }
        setState({
            ...state,
            bogo: new_bogo,
            param_id
        });
        if (customerModalOpen) {
            getCustomers();
        }
    }, [customerModalOpen]);

    const buysOptions = [
        {
            label: "Specific collections",
            value: "specific_collections"
        },
        {
            label: "Specific product",
            value: "specific_product"
        }
    ];
    const getsOptions = [
        {
            label: "Specific collections",
            value: "specific_collections"
        },
        {
            label: "Specific product",
            value: "specific_product"
        }
    ];
    const customerEligibilityOptions = [
        { label: "Everyone", value: "everyone" },
        {
            label: "Specific group of customers",
            value: "specific_group_customer"
        },
        {
            label: "Specific  customers",
            value: "specific_customer"
        }
    ];
    const discountValueOptions = [
        { label: "Percentage", value: "percentage" },
        { label: "Free", value: "free" }
    ];

    //on change

    //handle select
    const handleSelectChange = (e, i) => {
        console.log(e, i);
        const { value, name } = e.target;
        let bogos = [...bogo];
        bogos[i] = { ...bogos[i], [name]: value };
        setState({
            ...state,
            bogo: bogos
        });
    };

    //handle text field

    const handleInputChange = (e, i) => {
        const { name, value } = e.target;
        let bogos = [...bogo];
        bogos[i] = { ...bogos[i], [name]: value };
        setState({
            ...state,
            bogo: bogos
        });
    };

    //handel checkbox
    const handleMaxUser = (value, i) => {
        let bogos = [...bogo];
        bogos[i] = { ...bogos[i], max_user: value };
        setState({
            ...state,
            bogo: bogos
        });
    };

    const handleMinUser = (value, i) => {
        let bogos = [...bogo];
        bogos[i] = { ...bogos[i], min_user: value };
        setState({
            ...state,
            bogo: bogos
        });
    };
    const handleLimitUser = (value, i) => {
        let bogos = [...bogo];
        bogos[i] = {
            ...bogos[i],
            limit_to_one_use_per_customer: value
        };
        setState({
            ...state,
            bogo: bogos
        });
    };
    //Handle seeMore seeLess

    const handleSeeMore = i => {
        let bogos = [...bogo];
        bogos[i].isOpen = !bogos[i].isOpen;
        setState({
            ...state,
            bogo: bogos
        });
        console.log(bogos, i);
    };

    /*****Modal *****/

    const handleModalOpen = name => {
        setState({
            ...state,
            [name]: !state.name
        });
    };
    const handleModalClose = () => {
        setState({
            ...state,
            customerModalOpen: false,
            isFetching: false,
            loading: false,
            page: 1,
            pushIndex: null
        });
    };

    //customer modal

    const handleCustomerSelect = (e, i) => {
        const { value, name } = e.target;
        let bogos = [...bogo];
        bogos[i] = { ...bogos[i], [name]: value };

        let customerModalOpen = false;
        if (value === "specific_customer") {
            customerModalOpen = true;
        }
        setState({
            ...state,
            bogo: bogos,
            customerModalOpen,
            pushIndex: i
        });
    };

    const handleCustomerSearch = e => {
        const { value } = e.target;
        console.log(value);

        setSearchCustomer(value);

        setTimeout(() => {
            getCustomers(value);
        }, 1000);
    };

    const handleScrollBottom = () => {
        const { next_page_url } = customers;
        if (next_page_url) {
            fetchCustomers();
        }
    };

    const handleCustomerCheckbox = (value, id) => {
        customerList.forEach(customer => {
            if (customer.id === id) {
                customer.isChecked = value;
            }
        });

        let selectedCustomer = [...selectedCustomers];
        if (value === true) {
            customerList.forEach(customer => {
                if (customer.id === id) {
                    selectedCustomer.push(customer);
                }
            });
        } else {
            selectedCustomer = selectedCustomer.filter(item => item.id !== id);
        }

        setState({
            ...state,
            customerList,
            selectedCustomers: selectedCustomer
        });
    };

    // Add Customers
    const addCustomers = () => {
        let bogos = [...bogo];
        bogos[pushIndex] = {
            ...bogos[pushIndex],
            customer_ids_eligible: selectedCustomers
        };
        setState({
            ...state,
            bogo: bogos,
            customerModalOpen: false
        });
    };

    //Remove Selected customers
    const removeSelectedCustomer = (idx, id) => {
        let bogos = [...bogo];
        bogos[idx].customer_ids_eligible = bogos[
            idx
        ].customer_ids_eligible.filter(item => item.id !== id);
        console.log(bogos);

        setState({
            ...state,
            bogo: bogos
        });
    };

    //Fetch Customers

    const fetchCustomers = () => {
        console.log("fetch customers");
        setState({
            ...state,
            page: state.page + 1,
            isFetching: true
        });

        let params = {
            page: page
        };
        if (searchCustomer) {
            params.searchTerm = searchCustomer;
        }
        axios
            .get("/customer", { params: params })
            .then(res => {
                let data = res.data;
                console.log(data);
                let customerLists = [];
                data.customers.data &&
                    data.customers.data.length > 0 &&
                    data.customers.data.map(item => {
                        item["isChecked"] = false;
                        customerLists.push(item);
                    });

                console.log("fetch", data.customers.data);

                setState({
                    ...state,
                    customers: data.customers,
                    isFetching: false,

                    customerList: state.customerList.concat(data.customers.data)
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,

                    isFetching: false
                });
            });
    };

    //Actions
    const addClick = () => {
        let obj = {
            name: "",
            buy_type: "",
            buy_ids: "",
            buy_quantity: "",
            customer_ids_eligible: "",
            customer_eligible: "",
            get_type: "",
            get_ids: "",
            get_quantity: "",
            discount_type: "",
            discount_value: "",
            max_user: false,
            max_use_per_order: "",
            min_user: false,
            min_use_per_order: "",
            limit_to_one_use_per_customer: false,
            isOpen: false
        };
        if (param_id === "buy-two-get-one") {
            obj.buy_quantity = 2;
            obj.get_quantity = 1;
        }
        setState({
            ...state,
            bogo: [...bogo, obj]
        });
    };

    //Remove click
    const removeClick = i => {
        let bogos = [...bogo];
        if (bogos.length > 1) {
            bogos.splice(i, 1);
        }
        setState({
            ...state,
            bogo: bogos
        });
    };

    console.log("customerlist", customerList);
    return (
        <Fragment>
            <div className="bogo">
                <div className="mb-3">
                    <Breadcumb breadcumb="Back" pathname={`/campaign`} />
                </div>

                <div className="campaign__layout">
                    {bogo.map((el, idx) => (
                        <Card sectioned key={idx}>
                            <div className="form__layout">
                                <div className="form__group">
                                    <div className="form__field ">
                                        <InputField
                                            type="text"
                                            label="Rule name"
                                            value={el.name}
                                            placeholder="e.g. SPRINGSALES"
                                            name="name"
                                            onChange={e =>
                                                handleInputChange(e, idx)
                                            }
                                        />
                                    </div>
                                    <div className="form__field">
                                        <div className="form__field-wrapper">
                                            <TextField
                                                type="text"
                                                label="Rule type"
                                                value="BOGO"
                                            />
                                            <button
                                                className="icon link__btn"
                                                onClick={() => removeClick(idx)}
                                            >
                                                <Icon
                                                    source={DeleteMajorMonotone}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {el.isOpen && (
                                    <div className="see_more">
                                        <div className="flex__wrapper">
                                            <div className="flex__item flex__item-wrapper">
                                                <div className="flex_one">
                                                    <SelectField
                                                        options={buysOptions}
                                                        onChange={e =>
                                                            handleSelectChange(
                                                                e,
                                                                idx
                                                            )
                                                        }
                                                        value={el.buy_type}
                                                        name="buy_type"
                                                        label="Customer buys"
                                                    />
                                                </div>
                                                <div>
                                                    <Button>Browse</Button>
                                                </div>
                                            </div>
                                            <div className="flex__item">
                                                <div className="field__item">
                                                    <InputField
                                                        label="Quantity"
                                                        type="number"
                                                        placeholder="e.g. 0-9"
                                                        value={el.buy_quantity}
                                                        name="buy_quantity"
                                                        onChange={e =>
                                                            handleInputChange(
                                                                e,
                                                                idx
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="field__item">
                                                    <SelectField
                                                        name="select"
                                                        options={
                                                            customerEligibilityOptions
                                                        }
                                                        name="customer_eligible"
                                                        value={
                                                            el.customer_eligible
                                                        }
                                                        onChange={e => {
                                                            handleCustomerSelect(
                                                                e,
                                                                idx
                                                            );
                                                        }}
                                                        label="Customer eligibility"
                                                    />
                                                </div>
                                                {el.customer_ids_eligible && (
                                                    <div className="field__item">
                                                        {el.customer_ids_eligible &&
                                                        el.customer_ids_eligible
                                                            .length > 0
                                                            ? el.customer_ids_eligible.map(
                                                                  el => (
                                                                      <div className="customer__checked-list">
                                                                          <div className="name">
                                                                              {
                                                                                  el.first_name
                                                                              }{" "}
                                                                              {
                                                                                  el.last_name
                                                                              }
                                                                          </div>
                                                                          <div className="remove__btn">
                                                                              <button
                                                                                  onClick={() =>
                                                                                      removeSelectedCustomer(
                                                                                          idx,
                                                                                          el.id
                                                                                      )
                                                                                  }
                                                                              >
                                                                                  <Icon
                                                                                      source={
                                                                                          CancelSmallMinor
                                                                                      }
                                                                                  />
                                                                              </button>
                                                                          </div>
                                                                      </div>
                                                                  )
                                                              )
                                                            : ""}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex__wrapper">
                                            <div className="flex__item flex__item-wrapper">
                                                <div className="flex_one">
                                                    <SelectField
                                                        name="get_type"
                                                        options={getsOptions}
                                                        value={el.get_type}
                                                        onChange={e =>
                                                            handleSelectChange(
                                                                e,
                                                                idx
                                                            )
                                                        }
                                                        label="Customer gets"
                                                    />
                                                </div>
                                                <div>
                                                    <Button>Browse</Button>
                                                </div>
                                            </div>
                                            <div className="flex__item">
                                                <div className="field__item">
                                                    <InputField
                                                        label="Quantity"
                                                        type="number"
                                                        placeholder="e.g. 0-9"
                                                        value={el.get_quantity}
                                                        name="get_quantity"
                                                        onChange={e =>
                                                            handleInputChange(
                                                                e,
                                                                idx
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="field__item">
                                                    <div className="flex__row-equal">
                                                        <div className="flex__row-item">
                                                            <SelectField
                                                                name="discount_type"
                                                                options={
                                                                    discountValueOptions
                                                                }
                                                                onChange={e =>
                                                                    handleSelectChange(
                                                                        e,
                                                                        idx
                                                                    )
                                                                }
                                                                value={
                                                                    el.discount_type
                                                                }
                                                                label="At discount value"
                                                            />
                                                        </div>
                                                        <div className="flex__row-item">
                                                            <InputField
                                                                type="number"
                                                                suffix="%"
                                                                value={
                                                                    el.discount_value
                                                                }
                                                                name="discount_value"
                                                                onChange={e =>
                                                                    handleInputChange(
                                                                        e,
                                                                        idx
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="field__item">
                                                    <div className="checkbox__item">
                                                        <Checkbox
                                                            label="Set maximum number of users per order"
                                                            checked={
                                                                el.max_user
                                                            }
                                                            onChange={e =>
                                                                handleMaxUser(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                        {el.max_user && (
                                                            <div className="col-5">
                                                                <InputField
                                                                    type="text"
                                                                    value={
                                                                        el.max_use_per_order
                                                                    }
                                                                    name="max_use_per_order"
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            e,
                                                                            idx
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="checkbox__item">
                                                        <Checkbox
                                                            label="Limit number of times this discount can be used in total"
                                                            checked={
                                                                el.min_user
                                                            }
                                                            onChange={e =>
                                                                handleMinUser(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                        {el.min_user && (
                                                            <div className="col-5">
                                                                <InputField
                                                                    type="text"
                                                                    value={
                                                                        el.min_use_per_order
                                                                    }
                                                                    name="min_use_per_order"
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            e,
                                                                            idx
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="checkbox__item">
                                                        <Checkbox
                                                            label="Limit to one use per customer"
                                                            checked={
                                                                el.limit_to_one_use_per_customer
                                                            }
                                                            onChange={e =>
                                                                handleLimitUser(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center">
                                    <SeeMoreButton
                                        seeMoreText="set rule"
                                        seeLessText="hide"
                                        isOpen={el.isOpen}
                                        click={() => handleSeeMore(idx)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}

                    <div className="add_rule separator text-center mt-3">
                        <Button onClick={addClick}> + Add Rule Below</Button>
                    </div>
                    <div className="pull__right mt-3">
                        <Button primary>Continue</Button>
                    </div>
                </div>
            </div>

            {/* Customer Modal */}

            <CustomModal
                open={customerModalOpen}
                onClose={handleModalClose}
                titleOne="Add"
                titleTwo="Cancel"
                handleSave={addCustomers}
                onScrolledToBottom={handleScrollBottom}
                disabled={selectedCustomers.length > 0 ? false : true}
                heading="Add Customers"
                placeholder="search Customers"
                searchText={searchCustomer}
                handleSearch={handleCustomerSearch}
            >
                <Fragment>
                    {loading && <Spinner />}
                    <div className="result__list">
                        {customerList && customerList.length > 0
                            ? customerList.map(item => (
                                  <div className="list" key={item.id}>
                                      <div className="left__item">
                                          <Checkbox
                                              checked={item.isChecked}
                                              id={item.id}
                                              onChange={handleCustomerCheckbox}
                                          />
                                      </div>
                                      <div className="right__item">
                                          <p className="primary_name">
                                              {item.first_name} {item.last_name}
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
        </Fragment>
    );
};

export default Bogo;
