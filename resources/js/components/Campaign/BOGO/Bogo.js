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
import LunchPage from "./../LunchPage";
import "../campaign.scss";

const Bogo = props => {
    let initData = {
        selected: "",
        selectedBuys: "",
        param_id: "",
        bogo: [
            {
                name: "",
                buy_type: "specific_collections",
                buy_ids: "",
                buy_quantity: "",
                customer_ids_eligible: "",
                customer_list: "",
                customer_eligible: "everyone",
                get_type: "specific_collections",
                get_ids: "",
                get_quantity: "",
                discount_type: "percentage",
                discount_value: "",
                max_user: false,
                max_use_per_order: "",
                min_user: false,
                min_use_per_order: "",
                limit_to_one_use_per_customer: false,
                isOpen: false,
                error: {}
            }
        ],
        customerModalOpen: false,
        page: 1,
        isFetching: false,
        loading: false,
        customerList: [],
        selectedCustomers: [],
        customers: "",
        pushIndex: 0
    };
    const [state, setState] = useState(initData);
    const [searchCustomer, setSearchCustomer] = useState("");
    const [step, setStep] = useState(1);

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
        let bogos = [...bogo];
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
                        if (bogos[pushIndex].customer_ids_eligible) {
                            bogos[pushIndex].customer_ids_eligible.map(el => {
                                if (el.id === item.id) {
                                    item["isChecked"] = true;
                                }
                            });
                        } else {
                            item["isChecked"] = false;
                        }

                        customerList.push(item);
                    });

                bogos[pushIndex].customer_list = customerList;
                setState({
                    ...state,
                    customers: data.customers,
                    bogo: bogos,
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

    //Step form
    // Proceed to next step
    const nextStep = () => {
        if (handleValidations()) {
            setStep(step + 1);
        }
    };

    // Go back to prev step
    const prevStep = () => {
        setStep(step - 1);
    };

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
            pushIndex: 0
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
        bogo[pushIndex].customer_list.forEach(customer => {
            if (customer.id === id) {
                customer.isChecked = value;
            }
        });

        let customer_list_ids = [...bogo[pushIndex].customer_list];

        if (value === true) {
            customer_list_ids.forEach(customer => {
                if (customer.id === id) {
                    customer_list_ids.push(customer);
                }
            });
        } else {
            customer_list_ids = customer_list_ids.filter(
                item => item.id !== id
            );
        }
        setState({
            ...state,
            customerList,
            bogo
        });
    };

    // Add Customers
    const addCustomers = () => {
        let bogos = [...bogo];
        bogos[pushIndex] = {
            ...bogos[pushIndex],
            customer_ids_eligible: bogo[pushIndex].customer_list.filter(item =>
                item.isChecked ? item.id : ""
            )
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
        let bogos = [...bogo];
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

                data.customers.data &&
                    data.customers.data.length > 0 &&
                    data.customers.data.map(item => {
                        if (bogos[pushIndex].customer_ids_eligible) {
                            bogos[pushIndex].customer_ids_eligible.map(el => {
                                if (el.id === item.id) {
                                    item["isChecked"] = true;
                                }
                            });
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.customers.data);

                bogos[pushIndex].customer_list = bogos[
                    pushIndex
                ].customer_list.concat(data.customers.data);
                console.log(bogos);

                setState({
                    ...state,
                    customers: data.customers,
                    isFetching: false,
                    bogo: bogos,
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

    /* ******************** Validations ........... */

    const handleValidations = () => {
        let isValid = true;

        let bogos = [...bogo];
        bogos.map((item, idx) => {
            if (item.name === "") {
                isValid = false;
                item.error.name = "Required";
            }
            if (item.buy_type === "") {
                (isValid = false), (item.error.buy_type = "Required");
            }
            if (item.buy_quantity === "") {
                (isValid = false), (item.error.buy_quantity = "Required");
            }
            if (item.get_quantity === "") {
                (isValid = false), (item.error.get_quantity = "Required");
            }
            if (item.discount_type === "") {
                (isValid = false), (item.error.discount_type = "Required");
            }
            if (item.discount_value === "") {
                (isValid = false), (item.error.discount_value = "Required");
            }
        });

        setState({
            ...state,
            bogo: bogos
        });
        return isValid;
    };

    //Actions
    const addClick = () => {
        let obj = {
            name: "",
            buy_type: "",
            buy_ids: "",
            buy_quantity: "",
            customer_ids_eligible: "",
            customer_list: "",
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
            isOpen: false,
            error: {}
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

    return (
        <Fragment>
            {step === 1 && (
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
                                                error={
                                                    el.error.name &&
                                                    el.error.name
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
                                                    onClick={() =>
                                                        removeClick(idx)
                                                    }
                                                >
                                                    <Icon
                                                        source={
                                                            DeleteMajorMonotone
                                                        }
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
                                                            options={
                                                                buysOptions
                                                            }
                                                            onChange={e =>
                                                                handleSelectChange(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                            value={el.buy_type}
                                                            name="buy_type"
                                                            label="Customer buys"
                                                            error={
                                                                el.error
                                                                    .buy_type &&
                                                                el.error
                                                                    .buy_type
                                                            }
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
                                                            value={
                                                                el.buy_quantity
                                                            }
                                                            name="buy_quantity"
                                                            onChange={e =>
                                                                handleInputChange(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                            error={
                                                                el.error
                                                                    .buy_quantity &&
                                                                el.error
                                                                    .buy_quantity
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
                                                            error={
                                                                el.error
                                                                    .customer_eligible &&
                                                                el.error
                                                                    .customer_eligible
                                                            }
                                                        />
                                                    </div>
                                                    {el.customer_ids_eligible && (
                                                        <div className="field__item">
                                                            {el.customer_ids_eligible &&
                                                            el
                                                                .customer_ids_eligible
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
                                                            options={
                                                                getsOptions
                                                            }
                                                            value={el.get_type}
                                                            onChange={e =>
                                                                handleSelectChange(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                            label="Customer gets"
                                                            error={
                                                                el.error
                                                                    .get_type &&
                                                                el.error
                                                                    .get_type
                                                            }
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
                                                            value={
                                                                el.get_quantity
                                                            }
                                                            name="get_quantity"
                                                            onChange={e =>
                                                                handleInputChange(
                                                                    e,
                                                                    idx
                                                                )
                                                            }
                                                            error={
                                                                el.error
                                                                    .get_quantity &&
                                                                el.error
                                                                    .get_quantity
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
                                                                    error={
                                                                        el.error
                                                                            .discount_type &&
                                                                        el.error
                                                                            .discount_type
                                                                    }
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
                                                                    error={
                                                                        el.error
                                                                            .discount_value &&
                                                                        el.error
                                                                            .discount_value
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

            {step === 2 && <LunchPage />}

            {/* Customer Modal */}

            <CustomModal
                open={customerModalOpen}
                onClose={handleModalClose}
                titleOne="Add"
                titleTwo="Cancel"
                handleSave={addCustomers}
                onScrolledToBottom={handleScrollBottom}
                disabled={false}
                heading="Add Customers"
                placeholder="search Customers"
                searchText={searchCustomer}
                handleSearch={handleCustomerSearch}
            >
                <Fragment>
                    {loading && <Spinner />}
                    <div className="result__list">
                        {bogo[pushIndex].customer_list &&
                        bogo[pushIndex].customer_list.length > 0
                            ? bogo[pushIndex].customer_list.map(item => (
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
