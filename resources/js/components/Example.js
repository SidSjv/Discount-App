import React from "react";
import ReactDOM from "react-dom";

import Index from "./Index";
import { BrowserRouter as Router } from "react-router-dom";

const Example = () => {
    return (
        <Router>
            <Index />
        </Router>
    );
};

export default Example;

if (document.getElementById("root")) {
    ReactDOM.render(<Example />, document.getElementById("root"));
}
