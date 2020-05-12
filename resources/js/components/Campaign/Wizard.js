import React, { Fragment, useEffect, useState } from "react";
import { Layout, Card } from "@shopify/polaris";
import Breadcumb from "../UI/Breadcumb";
import { Link } from "react-router-dom";
import SeeMoreButton from "./../UI/SeeMoreButton";
import axios from "axios";
import Spinner from "../UI/Spinner";
import "./campaign.scss";

const Wizard = () => {
    let initObj = {
        store_id: "",
        isOpen: false,
        loading: false,
        discount_types: "",
        isFetched: false
    };
    const [state, setState] = useState(initObj);

    const { store_id, isOpen, loading, discount_types, isFetched } = state;

    useEffect(() => {
        if (localStorage.discountapp_storeId) {
            setState({
                ...state,
                loading: true
            });
            axios
                .get("/discount_types")
                .then(res => {
                    console.log(res.data.discounts);
                    let data = res.data;
                    setState({
                        ...state,
                        loading: false,
                        isFetched: true,
                        discount_types: data.discounts,
                        store_id: localStorage.discountapp_storeId
                    });
                })
                .catch(err => {
                    console.log(err);
                    setState({
                        ...state,
                        loading: false,
                        isFetched: true,
                        store_id: localStorage.discountapp_storeId
                    });
                });
        }
    }, []);
    return (
        <Fragment>
            {loading && <Spinner />}
            {isFetched && (
                <div className="wizard">
                    <div className="separator ">
                        <Breadcumb
                            breadcumb="Dashboard"
                            pathname={`/home?store_id=${store_id}`}
                        />
                    </div>
                    <Layout>
                        <Layout.AnnotatedSection
                            title="Offer"
                            description="Choose from a variety of easy-to-use templates to manage and promote  your sales and special offers."
                        >
                            {discount_types &&
                                discount_types.length > 0 &&
                                discount_types.map((discount, idx) => {
                                    let description = discount.description
                                        ? JSON.parse(discount.description)
                                        : null;
                                    return (
                                        <Card sectioned key={discount.id}>
                                            <div className="campaign__wrapper">
                                                <div className="campaign__icon">
                                                    icon
                                                </div>
                                                <div className="campaign__details">
                                                    <h3 className="campaign__title">
                                                        {discount.name}
                                                    </h3>
                                                    <p className="campaign__info">
                                                        Create a customizable
                                                        Buy X, Get Y offer
                                                    </p>
                                                    <div className="examples">
                                                        <div>Examples:</div>
                                                        <div className="examples__block">
                                                            {description &&
                                                                description.length >
                                                                    0 &&
                                                                description.map(
                                                                    (
                                                                        desc,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            className="example__list"
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            <p>
                                                                                {
                                                                                    desc.title
                                                                                }
                                                                                ............{" "}
                                                                            </p>

                                                                            {discount.name ===
                                                                                "BOGO" && (
                                                                                <Link
                                                                                    to={`/campaign/bogo/${desc.id}`}
                                                                                    className="link__text"
                                                                                >
                                                                                    {" "}
                                                                                    Create{" "}
                                                                                </Link>
                                                                            )}
                                                                            {discount.name ===
                                                                                "Discount" && (
                                                                                <Link
                                                                                    to={`/campaign/discount/${desc.id}`}
                                                                                    className="link__text"
                                                                                >
                                                                                    {" "}
                                                                                    Create{" "}
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center mt-2">
                                                <SeeMoreButton
                                                    isOpen={isOpen}
                                                    seeMoreText="Show all"
                                                    seeLessText="Hide"
                                                    click={() =>
                                                        console.log("clicked")
                                                    }
                                                />
                                            </div>
                                        </Card>
                                    );
                                })}

                            <div className="pull__right mt-3">
                                <Link
                                    to="/campaign/create"
                                    className="link__btn link__btn-primary"
                                >
                                    Rules Editor{" "}
                                </Link>
                            </div>
                        </Layout.AnnotatedSection>
                    </Layout>
                </div>
            )}
        </Fragment>
    );
};

export default Wizard;
