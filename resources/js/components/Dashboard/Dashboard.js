import React, { useState, useEffect } from "react";
import Analytics from "./Analytics";
import {
    Card,
    Tabs,
    Avatar,
    Select,
    ResourceList,
    ResourceItem,
    Badge,
    Pagination
} from "@shopify/polaris";
import Spinner from "../UI/Spinner";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    let initData = {
        selected: 0,
        filter: "",
        sort: "",
        data: "",
        store_id: "",
        loading: false
    };

    const [state, setState] = useState(initData);
    const [selectedItems, setSelectedItems] = useState([]);
    const [page, setpage] = useState(1);

    //Desctruct the state
    const { selected, filter, sort, data, loading, store_id } = state;

    //Use Effect
    useEffect(() => {
        let store_id = localStorage.getItem("discountapp_storeId");
        setState({
            ...state,
            loading: true
        });
        axios
            .get(`/campaign/${store_id}`)
            .then(res => {
                console.log(res);
                setState({
                    ...state,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
                setState({
                    ...state,
                    loading: false
                });
            });
    }, []);

    //On change
    const handleTabChange = selectedTabIndex => {
        setState({
            ...state,
            selected: selectedTabIndex
        });
    };

    const handleSelectChange = (value, id) => {
        setState({
            ...state,
            [id]: value
        });
    };

    //Pagination
    const nextPage = () => {
        params.page_number = page + 1;
        params.limit = 20;
        setpage(currentPage => currentPage + 1);
    };
    const previousPage = () => {
        params.page_number = page - 1;
        params.limit = 20;
        setpage(currentPage => currentPage - 1);
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
            content: "favourite",
            panelID: "favourite-discounts"
        }
    ];
    const filter_options = [
        { label: "Filter", value: "" },
        { label: "Discount code type", value: "yesterday" },
        { label: "Starts", value: "lastWeek" },
        { label: "Status", value: "yesterdayy" },
        { label: "Times used", value: "lastWeekk" }
    ];
    const sort_options = [
        { label: "Last created", value: "newestUpdate" },
        { label: "Discount code(A-Z)", value: "oldestUpdate" },
        { label: "Discount code(Z-A)", value: "mostSpent" },
        { label: "Start date(accending)", value: "mostOrders" },
        { label: "Start date(decending)", value: "mostOrders" },
        { label: "End date(accending)", value: "lastNameAlpha" },
        { label: "End date(decending)", value: "lastNameAlpha" }
    ];

    //Resourse Item
    const resourceName = {
        singular: "discount",
        plural: "discounts"
    };
    const items = [
        {
            id: 231,
            url: "customers/231",
            name: "Mae Jemison",
            location: "Decatur, USA"
        },
        {
            id: 246,
            url: "customers/246",
            name: "Ellen Ochoa",
            location: "Los Angeles, USA"
        },
        {
            id: 276,
            url: "customers/276",
            name: "Joe Smith",
            location: "Arizona, USA"
        }
    ];

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
        <div className="dashboard">
            {loading && <Spinner />}
            <h1 className="title mb-2">Sales Overview</h1>
            <Analytics />
            <div className="links__wrapper">
                <Link className="link__btn" to="/settings">
                    Settings
                </Link>
                <Link className="link__btn link__btn-primary" to="/discounts">
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
                                    onChange={handleSelectChange}
                                    value={filter}
                                    id="filter"
                                />
                            </div>
                            <div className="search_filter">
                                <div className="button_group">
                                    <div className="group_item">
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
                                                    type="text"
                                                    className="Polaris-TextField__Input search_input"
                                                    placeholder="Search discount codes"
                                                />
                                                <div className="Polaris-TextField__Backdrop"></div>
                                            </div>
                                        </form>
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
                                onChange={handleSelectChange}
                                value={sort}
                                id="sort"
                            />
                        </div>
                        <ResourceList
                            resourceName={resourceName}
                            items={items}
                            renderItem={renderItem}
                            selectedItems={selectedItems}
                            onSelectionChange={setSelectedItems}
                            bulkActions={bulkActions}
                            resolveItemId={resolveItemIds}
                            selectable
                        />
                    </div>
                </div>
            </Card>
            <div className="pagination__wrapper">
                <Pagination
                    onPrevious={previousPage}
                    onNext={nextPage}
                    hasPrevious={page > 1 ? true : false}
                    hasNext={data && data.length >= 20 ? true : false}
                />
            </div>
        </div>
    );
};

function renderItem(item, _, index) {
    const { id, url, name, location } = item;
    const media = <Avatar customer size="medium" name={name} />;

    return (
        <ResourceItem
            id={id}
            url={url}
            // media={media}
            sortOrder={index}
            accessibilityLabel={`View details for ${name}`}
        >
            <table>
                <tbody>
                    <tr>
                        <td style={{ width: "50%" }}>
                            <p>2020 Year End Sales</p>
                            <p>10% for Gold member</p>
                            <p>5% when buy more than 10 unit</p>
                            <p>Free Shipping if total amount>$500</p>
                        </td>
                        <td style={{ width: "20%" }}>
                            <Badge>Expired</Badge>{" "}
                        </td>
                        <td>0 used</td>
                        <td style={{ textAlign: "right" }}>
                            16 Feb 20 - 17 Feb 20
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
