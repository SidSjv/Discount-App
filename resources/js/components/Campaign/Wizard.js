import React, { Fragment, useEffect, useState } from "react";
import { Layout, Card } from "@shopify/polaris";
import Breadcumb from "../UI/Breadcumb";

import "./campaign.scss";
import { Link } from "react-router-dom";
import SeeMoreButton from "./../UI/SeeMoreButton";

const Wizard = () => {
    let initObj = {
        store_id: "",
        isOpen: false
    };
    const [state, setState] = useState(initObj);

    const { store_id, isOpen } = state;

    useEffect(() => {
        if (localStorage.discountapp_storeId) {
            setState({
                ...state,
                store_id: localStorage.discountapp_storeId
            });
        }
    }, []);
    return (
        <Fragment>
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
                        <Card sectioned>
                            <div className="campaign__wrapper">
                                <div className="campaign__icon">icon</div>
                                <div className="campaign__details">
                                    <h3 className="campaign__title">BOGO</h3>
                                    <p className="campaign__info">
                                        Create a customizable Buy X, Get Y offer
                                    </p>
                                    <div className="examples">
                                        <div>Examples:</div>
                                        <div className="examples__block">
                                            <div className="example__list">
                                                Buy 2 Free 1 ............{" "}
                                                <Link
                                                    to="/campaign/bogo"
                                                    className="link__text"
                                                >
                                                    {" "}
                                                    Create{" "}
                                                </Link>
                                            </div>
                                            <div className="example__list">
                                                Buy 2 Free 1 ............{" "}
                                                <Link
                                                    to="/campaign/bogo"
                                                    className="link__text"
                                                >
                                                    {" "}
                                                    Create{" "}
                                                </Link>
                                            </div>
                                            <div className="example__list">
                                                Buy 2 Free 1 ............{" "}
                                                <Link
                                                    to="/campaign/bogo"
                                                    className="link__text"
                                                >
                                                    {" "}
                                                    Create{" "}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-2">
                                <SeeMoreButton
                                    isOpen={isOpen}
                                    seeMoreText="Show all"
                                    seeLessText="Hide"
                                    click={() => console.log("clicked")}
                                />
                            </div>
                        </Card>

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
        </Fragment>
    );
};

export default Wizard;