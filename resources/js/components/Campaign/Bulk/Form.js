import React, { Fragment } from "react";
import {
    Card,
    TextField,
    Icon,
    Button,
    Checkbox,
    InlineError
} from "@shopify/polaris";
import SeeMoreButton from ".././../UI/SeeMoreButton";
import { DeleteMajorMonotone, CancelSmallMinor } from "@shopify/polaris-icons";
import SelectField from "../../UI/SelectField";
import InputField from "../../UI/InputField";

const Form = ({
    el,
    idx,
    handleInputChange,
    handleSelectChange,
    handleSelect,
    removeSelectedCustomer,
    removeSelectedBuyIds,
    handleMaxUses,
    handleMinUses,
    handleLimitUser,
    removeClick,
    removeLevelClick,
    addLevel,
    handleSeeMore,
    handleModalOpenOnClick,
    handleLevleChange,
    length,
    levelLength
}) => {
    const discountValueOptions = [
        { label: "Percentage", value: "percentage" },
        { label: "Price Discount", value: "price_discount" },
        { label: "Fixed At Prioce", value: "fixed_amount" }
    ];
    const buysOptions = [
        {
            label: "Specific collections",
            value: "specific_collections"
        },
        {
            label: "Specific product",
            value: "specific_product"
        }
    ];

    const customerEligibilityOptions = [
        { label: "Everyone", value: "*" },
        {
            label: "Specific group of customers",
            value: "specific_group_customer"
        },
        {
            label: "Specific  customers",
            value: "specific_customer"
        }
    ];

    return (
        <Fragment>
            <Card sectioned>
                <div className="form__layout">
                    <div className="form__group">
                        <div className="form__field ">
                            <InputField
                                type="text"
                                label="Rule name"
                                value={el.name}
                                placeholder="e.g. SPRINGSALES"
                                name="name"
                                onChange={e => handleInputChange(e, idx)}
                                error={el.error.name && el.error.name}
                            />
                        </div>
                        <div className="form__field">
                            <div className="form__field-wrapper">
                                <TextField
                                    type="text"
                                    label="Rule type"
                                    value="Bulk"
                                />
                                {length > 1 && (
                                    <button
                                        className="icon link__btn"
                                        onClick={() => removeClick(idx)}
                                    >
                                        <Icon source={DeleteMajorMonotone} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {el.isOpen && (
                        <div className="see_more">
                            <div className="flex__wrapper">
                                <div className="flex__item">
                                    <div className="field__item">
                                        <div className="flex__item-wrapper">
                                            <div className="flex_one">
                                                <SelectField
                                                    name="buy_type"
                                                    options={buysOptions}
                                                    onChange={e =>
                                                        handleSelect(e, idx)
                                                    }
                                                    value={el.buy_type}
                                                    label="Customer buys"
                                                    error={
                                                        el.error.buy_type &&
                                                        el.error.buy_type
                                                    }
                                                />
                                            </div>
                                            <div className="browse__btn">
                                                <div>
                                                    <Button
                                                        onClick={() =>
                                                            handleModalOpenOnClick(
                                                                idx,
                                                                "collection"
                                                            )
                                                        }
                                                    >
                                                        Browse
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field__item">
                                        {el.buy_ids && el.buy_ids.length > 0
                                            ? el.buy_ids.map(el => (
                                                  <div className="customer__checked-list">
                                                      <div className="name">
                                                          {el.title}
                                                      </div>

                                                      <div className="remove__btn">
                                                          <button
                                                              onClick={() =>
                                                                  removeSelectedBuyIds(
                                                                      idx,
                                                                      el.id
                                                                  )
                                                              }
                                                          >
                                                              <Icon
                                                                  source={
                                                                      CancelSmallMinor
                                                                  }
                                                              />
                                                          </button>
                                                      </div>
                                                  </div>
                                              ))
                                            : ""}
                                    </div>
                                </div>

                                <div className="flex__item">
                                    {el.discount_levels &&
                                        el.discount_levels.length > 0 &&
                                        el.discount_levels.map((item, i) => (
                                            <Fragment key={i}>
                                                <div className="field__item ">
                                                    <div className="flex__item-wrapper add__level">
                                                        <InputField
                                                            label="Quantity"
                                                            type="number"
                                                            placeholder="e.g. 0-9"
                                                            name="quantity"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={e =>
                                                                handleLevleChange(
                                                                    e,
                                                                    idx,
                                                                    i
                                                                )
                                                            }
                                                        />
                                                        {levelLength > 1 && (
                                                            <button
                                                                className="icon link__btn"
                                                                onClick={() =>
                                                                    removeLevelClick(
                                                                        idx,
                                                                        i
                                                                    )
                                                                }
                                                            >
                                                                <Icon
                                                                    source={
                                                                        DeleteMajorMonotone
                                                                    }
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="field__item">
                                                    <div className="flex__row-equal">
                                                        <div className="flex__row-item">
                                                            <SelectField
                                                                name="discount_type"
                                                                options={
                                                                    discountValueOptions
                                                                }
                                                                onChange={e =>
                                                                    handleLevleChange(
                                                                        e,
                                                                        idx,
                                                                        i
                                                                    )
                                                                }
                                                                value={
                                                                    item.discount_type
                                                                }
                                                                label="At discount value"
                                                                error={
                                                                    el.error
                                                                        .discount_type &&
                                                                    el.error
                                                                        .discount_type
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex__row-item">
                                                            <InputField
                                                                type="number"
                                                                suffix={
                                                                    item.discount_type ===
                                                                    "percentage"
                                                                        ? "%"
                                                                        : null
                                                                }
                                                                prefix={
                                                                    item.discount_type ===
                                                                    "fixed_amount"
                                                                        ? "RM"
                                                                        : null
                                                                }
                                                                label="Value"
                                                                value={
                                                                    item.discount_value
                                                                }
                                                                name="discount_value"
                                                                onChange={e =>
                                                                    handleLevleChange(
                                                                        e,
                                                                        idx,
                                                                        i
                                                                    )
                                                                }
                                                                error={
                                                                    el.error
                                                                        .discount_value &&
                                                                    el.error
                                                                        .discount_value
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        ))}

                                    <div className="pull__right mt-2">
                                        <Button
                                            primary
                                            onClick={() => addLevel(idx)}
                                        >
                                            + Add Level
                                        </Button>
                                    </div>
                                    <div className="field__item">
                                        <div className="flex__item-wrapper">
                                            <div className="flex_one">
                                                <SelectField
                                                    name="customer_eligibility"
                                                    options={
                                                        customerEligibilityOptions
                                                    }
                                                    onChange={e =>
                                                        handleSelect(e, idx)
                                                    }
                                                    value={
                                                        el.customer_eligibility
                                                    }
                                                    label="Customer eligibility"
                                                    error={
                                                        el.error
                                                            .customer_eligibility &&
                                                        el.error
                                                            .customer_eligibility
                                                    }
                                                />
                                            </div>
                                            <div className="browse__btn">
                                                <div>
                                                    <Button
                                                        onClick={() =>
                                                            handleModalOpenOnClick(
                                                                idx,
                                                                "customer"
                                                            )
                                                        }
                                                    >
                                                        Browse
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field__item">
                                        {el.eligible_customers &&
                                        el.eligible_customers.length > 0
                                            ? el.eligible_customers.map(el => (
                                                  <div className="customer__checked-list">
                                                      <div className="name">
                                                          {el.first_name &&
                                                              el.first_name}{" "}
                                                          {el.last_name &&
                                                              el.last_name}
                                                          {el.name && el.name}
                                                      </div>

                                                      <div className="remove__btn">
                                                          <button
                                                              onClick={() =>
                                                                  removeSelectedCustomer(
                                                                      idx,
                                                                      el.id
                                                                  )
                                                              }
                                                          >
                                                              <Icon
                                                                  source={
                                                                      CancelSmallMinor
                                                                  }
                                                              />
                                                          </button>
                                                      </div>
                                                  </div>
                                              ))
                                            : ""}
                                    </div>
                                    <div className="field__item">
                                        <Checkbox
                                            label="Limit number of times this discount can be used in total"
                                            checked={el.max_uses}
                                            onChange={e =>
                                                handleMaxUses(e, idx)
                                            }
                                        />
                                        {el.max_uses && (
                                            <div className="col-5">
                                                <InputField
                                                    type="text"
                                                    value={
                                                        el.max_uses_per_order
                                                    }
                                                    name="max_uses_per_order"
                                                    onChange={e =>
                                                        handleInputChange(
                                                            e,
                                                            idx
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                        <InlineError
                                            message={
                                                el.error.max_uses_per_order &&
                                                el.error.max_uses_per_order
                                            }
                                        />
                                    </div>
                                    <div className="field__item">
                                        <Checkbox
                                            label="Limit number of times this discount can be used in total"
                                            checked={el.min_uses}
                                            onChange={e =>
                                                handleMinUses(e, idx)
                                            }
                                        />
                                        {el.min_uses && (
                                            <div className="col-5">
                                                <InputField
                                                    type="text"
                                                    value={el.min_use_per_order}
                                                    name="min_use_per_order"
                                                    onChange={e =>
                                                        handleInputChange(
                                                            e,
                                                            idx
                                                        )
                                                    }
                                                />
                                            </div>
                                        )}
                                        <InlineError
                                            message={
                                                el.error.min_use_per_order &&
                                                el.error.min_use_per_order
                                            }
                                        />
                                    </div>
                                    <div className="field__item">
                                        <Checkbox
                                            label="Limit to one use per customer"
                                            checked={
                                                el.limit_to_one_use_per_customer
                                            }
                                            onChange={e =>
                                                handleLimitUser(e, idx)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="text-center">
                        <SeeMoreButton
                            seeMoreText="set rule"
                            seeLessText="hide rule"
                            isOpen={el.isOpen}
                            click={() => handleSeeMore(idx)}
                        />
                    </div>
                </div>
            </Card>
        </Fragment>
    );
};

export default Form;
