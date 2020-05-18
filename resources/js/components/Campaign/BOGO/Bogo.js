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
import moment from "moment";

import "../campaign.scss";

const Bogo = props => {
    let initData = {
        store_id: "",
        campaign_name: "",
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        start_time: getCurrentTime(),
        end_date: moment(new Date()).format("YYYY-MM-DD"),
        end_time: getCurrentTime(),
        lunchErr: {},
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
                collection_list: "",
                product_list: "",
                customer_group_list: "",
                customer_eligible: "*",
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
                isOpen: true,
                error: {}
            }
        ],
        customerModalOpen: false,
        customerGroupModalOpen: false,
        BuyCollectionsModalOpen: false,
        BuyProductsModalOpen: false,
        GetCollectionsModalOpen: false,
        GetProductsModalOpen: false,
        page: 1,
        isFetching: false,
        isFetched: false,
        loading: false,
        customerList: [],
        checkedId: [],
        customers: "",
        pushIndex: 0
    };
    const [state, setState] = useState(initData);
    const [searchCustomer, setSearchCustomer] = useState("");
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastErr, setToastErr] = useState(false);

    //Desctruct the state
    const {
        campaign_name,
        start_date,
        start_time,
        end_date,
        end_time,
        selected,
        selectedBuys,
        bogo,
        customerModalOpen,
        customerGroupModalOpen,
        BuyCollectionsModalOpen,
        BuyProductsModalOpen,
        GetCollectionsModalOpen,
        GetProductsModalOpen,
        isFetching,
        isFetched,
        loading,
        customerList,
        selectedCustomers,
        page,
        customers,
        pushIndex,
        param_id,
        lunchErr,
        store_id,
        checkedId
    } = state;

    // Get customers
    const getCustomers = (search, name) => {
        let bogos = [...bogo];
        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }
        if (name) {
            params.searchBy = "name";
        }
        if (searchCustomer) {
            params.searchTerm = searchCustomer;
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
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
                    loading: false,
                    isFetched: true
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            });
    };

    //Get customers groups
    const getCustomerGroups = (search, name) => {
        let bogos = [...bogo];
        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }
        if (name) {
            params.searchBy = "name";
        }
        if (searchCustomer) {
            params.searchTerm = searchCustomer;
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
        });

        axios
            .get("/customer/groups", { params: params })
            .then(res => {
                let data = res.data;
                let customerList = [];
                data.customer_groups.data &&
                    data.customer_groups.data.length > 0 &&
                    data.customer_groups.data.map(item => {
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
                    customers: data.customer_groups,
                    bogo: bogos,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            });
    };

    //Get collections
    const getCollections = (search, name) => {
        let bogos = [...bogo];
        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }
        if (name) {
            params.searchBy = "title";
        }
        if (searchCustomer) {
            params.searchTerm = searchCustomer;
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
        });

        axios
            .get("/collection", { params: params })
            .then(res => {
                console.log(res.data);
                let data = res.data;
                let collectionList = [];
                data.collections.data &&
                    data.collections.data.length > 0 &&
                    data.collections.data.map(item => {
                        if (BuyCollectionsModalOpen) {
                            if (bogos[pushIndex].buy_ids) {
                                bogos[pushIndex].buy_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else if (GetCollectionsModalOpen) {
                            if (bogos[pushIndex].get_ids) {
                                bogos[pushIndex].get_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else {
                            item["isChecked"] = false;
                        }

                        collectionList.push(item);
                    });

                bogos[pushIndex].customer_list = collectionList;
                setState({
                    ...state,
                    customers: data.collections,
                    bogo: bogos,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            });
    };

    //Get Products

    const getProducts = (search, name) => {
        let bogos = [...bogo];
        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }
        if (name) {
            params.searchBy = "title";
        }
        if (searchCustomer) {
            params.searchTerm = searchCustomer;
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
        });

        axios
            .get("/product", { params: params })
            .then(res => {
                console.log(res.data);
                let data = res.data;
                let collectionList = [];
                data.products.data &&
                    data.products.data.length > 0 &&
                    data.products.data.map(item => {
                        if (BuyProductsModalOpen) {
                            if (bogos[pushIndex].buy_ids) {
                                bogos[pushIndex].buy_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else if (GetProductsModalOpen) {
                            if (bogos[pushIndex].get_ids) {
                                bogos[pushIndex].get_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else {
                            item["isChecked"] = false;
                        }

                        collectionList.push(item);
                    });

                bogos[pushIndex].customer_list = collectionList;
                setState({
                    ...state,
                    customers: data.products,
                    bogo: bogos,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    loading: false,
                    isFetched: true
                });
            });
    };
    useEffect(() => {
        let param_id = props.match.params.id;

        let new_bogo;
        if (param_id) {
            new_bogo = bogo.map(obj => {
                if (param_id === "buy-two-get-one") {
                    obj.buy_quantity = 2;
                    obj.get_quantity = 1;
                }

                obj.name = param_id;
                return obj;
            });
        } else {
            new_bogo = bogo;
        }
        setState({
            ...state,
            bogo: new_bogo,
            param_id,
            store_id: localStorage.discountapp_storeId
        });
        if (customerModalOpen) {
            getCustomers();
        }
        if (customerGroupModalOpen) {
            getCustomerGroups();
        }
        if (BuyCollectionsModalOpen || GetCollectionsModalOpen) {
            getCollections();
        }
        if (BuyProductsModalOpen || GetProductsModalOpen) {
            getProducts();
        }
    }, [
        customerModalOpen,
        customerGroupModalOpen,
        BuyCollectionsModalOpen,
        GetCollectionsModalOpen,
        BuyProductsModalOpen,
        GetProductsModalOpen
    ]);

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
        { label: "Everyone", value: "*" },
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
        { label: "Fixed Price", value: "fixed_price" }
    ];

    //toast
    const toggleActive = useCallback(() => setToast(toast => !toast), []);
    //Step form
    // Proceed to next step
    const nextStep = () => {
        if (handleValidations()) {
            setStep(step + 1);
        }
        //setStep(step + 1);
    };

    // Go back to prev step
    const prevStep = () => {
        setStep(step - 1);
    };

    //on change

    const handleCampignNameChange = value => {
        setState({
            ...state,
            campaign_name: value
        });
    };

    const handleStartDateChange = (date, dateString) => {
        setState({
            ...state,
            start_date: dateString
        });
    };
    const handleEndDateChange = (date, dateString) => {
        setState({
            ...state,
            end_date: dateString
        });
    };
    const handleStartTimeChange = (time, timeString) => {
        setState({
            ...state,
            start_time: timeString
        });
    };
    const handleEndTimeChange = (time, timeString) => {
        setState({
            ...state,
            end_time: timeString
        });
    };

    //handle select
    const handleSelectChange = (e, i) => {
        console.log(e, i);
        const { value, name } = e.target;
        let bogos = [...bogo];
        bogos[i] = {
            ...bogos[i],
            [name]: value,
            error: { ...bogos[i].error, [name]: "" }
        };

        let BuyCollectionsModalOpen = false,
            BuyProductsModalOpen = false,
            GetCollectionsModalOpen = false,
            GetProductsModalOpen = false;

        if (name === "buy_type" && value === "specific_product") {
            BuyProductsModalOpen = true;
        }
        if (name === "buy_type" && value === "specific_collections") {
            BuyCollectionsModalOpen = true;
        }
        if (name === "get_type" && value === "specific_product") {
            GetProductsModalOpen = true;
        }
        if (name === "get_type" && value === "specific_collections") {
            GetCollectionsModalOpen = true;
        }
        setState({
            ...state,
            bogo: bogos,
            pushIndex: i,
            BuyCollectionsModalOpen,
            BuyProductsModalOpen,
            GetCollectionsModalOpen,
            GetProductsModalOpen
        });
    };

    //handle text field

    const handleInputChange = (e, i) => {
        const { name, value } = e.target;
        let bogos = [...bogo];
        bogos[i] = {
            ...bogos[i],
            [name]: value,
            error: { ...bogos[i].error, [name]: "" }
        };

        setState({
            ...state,
            bogo: bogos
        });
    };

    //handel checkbox
    const handleMaxUser = (value, i) => {
        let bogos = [...bogo];
        bogos[i] = {
            ...bogos[i],
            max_user: value,
            error: { ...bogos[i].error, max_use_per_order: "" }
        };
        setState({
            ...state,
            bogo: bogos
        });
    };

    const handleMinUser = (value, i) => {
        let bogos = [...bogo];
        bogos[i] = {
            ...bogos[i],
            min_user: value,
            error: { ...bogos[i].error, min_use_per_order: "" }
        };

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

    const handleModalClose = () => {
        setState({
            ...state,
            customerModalOpen: false,
            customerGroupModalOpen: false,
            BuyCollectionsModalOpen: false,
            BuyProductsModalOpen: false,
            GetCollectionsModalOpen: false,
            GetProductsModalOpen: false,
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
            bogo: bogos,
            customerModalOpen,
            customerGroupModalOpen,
            pushIndex: i
        });
    };

    const handleCustomerSearch = e => {
        const { value } = e.target;
        console.log(value);

        setSearchCustomer(value);

        setTimeout(() => {
            if (customerModalOpen) {
                getCustomers(value, "name");
            }
            if (customerGroupModalOpen) {
                getCustomerGroups(value, "name");
            }
            if (BuyCollectionsModalOpen || GetCollectionsModalOpen) {
                getCollections(value, "title");
            }
            if (BuyProductsModalOpen || GetProductsModalOpen) {
                getProducts(value, "title");
            }
        }, 1000);
    };

    const handleScrollBottom = () => {
        const { next_page_url } = customers;
        if (next_page_url) {
            if (customerModalOpen) {
                fetchCustomers();
            }
            if (customerGroupModalOpen) {
                fetchCustomerGroups();
            }
            if (BuyCollectionsModalOpen || GetCollectionsModalOpen) {
                fetchCollections();
            }
            if (BuyProductsModalOpen || GetProductsModalOpen) {
                fetchProducts();
            }
        }
    };

    const handleCustomerCheckbox = (value, id) => {
        bogo[pushIndex].customer_list.forEach(customer => {
            if (customer.id === id) {
                customer.isChecked = value;
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
            checkedId: checkedIds,
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
            customerModalOpen: false,
            customerGroupModalOpen: false
        });
    };

    //Add Collections

    const addCollections = () => {
        let bogos = [...bogo];
        if (BuyCollectionsModalOpen || BuyProductsModalOpen) {
            bogos[pushIndex] = {
                ...bogos[pushIndex],
                buy_ids: bogo[pushIndex].customer_list.filter(item =>
                    item.isChecked ? item.id : ""
                )
            };
        }
        if (GetCollectionsModalOpen || GetProductsModalOpen) {
            bogos[pushIndex] = {
                ...bogos[pushIndex],
                get_ids: bogo[pushIndex].customer_list.filter(item =>
                    item.isChecked ? item.id : ""
                )
            };
        }

        setState({
            ...state,
            bogo: bogos,
            customerModalOpen: false,
            customerGroupModalOpen: false,
            BuyCollectionsModalOpen: false,
            BuyProductsModalOpen: false,
            GetCollectionsModalOpen: false,
            GetProductsModalOpen: false
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

    //Remove selected collections
    const removeBuyIds = (idx, id) => {
        let bogos = [...bogo];
        bogos[idx].buy_ids = bogos[idx].buy_ids.filter(item => item.id !== id);

        setState({
            ...state,
            bogo: bogos
        });
    };
    const removeGetIds = (idx, id) => {
        let bogos = [...bogo];
        bogos[idx].get_ids = bogos[idx].get_ids.filter(item => item.id !== id);

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

    const fetchCustomerGroups = () => {
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
            .get("/customer/groups", { params: params })
            .then(res => {
                let data = res.data;
                console.log(data);

                data.customer_groups.data &&
                    data.customer_groups.data.length > 0 &&
                    data.customer_groups.data.map(item => {
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

                console.log("fetch", data.customer_groups.data);

                bogos[pushIndex].customer_list = bogos[
                    pushIndex
                ].customer_list.concat(data.customer_groups.data);
                console.log(bogos);

                setState({
                    ...state,
                    customers: data.customer_groups,
                    isFetching: false,
                    bogo: bogos,
                    customerList: state.customerList.concat(
                        data.customer_groups.data
                    )
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

    const fetchCollections = () => {
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
            .get("/customer/groups", { params: params })
            .then(res => {
                let data = res.data;
                console.log(data);

                data.collections.data &&
                    data.collections.data.length > 0 &&
                    data.collections.data.map(item => {
                        if (BuyCollectionsModalOpen) {
                            if (bogos[pushIndex].buy_ids) {
                                bogos[pushIndex].buy_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else if (GetCollectionsModalOpen) {
                            if (bogos[pushIndex].get_ids) {
                                bogos[pushIndex].get_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.collections.data);

                bogos[pushIndex].customer_list = bogos[
                    pushIndex
                ].customer_list.concat(data.collections.data);
                console.log(bogos);

                setState({
                    ...state,
                    customers: data.collections,
                    isFetching: false,
                    bogo: bogos,
                    customerList: state.customerList.concat(
                        data.collections.data
                    )
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

    const fetchProducts = () => {
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
            .get("/product", { params: params })
            .then(res => {
                let data = res.data;
                console.log(data);

                data.products.data &&
                    data.products.data.length > 0 &&
                    data.products.data.map(item => {
                        if (BuyProductsModalOpen) {
                            if (bogos[pushIndex].buy_ids) {
                                bogos[pushIndex].buy_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else if (GetProductsModalOpen) {
                            if (bogos[pushIndex].get_ids) {
                                bogos[pushIndex].get_ids.map(el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                });
                            }
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.collections.data);

                bogos[pushIndex].customer_list = bogos[
                    pushIndex
                ].customer_list.concat(data.collections.data);
                console.log(bogos);

                setState({
                    ...state,
                    customers: data.collections,
                    isFetching: false,
                    bogo: bogos,
                    customerList: state.customerList.concat(
                        data.collections.data
                    )
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
    /* ******************** Buys Modal ........... */
    //collections and products

    const handleBuysModalOpen = i => {
        let BuyCollectionsModalOpen = false,
            BuyProductsModalOpen = false;
        if (bogo[i].buy_type === "specific_collections") {
            BuyCollectionsModalOpen = true;
            BuyProductsModalOpen = false;
        }
        if (bogo[i].buy_type === "specific_product") {
            BuyCollectionsModalOpen = false;
            BuyProductsModalOpen = true;
        }

        setState({
            ...state,
            BuyCollectionsModalOpen,
            BuyProductsModalOpen
        });
    };

    const handleGetsModalOpen = i => {
        console.log(i);
        let GetCollectionsModalOpen = false,
            GetProductsModalOpen = false;
        if (bogo[i].get_type === "specific_collections") {
            GetCollectionsModalOpen = true;
            GetProductsModalOpen = false;
        }
        if (bogo[i].get_type === "specific_product") {
            GetCollectionsModalOpen = false;
            GetProductsModalOpen = true;
        }

        setState({
            ...state,
            GetCollectionsModalOpen,
            GetProductsModalOpen
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
                isValid = false;
                item.error.buy_type = "Required";
            }
            if (item.buy_quantity === "") {
                isValid = false;
                item.error.buy_quantity = "Required";
            }
            if (item.get_quantity === "") {
                isValid = false;
                item.error.get_quantity = "Required";
            }
            if (item.discount_type === "") {
                isValid = false;
                item.error.discount_type = "Required";
            }
            if (item.discount_value === "") {
                isValid = false;
                item.error.discount_value = "Required";
            }
            if (item.max_use_per_order === "") {
                isValid = false;
                item.error.max_use_per_order = "Required";
            }
            if (item.min_use_per_order === "") {
                isValid = false;
                item.error.min_use_per_order = "Required";
            }

            if (
                item.buy_ids === "" ||
                (item.buy_ids && item.buy_ids.length < 1)
            ) {
                isValid = false;
                item.error.buy_ids = "Required";
            }
            if (
                item.get_ids === "" ||
                (item.get_ids && item.get_ids.length < 1)
            ) {
                isValid = false;
                item.error.get_ids = "Required";
            }
            if (
                item.customer_eligible !== "everyone" &&
                item.customer_ids_eligible &&
                item.customer_ids_eligible.length < 1
            ) {
                isValid = false;
                item.error.customer_eligible = "Required";
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
            collection_list: "",
            product_list: "",
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
            isOpen: true,
            error: {}
        };
        if (param_id) {
            if (param_id === "buy-two-get-one") {
                obj.buy_quantity = 2;
                obj.get_quantity = 1;
            }

            obj.name = param_id;
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

    //Submit validations

    const handleSubmitValidations = () => {
        let isValid = true;
        let lunchErr = {};
        if (campaign_name === "") {
            isValid = false;
            lunchErr.campaign_name = "Required";
        }
        if (start_date === "") {
            isValid = false;
            lunchErr.start_date = "Required";
        }
        if (end_date === "") {
            isValid = false;
            lunchErr.end_date = "Required";
        }
        if (start_time === "") {
            isValid = false;
            lunchErr.start_time = "Required";
        }
        if (end_time === "") {
            isValid = false;
            lunchErr.end_time = "Required";
        }

        setState({
            ...state,
            lunchErr
        });
        return isValid;
    };

    //Launch  Campaign
    const launchCampaign = () => {
        if (handleSubmitValidations()) {
            let bogoArry = [];
            let sendObj = {
                campaign_name: campaign_name,
                start_date: `${start_date} ${start_time}`,
                end_date: `${end_date} ${end_time}`,
                discount_type: "Single",
                BOGO: bogoArry
            };

            bogo.map(el => {
                let buyIds = el.buy_ids.map(buy => buy.id);
                let getIds = el.get_ids.map(get => get.id);
                let customerIds;
                if (el.customer_eligible !== "everyone") {
                    customerIds = el.customer_ids_eligible.map(
                        customer => customer.id
                    );
                }

                return bogoArry.push({
                    name: el.name,
                    buy_type: el.buy_type,
                    buy_ids: buyIds ? buyIds : "",
                    buy_quantity: el.buy_quantity,
                    customer_ids_eligible: customerIds ? customerIds : "",
                    get_type: el.get_type,
                    get_ids: getIds ? getIds : "",
                    get_quantity: el.get_quantity,
                    discount_type: el.get_quantity,
                    discount_value: el.discount_value,
                    max_use_per_order: el.max_use_per_order,
                    min_use_per_order: el.min_use_per_order,
                    limit_to_one_use_per_customer:
                        el.limit_to_one_use_per_customer
                });
            });

            setState({
                ...state,
                loading: true
            });

            axios
                .post("/campaign", sendObj)
                .then(res => {
                    console.log(res);
                    let data = res.data;
                    if (data.status === true) {
                        setToastMsg("Campaign Created Successfully!");
                        setToastErr(false);
                        setToast(true);
                    }

                    setState({
                        ...state,
                        loading: false
                    });
                    setTimeout(() => {
                        window.location.href = `/home?store_id=${store_id}`;
                    }, 2000);
                })
                .catch(err => {
                    setState({
                        ...state,
                        loading: false
                    });
                    setToast(true);
                    setToastErr(true);
                    setToastMsg("Something went wrong, please try again later");
                    console.log(err);
                });

            console.log(sendObj);
        }
    };

    const toastMarkup = toast ? (
        <Toast content={toastMsg} error={toastErr} onDismiss={toggleActive} />
    ) : null;
    const notFound =
        isFetched &&
        bogo[pushIndex].customer_list &&
        bogo[pushIndex].customer_list.length < 1 ? (
            <div className="no__result">
                No results found for "{searchCustomer}"
            </div>
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
                                                        handleInputChange(
                                                            e,
                                                            idx
                                                        )
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
                                                    {bogo.length > 1 && (
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
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {el.isOpen && (
                                            <div className="see_more">
                                                <div className="flex__wrapper">
                                                    <div className="flex__item ">
                                                        <div className="flex__item-wrapper">
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
                                                                    value={
                                                                        el.buy_type
                                                                    }
                                                                    name="buy_type"
                                                                    label="Customer buys"
                                                                    error={
                                                                        el.error
                                                                            .buy_type &&
                                                                        el.error
                                                                            .buy_type
                                                                    }
                                                                    error={
                                                                        el.error
                                                                            .buy_ids
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="browse__btn">
                                                                <div>
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleBuysModalOpen(
                                                                                idx
                                                                            )
                                                                        }
                                                                    >
                                                                        Browse
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {el.buy_ids &&
                                                        el.buy_ids.length > 0
                                                            ? el.buy_ids.map(
                                                                  el => (
                                                                      <div className="customer__checked-list">
                                                                          <div className="name">
                                                                              {
                                                                                  el.title
                                                                              }
                                                                          </div>

                                                                          <div className="remove__btn">
                                                                              <button
                                                                                  onClick={() =>
                                                                                      removeBuyIds(
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
                                                                                      {el.first_name &&
                                                                                          el.first_name}{" "}
                                                                                      {el.last_name &&
                                                                                          el.last_name}
                                                                                      {el.name &&
                                                                                          el.name}
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
                                                    <div className="flex__item ">
                                                        <div className="flex__item-wrapper">
                                                            <div className="flex_one">
                                                                <SelectField
                                                                    name="get_type"
                                                                    options={
                                                                        getsOptions
                                                                    }
                                                                    value={
                                                                        el.get_type
                                                                    }
                                                                    onChange={e =>
                                                                        handleSelectChange(
                                                                            e,
                                                                            idx
                                                                        )
                                                                    }
                                                                    label="Customer gets"
                                                                    error={
                                                                        el.error
                                                                            .get_ids &&
                                                                        el.error
                                                                            .get_ids
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="browse__btn">
                                                                <div>
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleGetsModalOpen(
                                                                                idx
                                                                            )
                                                                        }
                                                                    >
                                                                        Browse
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {el.get_ids &&
                                                        el.get_ids.length > 0
                                                            ? el.get_ids.map(
                                                                  el => (
                                                                      <div className="customer__checked-list">
                                                                          <div className="name">
                                                                              {
                                                                                  el.title
                                                                              }
                                                                          </div>

                                                                          <div className="remove__btn">
                                                                              <button
                                                                                  onClick={() =>
                                                                                      removeGetIds(
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
                                                                            el
                                                                                .error
                                                                                .discount_type &&
                                                                            el
                                                                                .error
                                                                                .discount_type
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex__row-item">
                                                                    <InputField
                                                                        type="number"
                                                                        suffix={
                                                                            el.discount_type ===
                                                                            "percentage"
                                                                                ? "%"
                                                                                : null
                                                                        }
                                                                        label="Value"
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
                                                                            el
                                                                                .error
                                                                                .discount_value &&
                                                                            el
                                                                                .error
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

                                                                <InlineError
                                                                    message={
                                                                        el.error
                                                                            .max_use_per_order &&
                                                                        el.error
                                                                            .max_use_per_order
                                                                    }
                                                                />
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

                                                                <InlineError
                                                                    message={
                                                                        el.error
                                                                            .min_use_per_order &&
                                                                        el.error
                                                                            .min_use_per_order
                                                                    }
                                                                />
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

                {step === 2 && (
                    <LunchPage
                        discount_name="Discount Name"
                        back={prevStep}
                        onInputChange={handleCampignNameChange}
                        campaign_name={campaign_name}
                        start_date={start_date}
                        end_date={end_date}
                        start_time={start_time}
                        end_time={end_time}
                        handleStartDateChange={handleStartDateChange}
                        handleEndDateChange={handleEndDateChange}
                        handleStartTimeChange={handleStartTimeChange}
                        handleEndTimeChange={handleEndTimeChange}
                        launchCampaign={launchCampaign}
                        error={lunchErr}
                        loading={loading}
                    />
                )}

                {/* Customer Modal */}
                {customerModalOpen && (
                    <CustomModal
                        open={customerModalOpen}
                        onClose={handleModalClose}
                        titleOne="Add"
                        titleTwo="Cancel"
                        handleSave={addCustomers}
                        onScrolledToBottom={handleScrollBottom}
                        disabled={
                            checkedId && checkedId.length > 0 ? false : true
                        }
                        heading="Add customers"
                        placeholder="Search customers"
                        searchText={searchCustomer}
                        handleSearch={handleCustomerSearch}
                    >
                        <Fragment>
                            {loading && <Spinner />}
                            {notFound}
                            <div className="result__list">
                                {bogo[pushIndex].customer_list &&
                                bogo[pushIndex].customer_list.length > 0
                                    ? bogo[pushIndex].customer_list.map(
                                          item => (
                                              <div
                                                  className="list"
                                                  key={item.id}
                                              >
                                                  <div className="left__item">
                                                      <Checkbox
                                                          checked={
                                                              item.isChecked
                                                          }
                                                          id={item.id}
                                                          onChange={
                                                              handleCustomerCheckbox
                                                          }
                                                      />
                                                  </div>
                                                  <div className="right__item">
                                                      <p className="primary_name">
                                                          {item.first_name}{" "}
                                                          {item.last_name}
                                                      </p>
                                                  </div>
                                              </div>
                                          )
                                      )
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
                        handleSave={addCustomers}
                        onScrolledToBottom={handleScrollBottom}
                        disabled={
                            checkedId && checkedId.length > 0 ? false : true
                        }
                        heading="Add customers groups"
                        placeholder="search customers groups"
                        searchText={searchCustomer}
                        handleSearch={handleCustomerSearch}
                    >
                        <Fragment>
                            {loading && <Spinner />}
                            {notFound}
                            <div className="result__list">
                                {bogo[pushIndex].customer_list &&
                                bogo[pushIndex].customer_list.length > 0
                                    ? bogo[pushIndex].customer_list.map(
                                          item => (
                                              <div
                                                  className="list"
                                                  key={item.id}
                                              >
                                                  <div className="left__item">
                                                      <Checkbox
                                                          checked={
                                                              item.isChecked
                                                          }
                                                          id={item.id}
                                                          onChange={
                                                              handleCustomerCheckbox
                                                          }
                                                      />
                                                  </div>
                                                  <div className="right__item">
                                                      <p className="primary_name">
                                                          {item.name}
                                                      </p>
                                                  </div>
                                              </div>
                                          )
                                      )
                                    : ""}

                                {isFetching && (
                                    <p className="text-center">loading...</p>
                                )}
                            </div>
                        </Fragment>
                    </CustomModal>
                )}

                {/* Collections Modal */}
                {(BuyCollectionsModalOpen || GetCollectionsModalOpen) && (
                    <CustomModal
                        open={
                            BuyCollectionsModalOpen || GetCollectionsModalOpen
                        }
                        onClose={handleModalClose}
                        titleOne="Add"
                        titleTwo="Cancel"
                        handleSave={addCollections}
                        onScrolledToBottom={handleScrollBottom}
                        disabled={
                            checkedId && checkedId.length > 0 ? false : true
                        }
                        heading="Add collections"
                        placeholder="search collections"
                        searchText={searchCustomer}
                        handleSearch={handleCustomerSearch}
                    >
                        <Fragment>
                            {loading && <Spinner />}
                            {notFound}
                            <div className="result__list">
                                {bogo[pushIndex].customer_list &&
                                bogo[pushIndex].customer_list.length > 0
                                    ? bogo[pushIndex].customer_list.map(
                                          item => (
                                              <div
                                                  className="list"
                                                  key={item.id}
                                              >
                                                  <div className="left__item">
                                                      <Checkbox
                                                          checked={
                                                              item.isChecked
                                                          }
                                                          id={item.id}
                                                          onChange={
                                                              handleCustomerCheckbox
                                                          }
                                                      />
                                                  </div>
                                                  <div className="right__item">
                                                      <p className="primary_name">
                                                          {item.title}
                                                      </p>
                                                  </div>
                                              </div>
                                          )
                                      )
                                    : ""}

                                {isFetching && (
                                    <p className="text-center">loading...</p>
                                )}
                            </div>
                        </Fragment>
                    </CustomModal>
                )}

                {/* Products Modal */}
                {(BuyProductsModalOpen || GetProductsModalOpen) && (
                    <CustomModal
                        open={BuyProductsModalOpen || GetProductsModalOpen}
                        onClose={handleModalClose}
                        titleOne="Add"
                        titleTwo="Cancel"
                        handleSave={addCollections}
                        onScrolledToBottom={handleScrollBottom}
                        disabled={
                            checkedId && checkedId.length > 0 ? false : true
                        }
                        heading="Add products"
                        placeholder="search products"
                        searchText={searchCustomer}
                        handleSearch={handleCustomerSearch}
                    >
                        <Fragment>
                            {loading && <Spinner />}
                            {notFound}
                            <div className="result__list">
                                {bogo[pushIndex].customer_list &&
                                bogo[pushIndex].customer_list.length > 0
                                    ? bogo[pushIndex].customer_list.map(
                                          item => (
                                              <div
                                                  className="list"
                                                  key={item.id}
                                              >
                                                  <div className="left__item">
                                                      <Checkbox
                                                          checked={
                                                              item.isChecked
                                                          }
                                                          id={item.id}
                                                          onChange={
                                                              handleCustomerCheckbox
                                                          }
                                                      />
                                                  </div>
                                                  <div className="right__item">
                                                      <p className="primary_name">
                                                          {item.title}
                                                      </p>
                                                  </div>
                                              </div>
                                          )
                                      )
                                    : ""}

                                {isFetching && (
                                    <p className="text-center">loading...</p>
                                )}
                            </div>
                        </Fragment>
                    </CustomModal>
                )}
            </Frame>
        </Fragment>
    );
};

export default Bogo;
