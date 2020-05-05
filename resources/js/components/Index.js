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
import "@shopify/polaris/styles.css";
import "../../sass/app.scss";
import Dashboard from "./Dashboard/Dashboard";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import Wizard from "./Campaign/Wizard";
import Settings from "./Settings/Settings";

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
                    console.log(res);
                    let token = res.data.token;
                    //console.log("token", token);
                    localStorage.setItem("discountapp_token", token);
                    localStorage.setItem("discountapp_storeId", store_id);
                    setFetched(true);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            setFetched(true);
        }
    }, []);

    if (isFetched) {
        return (
            <AppProvider i18n={en}>
                <div className="main_section">
                    <Switch>
                        <Route path="/home/" component={Dashboard} />
                        <Route exact path="/campaign" component={Wizard} />
                        <Route exact path="/settings" component={Settings} />
                    </Switch>
                </div>
            </AppProvider>
        );
    }

    return null;
};

export default Index;
