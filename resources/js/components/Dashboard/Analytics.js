import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Analytics = () => {
    var sales_options = {
        chart: {
            type: "column",
            height: 320
        },
        xAxis: {
            categories: [
                "Total sales",
                "Returning order value",
                "Average order value",
                "Total values",
                "Top product by usits",
                "Total sales",
                "Returning order value",
                "Average order value",
                ""
            ]
        },
        yAxis: {
            title: {
                text: ""
            }
        },
        title: {
            text: null
        },
        plotOptions: {
            column: {
                colorByPoint: true
            }
        },
        colors: [
            "#47C1BF",
            "#006FBB",
            "#DE3618",
            "#C05717",
            "#5C6AC4",
            "#43467F",
            "#637381",
            "#9C6ADE"
        ],

        tooltip: {
            style: {
                color: "#fff"
            },
            backgroundColor: "#212B36"
        },
        series: [
            {
                name: "Name",
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
            }
        ]
    };
    return (
        <div className="analytics">
            <HighchartsReact highcharts={Highcharts} options={sales_options} />
        </div>
    );
};

export default Analytics;
