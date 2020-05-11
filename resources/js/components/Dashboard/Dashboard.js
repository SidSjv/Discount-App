import React, { useState, useEffect, Fragment } from "react";
import Analytics from "./Analytics";
import {
    Card,
    Tabs,
    Select,
    ResourceList,
    ResourceItem,
    Badge,
    Pagination
} from "@shopify/polaris";
import Spinner from "../UI/Spinner";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";

const { RangePicker } = DatePicker;

const Dashboard = () => {
    let initData = {
        selected: 0,
        filter: "",
        sort: "",
        sortOrder: "",
        sortBy: "",
        campaigns: "",
        store_id: "",
        loading: false,
        isFetched: false,
        items: [],
        tab: "",
        placeholder: "Search discount code",
        inputType: "text"
    };

    const [state, setState] = useState(initData);
    const [selectedItems, setSelectedItems] = useState([]);
    const [page, setpage] = useState(1);
    const [{ from, to }, setDate] = useState({
        from: "",
        to: ""
    });

    //Desctruct the state
    const {
        selected,
        filter,
        sort,
        sortBy,
        sortOrder,
        campaigns,
        loading,
        store_id,
        isFetched,
        items,
        tab,
        placeholder,
        inputType
    } = state;

    const [searchTerm, setsearchTerm] = useState("");

    //Utils function
    const getItems = campaigns => {
        let items =
            campaigns &&
            campaigns.length > 0 &&
            campaigns.map(i => {
                let obj = {
                    id: i.campaign_id,
                    name: i.name,
                    start_date: i.start_date,
                    end_date: i.end_date,
                    status: i.status,
                    times_used: i.times_used
                };
                let description = [];
                obj.description = description;
                if (i.bogo && i.bogo.length > 0) {
                    i.bogo.map(item => {
                        description.push(item);
                    });
                }
                if (i.bulk && i.bulk.length > 0) {
                    i.bulk.map(item => {
                        description.push(item);
                    });
                }
                if (i.discount && i.discount.length > 0) {
                    i.discount.map(item => {
                        description.push(item);
                    });
                }

                return obj;
            });

        return items;
    };

    //Use Effect
    useEffect(() => {
        setState({
            ...state,
            loading: true
        });
        axios
            .get(`/campaign`)
            .then(res => {
                console.log(res.data.campaigns);
                let data = res.data;
                setState({
                    ...state,
                    loading: false,
                    campaigns: data.campaigns,
                    isFetched: true,
                    items: getItems(data.campaigns)
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    loading: false,
                    isFetched: true
                });
            });
    }, []);

    // For filter and sort
    useEffect(() => {
        if (sort || filter || tab) {
            getFilterData();
        }
        console.log("changed");
    }, [sort, tab, to]);

    // Get Filter data

    const getFilterData = (search, pageNumber) => {
        let params = {
            tab: tab === "" ? "all" : tab
        };

        if (sortOrder) {
            params.sortBy = sortBy;
            params.sortOrder = sortOrder;
        }
        if (searchTerm) {
            if (filter) {
                if (filter === "status") {
                    params.status = searchTerm;
                } else if (filter === "times_used") {
                    params.times_used = searchTerm;
                } else if (filter === "starts") {
                    params.starts = searchTerm;
                } else if (filter === "discount_type") {
                    params.discount_type = searchTerm;
                }
            } else {
                params.searchTerm = searchTerm;
            }
        }
        if (search) {
            if (filter) {
                if (filter === "status") {
                    params.status = search;
                } else if (filter === "times_used") {
                    params.times_used = search;
                } else if (filter === "starts") {
                    params.starts = search;
                } else if (filter === "discount_type") {
                    params.discount_type = search;
                }
            } else {
                params.searchTerm = search;
            }
        }

        if (pageNumber) {
            params.page = pageNumber;
        }
        if (page) {
            params.page = page;
        }

        if (from) {
            params.starts = from;
        }
        setState({
            ...state,
            loading: true
        });
        axios
            .get("/campaign", { params: params })
            .then(res => {
                console.log(res);
                let data = res.data;
                setState({
                    ...state,
                    loading: false,
                    campaigns: data.campaigns,
                    isFetched: true,
                    items: getItems(data.campaigns)
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    loading: false,
                    isFetched: true
                });
            });
    };

    //On change
    const handleTabChange = selectedTabIndex => {
        setState({
            ...state,
            selected: selectedTabIndex,
            tab: tabs[selectedTabIndex].id
        });
    };

    //Handel Date picker change
    const handelDateChange = (date, dateString) => {
        // console.log(date, dateString);
        setDate({
            from: dateString[0],
            to: dateString[1]
        });
    };

    // const handleSelectChange = (value, id) => {
    //     setState({
    //         ...state,
    //         [id]: value,
    //     });
    // };

    //Handle search campaign

    const handleSearchCampaign = e => {
        const { value } = e.target;
        setsearchTerm(value);

        setTimeout(() => {
            getFilterData(value);
        }, 1000);
    };
    //Handle Filter cahnge
    const handleFilterChange = value => {
        let inputType, placeholder;

        if (value === "times_used") {
            inputType = "number";
            placeholder = "Search by time used";
        }
        if (value === "discount_type") {
            inputType = "text";
            placeholder = "Search by discount code type";
        }
        if (value === "status") {
            inputType = "text";
            placeholder = "Search by status";
        }
        if (value === "starts") {
            inputType = "date";
            placeholder = "Search discount code";
        }
        if (value === "") {
            inputType = "text";
            placeholder = "Search discount code";
        }

        setState({
            ...state,
            filter: value,
            placeholder,
            inputType
        });
    };

    //Handle sort change

    const handleSortChange = value => {
        let sortBy, sortOrder;
        if (value === "discount(asc)") {
            sortBy = "name";
            sortOrder = "asc";
        }
        if (value === "discount(desc)") {
            sortBy = "name";
            sortOrder = "desc";
        }
        if (value === "start_date(asc)") {
            sortBy = "start_date";
            sortOrder = "asc";
        }
        if (value === "start_date(desc)") {
            sortBy = "start_date";
            sortOrder = "desc";
        }
        if (value === "end_date(asc)") {
            sortBy = "end_date";
            sortOrder = "asc";
        }
        if (value === "end_date(desc)") {
            sortBy = "end_date";
            sortOrder = "desc";
        }
        if (value === "created_at") {
            sortBy = "created_at";
            sortOrder = "desc";
        }
        setState({
            ...state,
            sort: value,
            sortBy: sortBy,
            sortOrder: sortOrder
        });
    };

    //Pagination
    const nextPage = () => {
        let page_number = page + 1;
        setpage(currentPage => currentPage + 1);
        getFilterData(null, page_number);
    };
    const previousPage = () => {
        let page_number = page - 1;
        setpage(currentPage => currentPage - 1);
        getFilterData(null, page_number);
    };

    //Tabs
    const tabs = [
        {
            id: "all",
            content: "All",
            accessibilityLabel: "All Discounts",
            panelID: "all-discounts"
        },
        {
            id: "active",
            content: "Active",
            panelID: "active-discounts"
        },
        {
            id: "scheduled",
            content: "Scheduled",
            panelID: "scheduled-discounts"
        },
        {
            id: "expired",
            content: "Expired",
            panelID: "expired-discounts"
        },
        {
            id: "favourite",
            content: "Favourite",
            panelID: "favourite-discounts"
        }
    ];
    const filter_options = [
        { label: "Filter", value: "" },
        {
            label: "Discount code type",
            value: "discount_type"
        },
        { label: "Starts", value: "starts" },
        { label: "Status", value: "status" },
        { label: "Times used", value: "times_used" }
    ];
    const sort_options = [
        { label: "Last created", value: "created_at" },
        {
            label: "Discount code(A-Z)",
            value: "discount(asc)"
        },
        {
            label: "Discount code(Z-A)",
            value: "discount(desc)"
        },
        {
            label: "Start date(accending)",
            value: "start_date(asc)"
        },
        {
            label: "Start date(decending)",
            value: "start_date(desc)"
        },
        {
            label: "End date(accending)",
            value: "end_date(asc)"
        },
        {
            label: "End date(decending)",
            value: "end_date(desc)"
        }
    ];

    //Resourse Item
    const resourceName = {
        singular: "discount",
        plural: "discounts"
    };
    // const items = [
    //     {
    //         id: 231,
    //         url: "customers/231",
    //         name: "Mae Jemison",
    //         location: "Decatur, USA"
    //     },
    //     {
    //         id: 246,
    //         url: "customers/246",
    //         name: "Ellen Ochoa",
    //         location: "Los Angeles, USA"
    //     },
    //     {
    //         id: 276,
    //         url: "customers/276",
    //         name: "Joe Smith",
    //         location: "Arizona, USA"
    //     }
    // ];

    const bulkActions = [
        {
            content: "Enable discount codes",
            onAction: () => console.log("Todo: implement bulk add tags")
        },
        {
            content: "Disable discount codes",
            onAction: () => console.log("Todo: implement bulk remove tags")
        },
        {
            content: "Delete discount codes",
            onAction: () => console.log("Todo: implement bulk delete")
        },
        {
            content: "Make favourite",
            onAction: () => console.log("Todo: implement bulk delete")
        }
    ];

    return (
        <Fragment>
            {loading && <Spinner />}

            {isFetched && (
                <div className="dashboard">
                    <h1 className="title mb-2">Sales Overview</h1>
                    <Analytics />
                    <div className="links__wrapper">
                        <Link className="link__btn" to="/settings">
                            Settings
                        </Link>
                        <Link
                            className="link__btn link__btn-primary"
                            to="/campaign"
                        >
                            Create Discounts
                        </Link>
                    </div>
                    <Card>
                        <Tabs
                            tabs={tabs}
                            selected={selected}
                            onSelect={handleTabChange}
                        ></Tabs>
                        <div className="content">
                            {/* Filter */}
                            <div className="table__filter">
                                <div className="filter_wrapper">
                                    <div className="export_filter">
                                        <Select
                                            options={filter_options}
                                            onChange={handleFilterChange}
                                            value={filter}
                                            id="filter"
                                        />
                                    </div>
                                    <div className="search_filter">
                                        <div className="button_group">
                                            <div className="group_item">
                                                {filter !== "starts" && (
                                                    <form>
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
                                                                type={inputType}
                                                                className="Polaris-TextField__Input search_input"
                                                                placeholder={
                                                                    placeholder
                                                                }
                                                                value={
                                                                    searchTerm
                                                                }
                                                                onChange={
                                                                    handleSearchCampaign
                                                                }
                                                            />

                                                            <div className="Polaris-TextField__Backdrop"></div>
                                                        </div>
                                                    </form>
                                                )}
                                                {filter === "starts" && (
                                                    <RangePicker
                                                        onChange={
                                                            handelDateChange
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="table">
                                <div className="sort_wrapper">
                                    <Select
                                        label="Sort by"
                                        labelInline
                                        options={sort_options}
                                        onChange={handleSortChange}
                                        value={sort}
                                        id="sortBy"
                                    />
                                </div>
                                {items && items.length > 0 ? (
                                    <ResourceList
                                        resourceName={resourceName}
                                        items={items}
                                        renderItem={renderItem}
                                        selectedItems={selectedItems}
                                        onSelectionChange={setSelectedItems}
                                        bulkActions={bulkActions}
                                        //resolveItemId={resolveItemIds}
                                        selectable
                                    />
                                ) : (
                                    <div className="not__found">
                                        {" "}
                                        <p>No campaign found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                    <div className="pagination__wrapper">
                        <Pagination
                            onPrevious={previousPage}
                            onNext={nextPage}
                            hasPrevious={page > 1 ? true : false}
                            hasNext={
                                campaigns && campaigns.length >= 25
                                    ? true
                                    : false
                            }
                        />
                    </div>
                </div>
            )}
        </Fragment>
    );
};

function renderItem(item, _, index) {
    const {
        id,
        name,
        start_date,
        end_date,
        status,
        description,
        times_used
    } = item;

    return (
        <ResourceItem
            id={id}
            // media={media}
            sortOrder={index}
            accessibilityLabel={`View details for ${name}`}
        >
            <table>
                <tbody>
                    <tr>
                        <td style={{ width: "50%" }}>
                            <p className="text__bold">{name}</p>
                            {description &&
                                description.length > 0 &&
                                description.map((item, idx) => (
                                    <p key={idx}>{item}</p>
                                ))}
                        </td>
                        <td style={{ width: "20%" }}>
                            <Badge>{status}</Badge>{" "}
                        </td>
                        <td>{times_used} used</td>
                        <td style={{ textAlign: "right" }}>
                            {dayjs(start_date).format("DD MMM YY")} -{" "}
                            {dayjs(end_date).format("DD MMM YY")}
                        </td>
                    </tr>
                </tbody>
            </table>
        </ResourceItem>
    );
}

function resolveItemIds({ id }) {
    return id;
}
export default Dashboard;
