import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useLocation,
    withRouter
} from "react-router-dom";
import "@shopify/polaris/styles.css";
import "../../sass/app.scss";
import Dashboard from "./Dashboard/Dashboard";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";

const Index = props => {
    let location = useLocation();
    useEffect(() => {
        let query = new URLSearchParams(location.search);
        let store_id = query.get("store_id");
        axios
            .get(`home?store_id=${store_id}`)
            .then(res => {
                console.log(res);
                let token = res.data.token;
                localStorage.setItem("discountapp_token", token);
                localStorage.setItem("discountapp_storeId", store_id);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <AppProvider i18n={en}>
            <div className="main_section">
                <Switch>
                    <Route path="/home/" component={Dashboard} />
                </Switch>
            </div>
        </AppProvider>
    );
};

export default Index;
