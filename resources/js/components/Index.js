import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "@shopify/polaris/styles.css";
import "../../sass/app.scss";
import Dashboard from "./Dashboard/Dashboard";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";

function Index() {
    useEffect(() => {
        axios
            .get("home?store_id=1")
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    return (
        <AppProvider i18n={en}>
            <Router>
                <div className="main_section">
                    <Switch>
                        <Route path="/home/" component={Dashboard} />
                    </Switch>
                </div>
            </Router>
        </AppProvider>
    );
}

export default Index;

if (document.getElementById("root")) {
    ReactDOM.render(<Index />, document.getElementById("root"));
}
