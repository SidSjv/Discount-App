import React, { useEffect, useState } from "react";
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
import "antd/es/date-picker/style/css";
import "@shopify/polaris/styles.css";
import "../../sass/app.scss";
import Dashboard from "./Dashboard/Dashboard";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import Wizard from "./Campaign/Wizard";
import Settings from "./Settings/Settings";
import Bogo from "./Campaign/BOGO/Bogo";
import Discount from "./Campaign/Discount/Discount";

const Index = props => {
    const [isFetched, setFetched] = useState(false);
    let location = useLocation();

    useEffect(() => {
        if (!localStorage.discountapp_token) {
            let query = new URLSearchParams(location.search);
            let store_id = query.get("store_id");
            axios
                .get(`home?store_id=${store_id}`)
                .then(res => {
                    //console.log(res);
                    let token = res.data.token;
                    //console.log("Get token", token);
                    localStorage.setItem("discountapp_token", token);
                    localStorage.setItem("discountapp_storeId", store_id);
                    window.axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                    setFetched(true);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            setFetched(true);
            window.axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${localStorage.discountapp_token}`;
        }
    }, []);

    if (isFetched) {
        return (
            <AppProvider i18n={en}>
                <div className="main_section">
                    <Switch>
                        <Route path="/home/" component={Dashboard} />
                        <Route exact path="/campaign" component={Wizard} />
                        <Route
                            exact
                            path="/campaign/bogo/:id"
                            component={Bogo}
                        />
                        <Route
                            exact
                            path="/campaign/discount/:id"
                            component={Discount}
                        />
                        <Route exact path="/settings" component={Settings} />
                    </Switch>
                </div>
            </AppProvider>
        );
    }

    return null;
};

export default Index;
