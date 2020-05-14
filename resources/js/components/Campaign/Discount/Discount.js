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
import moment from "moment";

import "../campaign.scss";

const Discount = () => {
    let initData = {
        store_id: "",
        campaign_name: "",
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        start_time: getCurrentTime(),
        end_date: moment(new Date()).format("YYYY-MM-DD"),
        end_time: getCurrentTime(),
        discount: [
            {
                data_list: "",
                name: "",
                discount_type: "percentage",
                discount_value: "",
                applies_to: "*",
                applied_ids: "",
                countries_applicable: "",
                select_country: "*",
                min_requirements: "none",
                min_req_value: "",
                eligible_customers: "",
                customer_eligibility: "*",
                max_no_of_uses: "",
                max_uses: false,
                limit_to_one_use_per_customer: false,
                error: {},
                isOpen: true
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
        isFetched: false,
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
        isFetched,
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
    const getCustomers = (searchText, name) => {
        let discounts = [...discount];
        let params = {
            page: page
        };
        if (searchText) {
            params.searchTerm = searchText;
        }

        if (name) {
            params.searchBy = "name";
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

    // Get customers groups
    const getCustomerGroups = (searchText, name) => {
        let discounts = [...discount];
        let params = {
            page: page
        };

        if (searchText) {
            params.searchTerm = searchText;
        }

        if (name) {
            params.searchBy = "name";
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
                console.log("get customers", data);
                let list = [];
                data.customer_groups.data &&
                    data.customer_groups.data.length > 0 &&
                    data.customer_groups.data.map(item => {
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
                    fetchData: data.customer_groups,
                    discount: discounts,
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

    // Get Collections
    const getCollections = (searchText, name) => {
        let discounts = [...discount];
        let params = {
            page: page
        };

        if (searchText) {
            params.searchTerm = searchText;
        }

        if (name) {
            params.searchBy = "title";
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
        });

        axios
            .get("/collection", { params: params })
            .then(res => {
                let data = res.data;
                console.log("get collections", data);
                let list = [];
                data.collections.data &&
                    data.collections.data.length > 0 &&
                    data.collections.data.map(item => {
                        if (discounts[pushIndex].applied_ids) {
                            discounts[pushIndex].applied_ids.map(el => {
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
                    fetchData: data.collections,
                    discount: discounts,
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

    // Get Collections
    const getProducts = (searchText, name) => {
        let discounts = [...discount];
        let params = {
            page: page
        };

        if (searchText) {
            params.searchTerm = searchText;
        }

        if (name) {
            params.searchBy = "title";
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
        });

        axios
            .get("/product", { params: params })
            .then(res => {
                let data = res.data;
                console.log("get products", data);
                let list = [];
                data.products.data &&
                    data.products.data.length > 0 &&
                    data.products.data.map(item => {
                        if (discounts[pushIndex].applied_ids) {
                            discounts[pushIndex].applied_ids.map(el => {
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
                    fetchData: data.products,
                    discount: discounts,
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

    const getCountries = (searchText, name) => {
        let discounts = [...discount];
        let params = {
            page: page
        };
        if (searchText) {
            params.searchTerm = searchText;
        }

        if (name) {
            params.searchBy = "name";
        }

        setState({
            ...state,
            loading: true,
            isFetched: false
        });

        axios
            .get("/countries", { params: params })
            .then(res => {
                let data = res.data;
                console.log("get countries", data);
                let list = [];
                data.countries.data &&
                    data.countries.data.length > 0 &&
                    data.countries.data.map(item => {
                        if (discounts[pushIndex].countries_applicable) {
                            discounts[pushIndex].countries_applicable.map(
                                el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                }
                            );
                        } else {
                            item["isChecked"] = false;
                        }

                        list.push(item);
                    });

                discounts[pushIndex].data_list = list;
                setState({
                    ...state,
                    fetchData: data.countries,
                    discount: discounts,
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
        if (customerGroupModalOpen) {
            getCustomerGroups();
        }
        if (collectionsModalOpen) {
            getCollections();
        }
        if (productsModalOpen) {
            getProducts();
        }
        if (countryModalOpen) {
            getCountries();
        }
    }, [
        customerModalOpen,
        customerGroupModalOpen,
        collectionsModalOpen,
        productsModalOpen,
        countryModalOpen
    ]);

    /****** On Chnage Handlers *******/

    const toggleActive = useCallback(() => setToast(toast => !toast), []);
    //Step form
    const nextStep = () => {
        if (handleValidations()) {
            setStep(step + 1);
        }
        //setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };

    //handle text field

    const handleInputChange = (e, i) => {
        const { name, value } = e.target;
        let discounts = [...discount];
        discounts[i] = {
            ...discounts[i],
            [name]: value,
            error: { ...discounts[i].error, [name]: "" }
        };
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
        discounts[i] = {
            ...discounts[i],
            [name]: value,
            error: { ...discounts[i].error, [name]: "" }
        };
        setState({
            ...state,
            discount: discounts,
            pushIndex: i
        });
    };

    //Select handler to open the modal
    const handleSelect = (e, i) => {
        const { value, name } = e.target;
        let discounts = [...discount];
        discounts[i] = {
            ...discounts[i],
            [name]: value,
            error: { ...discounts[i].error, [name]: "" }
        };

        let customerModalOpen = false,
            customerGroupModalOpen = false,
            collectionsModalOpen = false,
            productsModalOpen = false,
            countryModalOpen = false;
        if (value === "specific_customer") {
            customerModalOpen = true;
        }
        if (value === "specific_group_customer") {
            customerGroupModalOpen = true;
        }
        if (value === "specific_collections") {
            collectionsModalOpen = true;
        }
        if (value === "specific_product") {
            productsModalOpen = true;
        }
        if (value === "specific_countries") {
            countryModalOpen = true;
        }

        setState({
            ...state,
            discount: discounts,
            customerModalOpen,
            customerGroupModalOpen,
            collectionsModalOpen,
            productsModalOpen,
            countryModalOpen,
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

    /********* Fetch Data  ************/
    const fetchCustomers = () => {
        let discounts = [...discount];
        setState({
            ...state,
            page: state.page + 1,
            isFetching: true
        });

        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }

        axios
            .get("/customer", { params: params })
            .then(res => {
                let data = res.data;
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
                    });

                console.log("fetch", data.customers.data);

                discounts[pushIndex].data_list = discounts[
                    pushIndex
                ].data_list.concat(data.customers.data);
                console.log(discounts);

                setState({
                    ...state,
                    fetchData: data.customers,
                    isFetching: false,
                    isFetched: true,
                    discount: discounts
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    isFetched: true
                });
            });
    };
    const fetchCustomerGroups = () => {
        let discounts = [...discount];
        setState({
            ...state,
            page: state.page + 1,
            isFetching: true
        });

        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }

        axios
            .get("/customer/groups", { params: params })
            .then(res => {
                let data = res.data;
                data.customer_groups.data &&
                    data.customer_groups.data.length > 0 &&
                    data.customer_groups.data.map(item => {
                        if (discounts[pushIndex].eligible_customers) {
                            discounts[pushIndex].eligible_customers.map(el => {
                                if (el.id === item.id) {
                                    item["isChecked"] = true;
                                }
                            });
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.customer_groups.data);

                discounts[pushIndex].data_list = discounts[
                    pushIndex
                ].data_list.concat(data.customer_groups.data);
                console.log(discounts);

                setState({
                    ...state,
                    fetchData: data.customer_groups,
                    isFetching: false,
                    isFetched: true,
                    discount: discounts
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    isFetched: true
                });
            });
    };

    const fetchCollections = () => {
        let discounts = [...discount];
        setState({
            ...state,
            page: state.page + 1,
            isFetching: true
        });

        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }

        axios
            .get("/collection", { params: params })
            .then(res => {
                let data = res.data;
                data.collections.data &&
                    data.collections.data.length > 0 &&
                    data.collections.data.map(item => {
                        if (discounts[pushIndex].applied_ids) {
                            discounts[pushIndex].applied_ids.map(el => {
                                if (el.id === item.id) {
                                    item["isChecked"] = true;
                                }
                            });
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.collections.data);

                discounts[pushIndex].data_list = discounts[
                    pushIndex
                ].data_list.concat(data.collections.data);
                console.log(discounts);

                setState({
                    ...state,
                    fetchData: data.collections,
                    isFetching: false,
                    isFetched: true,
                    discount: discounts
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    isFetched: true
                });
            });
    };

    const fetchProducts = () => {
        let discounts = [...discount];
        setState({
            ...state,
            page: state.page + 1,
            isFetching: true
        });

        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }

        axios
            .get("/product", { params: params })
            .then(res => {
                let data = res.data;
                data.products.data &&
                    data.products.data.length > 0 &&
                    data.products.data.map(item => {
                        if (discounts[pushIndex].applied_ids) {
                            discounts[pushIndex].applied_ids.map(el => {
                                if (el.id === item.id) {
                                    item["isChecked"] = true;
                                }
                            });
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.products.data);

                discounts[pushIndex].data_list = discounts[
                    pushIndex
                ].data_list.concat(data.products.data);
                console.log(discounts);

                setState({
                    ...state,
                    fetchData: data.products,
                    isFetching: false,
                    isFetched: true,
                    discount: discounts
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    isFetched: true
                });
            });
    };
    const fetchCountries = () => {
        let discounts = [...discount];
        setState({
            ...state,
            page: state.page + 1,
            isFetching: true
        });

        let params = {
            page: page
        };
        if (search) {
            params.searchTerm = search;
        }

        axios
            .get("/product", { params: params })
            .then(res => {
                let data = res.data;
                data.countries.data &&
                    data.countries.data.length > 0 &&
                    data.countries.data.map(item => {
                        if (discounts[pushIndex].countries_applicable) {
                            discounts[pushIndex].countries_applicable.map(
                                el => {
                                    if (el.id === item.id) {
                                        item["isChecked"] = true;
                                    }
                                }
                            );
                        } else {
                            item["isChecked"] = false;
                        }
                    });

                console.log("fetch", data.countries.data);

                discounts[pushIndex].data_list = discounts[
                    pushIndex
                ].data_list.concat(data.countries.data);
                console.log(discounts);

                setState({
                    ...state,
                    fetchData: data.countries,
                    isFetching: false,
                    isFetched: true,
                    discount: discounts
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    isFetching: false,
                    isFetched: true
                });
            });
    };
    /***** Customer Related Actions  *****/

    //Remove Selected customers
    const removeSelectedCustomer = (idx, id) => {
        let discounts = [...discount];
        discounts[idx].eligible_customers = discounts[
            idx
        ].eligible_customers.filter(item => item.id !== id);

        setState({
            ...state,
            discount: discounts
        });
    };

    /***** Collections and products Related Actions  *****/

    const removeSelectedAppliedIds = (idx, id) => {
        let discounts = [...discount];
        discounts[idx].applied_ids = discounts[idx].applied_ids.filter(
            item => item.id !== id
        );

        setState({
            ...state,
            discount: discounts
        });
    };

    /***** Countries  *****/
    const removeSelectedCountry = (idx, id) => {
        let discounts = [...discount];
        discounts[idx].countries_applicable = discounts[
            idx
        ].countries_applicable.filter(item => item.id !== id);

        setState({
            ...state,
            discount: discounts
        });
    };

    /******  UI markup **********/

    const handleScrollBottom = () => {
        const { next_page_url } = fetchData;
        if (next_page_url) {
            if (customerModalOpen) {
                fetchCustomers();
            }
            if (customerGroupModalOpen) {
                fetchCustomerGroups();
            }
            if (collectionsModalOpen) {
                fetchCollections();
            }
            if (productsModalOpen) {
                fetchProducts();
            }
            if (countryModalOpen) {
                fetchCountries();
            }
        }
    };

    //Actions

    /**************** Common actions ************/

    //Search
    const handleSearch = e => {
        const { value } = e.target;

        setSearch(value);

        setTimeout(() => {
            if (customerModalOpen) {
                getCustomers(value, "name");
            }
            if (customerGroupModalOpen) {
                getCustomerGroups(value, "name");
            }
            if (collectionsModalOpen) {
                getCollections(value, "name");
            }
            if (productsModalOpen) {
                getProducts(value, "title");
            }
            if (countryModalOpen) {
                getCountries(value, "name");
            }
        }, 1000);
    };

    //Handle add id's to array
    const addData = () => {
        let discounts = [...discount];

        //Add checked data to eligible_customers array
        if (customerModalOpen || customerGroupModalOpen) {
            discounts[pushIndex] = {
                ...discounts[pushIndex],
                eligible_customers: discounts[
                    pushIndex
                ].data_list.filter(item => (item.isChecked ? item.id : ""))
            };
        }
        //Add checked data to eligible_customers array
        if (collectionsModalOpen || productsModalOpen) {
            discounts[pushIndex] = {
                ...discounts[pushIndex],
                applied_ids: discounts[pushIndex].data_list.filter(item =>
                    item.isChecked ? item.id : ""
                )
            };
        }

        //Add checked data to eligible_customers array
        if (countryModalOpen) {
            discounts[pushIndex] = {
                ...discounts[pushIndex],
                countries_applicable: discounts[
                    pushIndex
                ].data_list.filter(item => (item.isChecked ? item.id : ""))
            };
        }
        setState({
            ...state,
            customerModalOpen: false,
            customerGroupModalOpen: false,
            collectionsModalOpen: false,
            productsModalOpen: false,
            countryModalOpen: false,
            discount: discounts,
            checkedId: []
        });
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
            isOpen: true
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
            pushIndex: 0,
            checkedId: []
        });
    };

    //O click of Browse  button open the specific modal

    const handleModalOpenOnClick = (i, modalName) => {
        console.log(i, modalName);
        let customerModalOpen = false,
            customerGroupModalOpen = false,
            countryModalOpen = false,
            collectionsModalOpen = false,
            productsModalOpen = false;

        //For country modal
        if (modalName === "country") {
            if (discount[i].select_country === "specific_countries") {
                countryModalOpen = true;
            }
        }

        //Customer modal open
        if (modalName === "customer") {
            if (
                discount[i].customer_eligibility === "specific_group_customer"
            ) {
                customerGroupModalOpen = true;
            }
            if (discount[i].customer_eligibility === "specific_customer") {
                customerModalOpen = true;
            }
        }

        //Collections and products
        if (modalName === "collection") {
            if (discount[i].applies_to === "specific_collections") {
                collectionsModalOpen = true;
            }
            if (discount[i].applies_to === "specific_product") {
                collectionsModalOpen = true;
            }
        }

        setState({
            ...state,
            countryModalOpen,
            customerGroupModalOpen,
            customerModalOpen,
            collectionsModalOpen,
            productsModalOpen
        });
    };

    /* ******************** Validations ........... */

    const handleValidations = () => {
        let isValid = true;

        let discounts = [...discount];
        discounts.map((item, idx) => {
            if (item.name === "") {
                isValid = false;
                item.error.name = "Required";
            }
            if (item.discount_type === "") {
                isValid = false;
                item.error.discount_type = "Required";
            }
            if (
                (item.discount_type === "percentage" ||
                    item.discount_type === "fixed_amount") &&
                item.discount_value === ""
            ) {
                isValid = false;
                item.error.discount_value = "Required";
            }
            if (item.applies_to === "") {
                isValid = false;
                item.error.applies_to = "Required";
            }
            if (
                item.applies_to !== "*" &&
                item.applies_to !== "" &&
                item.applied_ids === ""
            ) {
                isValid = false;
                item.error.applies_to = "Required";
            }

            if (item.select_country === "") {
                isValid = false;
                item.error.select_country = "Required";
            }
            if (
                item.select_country.length > 1 &&
                item.countries_applicable === ""
            ) {
                item.error.select_country = "Required";
            }
            if (item.min_requirements !== "none" && item.min_req_value === "") {
                isValid = false;
                item.error.min_req_value = "Required";
            }
            if (
                item.customer_eligibility.length > 1 &&
                (item.eligible_customers === "" ||
                    (item.eligible_customers &&
                        item.eligible_customers.length < 1))
            ) {
                isValid = false;
                item.error.customer_eligibility = "Required";
            }
            if (item.max_no_of_uses === "") {
                isValid = false;
                item.error.max_no_of_uses = "Required";
            }
        });

        setState({
            ...state,
            discount: discounts
        });
        return isValid;
    };

    /* ******************** Lunch page ........... */
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

    const launchCampaign = () => {
        if (handleSubmitValidations()) {
            let discountArry = [];
            let sendObj = {
                campaign_name: campaign_name,
                start_date: `${start_date} ${start_time}`,
                end_date: `${end_date} ${end_time}`,
                discount_type: "Single",
                Discount: discountArry
            };

            discount.map(el => {
                let AppliedIds =
                    el.applies_to.length > 1
                        ? el.applied_ids.length &&
                          el.applied_ids.map(item => item.id)
                        : "";
                let countries;
                if (el.discount_value === "free_shipping") {
                    if (el.select_country.length > 1) {
                        countries =
                            el.countries_applicable &&
                            el.countries_applicable.length
                                ? el.countries_applicable.map(
                                      country => country.id
                                  )
                                : "";
                    } else {
                        countries = "*";
                    }
                }

                let customerIds;
                if (el.customer_eligibility.length > 1) {
                    customerIds =
                        el.eligible_customers &&
                        el.eligible_customers.length &&
                        el.eligible_customers.map(customer => customer.id);
                }

                discountArry.push({
                    name: el.name,
                    discount_type: el.discount_type,
                    discount_value: el.discount_value ? el.discount_value : "",
                    applies_to: el.applies_to,
                    applied_ids: AppliedIds,
                    countries_applicable: countries ? countries : "",
                    min_requirements: el.min_requirements,
                    min_req_value:
                        el.min_requirements !== "none" ? el.min_req_value : "",
                    customer_eligibility: el.customer_eligibility,
                    eligible_customers: customerIds ? customerIds : "",
                    max_no_of_uses: el.max_no_of_uses,
                    limit_to_one_use_per_customer:
                        el.limit_to_one_use_per_customer
                });

                return discountArry;
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

                    setTimeout(() => {
                        window.location.href = `/home?store_id=${store_id}`;
                    }, 2000);
                })
                .catch(err => {
                    setToast(true);
                    setToastErr(true);
                    setToastMsg("Something went wrong, please try again later");
                    console.log(err);
                });

            console.log(sendObj);
        }
    };
    /* ******************** UI markup ........... */
    const toastMarkup = toast ? (
        <Toast content={toastMsg} error={toastErr} onDismiss={toggleActive} />
    ) : null;

    const notFound =
        isFetched &&
        discount[pushIndex].data_list &&
        discount[pushIndex].data_list.length < 1 ? (
            <div className="no__result">No results found for "{search}"</div>
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
                                    handleSelect={handleSelect}
                                    removeSelectedCustomer={
                                        removeSelectedCustomer
                                    }
                                    removeSelectedAppliedIds={
                                        removeSelectedAppliedIds
                                    }
                                    removeSelectedCountry={
                                        removeSelectedCountry
                                    }
                                    handleMaxUses={handleMaxUses}
                                    handleLimitUser={handleLimitUser}
                                    addClick={addClick}
                                    removeClick={removeClick}
                                    handleSeeMore={handleSeeMore}
                                    handleModalOpenOnClick={
                                        handleModalOpenOnClick
                                    }
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
                    />
                )}
            </Frame>

            {/* Customer Modal */}
            {customerModalOpen && (
                <CustomModal
                    open={customerModalOpen}
                    onClose={handleModalClose}
                    titleOne="Add"
                    titleTwo="Cancel"
                    handleSave={addData}
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
                            {notFound}
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
                    handleSave={addData}
                    onScrolledToBottom={handleScrollBottom}
                    disabled={checkedId && checkedId.length > 0 ? false : true}
                    heading="Add customer groups"
                    placeholder="Search customer groups"
                    searchText={search}
                    handleSearch={handleSearch}
                >
                    <Fragment>
                        {loading && <Spinner />}
                        <div className="result__list">
                            {notFound}
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

            {/* Collections Modal */}
            {collectionsModalOpen && (
                <CustomModal
                    open={collectionsModalOpen}
                    onClose={handleModalClose}
                    titleOne="Add"
                    titleTwo="Cancel"
                    handleSave={addData}
                    onScrolledToBottom={handleScrollBottom}
                    disabled={checkedId && checkedId.length > 0 ? false : true}
                    heading="Add collections"
                    placeholder="Search collections"
                    searchText={search}
                    handleSearch={handleSearch}
                >
                    <Fragment>
                        {loading && <Spinner />}
                        <div className="result__list">
                            {notFound}
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
                                                  {item.title}
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

            {/* Products Modal */}
            {productsModalOpen && (
                <CustomModal
                    open={productsModalOpen}
                    onClose={handleModalClose}
                    titleOne="Add"
                    titleTwo="Cancel"
                    handleSave={addData}
                    onScrolledToBottom={handleScrollBottom}
                    disabled={checkedId && checkedId.length > 0 ? false : true}
                    heading="Add products"
                    placeholder="Search products"
                    searchText={search}
                    handleSearch={handleSearch}
                >
                    <Fragment>
                        {loading && <Spinner />}
                        <div className="result__list">
                            {notFound}
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
                                                  {item.title}
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

            {/* Products Modal */}
            {countryModalOpen && (
                <CustomModal
                    open={countryModalOpen}
                    onClose={handleModalClose}
                    titleOne="Add"
                    titleTwo="Cancel"
                    handleSave={addData}
                    onScrolledToBottom={handleScrollBottom}
                    disabled={checkedId && checkedId.length > 0 ? false : true}
                    heading="Add countries"
                    placeholder="Search countries"
                    searchText={search}
                    handleSearch={handleSearch}
                >
                    <Fragment>
                        {loading && <Spinner />}
                        <div className="result__list">
                            {notFound}
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
