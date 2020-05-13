import React from "react";
import { ChevronLeftMinor } from "@shopify/polaris-icons";
import { Icon, TextField, Card, Button, InlineError } from "@shopify/polaris";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";
//import moment from "moment";

const LunchPage = ({
    start_date,
    start_time,
    end_date,
    end_time,
    discount_name,
    back,
    campaign_name,
    onInputChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    launchCampaign,
    error
}) => {
    let dateFormat = "YYYY-MM-DD";
    let timeFormat = "HH:mm:ss";
    return (
        <div className="lunch__page">
            <div className="title__bar-wrapper mb-3">
                <div className="title__bar">
                    <div className="title__bar-navigation">
                        <div className="breadcumbs">
                            <button onClick={back}>
                                <Icon source={ChevronLeftMinor} />
                                <span>Back</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form__layout">
                <Card sectioned>
                    <div className="form__group">
                        <div className="form__field ">
                            <TextField
                                type="text"
                                helpText="Note: Only you can view it."
                                label={discount_name}
                                value={campaign_name}
                                onChange={onInputChange}
                                placeholder="Type here .."
                                error={
                                    error.campaign_name && error.campaign_name
                                }
                            />
                        </div>
                        <div className="form__field ">
                            <p className="mb-1">Active Dates</p>

                            <div className="flex__row-equal mb-2">
                                <div className="flex__row-item">
                                    <label className="Polaris-Labelled__LabelWrapper">
                                        Start date
                                    </label>
                                    <DatePicker
                                        onChange={handleStartDateChange}
                                        defaultValue={moment(
                                            start_date,
                                            dateFormat
                                        )}
                                    />
                                    <InlineError
                                        message={
                                            error.start_date && error.start_date
                                        }
                                    />
                                </div>
                                <div className="flex__row-item">
                                    <label className="Polaris-Labelled__LabelWrapper">
                                        Start time
                                    </label>
                                    <TimePicker
                                        onChange={handleStartTimeChange}
                                        defaultValue={moment(
                                            start_time,
                                            timeFormat
                                        )}
                                    />
                                    <InlineError
                                        message={
                                            error.start_time && error.start_time
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex__row-equal mb-2">
                                <div className="flex__row-item">
                                    <label className="Polaris-Labelled__LabelWrapper">
                                        End date
                                    </label>
                                    <DatePicker
                                        onChange={handleEndDateChange}
                                        defaultValue={moment(
                                            end_date,
                                            dateFormat
                                        )}
                                    />
                                    <InlineError
                                        message={
                                            error.end_date && error.end_date
                                        }
                                    />
                                </div>
                                <div className="flex__row-item">
                                    <label className="Polaris-Labelled__LabelWrapper">
                                        End time
                                    </label>
                                    <TimePicker
                                        onChange={handleEndTimeChange}
                                        defaultValue={moment(
                                            end_time,
                                            timeFormat
                                        )}
                                    />
                                    <InlineError
                                        message={
                                            error.end_time && error.end_time
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="pull__right mt-3 lunch__btn">
                <div className="mr-1">
                    <Button onClick={back} className="mr-1">
                        Back
                    </Button>
                </div>

                <Button primary onClick={launchCampaign}>
                    Launch
                </Button>
            </div>
        </div>
    );
};

export default LunchPage;
