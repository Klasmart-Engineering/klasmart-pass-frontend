import BLP from "./img/com_calmid_learnandplay_blp_standard.png";
import BLPPremium from "./img/com_calmid_badanamu_esl_premium.png";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { FormattedMessage } from "react-intl";
import React from "react";

export function getPaymentEndpoint() {
    return "" + process.env.PAYMENT_ENDPOINT
}

export function getAuthEndpoint() {
    return "" + process.env.AUTH_ENDPOINT
}

export function getAccountEndpoint() {
    return "" + process.env.ACCOUNT_ENDPOINT
}

export function getProductEndpoint() {
    return "" + process.env.PRODUCT_ENDPOINT
}

export function getOrganizationEndpoint(regionId: string) {
    switch (regionId.toLowerCase()) {
        case "seoul": {
            return "" + process.env.ORGANIZATION_SEOUL_ENDPOINT
        }
        case "mumbai": {
            return "" + process.env.ORGANIZATION_MUMBAI_ENDPOINT
        }
        case "tokyo": {
            return "" + process.env.ORGANIZATION_TOKYO_ENDPOINT
        }
        case "frankfurt": {
            return "" + process.env.ORGANIZATION_FRANKFURT_ENDPOINT
        }
        case "oregon": {
            return "" + process.env.ORGANIZATION_OREGON_ENDPOINT
        }
        default: {
            return "" + process.env.ORGANIZATION_ENDPOINT
        }
    }
}

export function isPremiumPass(passId: string) {
    return passId == "com.calmid.badanamu.esl.premium"
}

export function getImgByPassId(passId: string) {
    // Not fully dynamic because need to check everytime for every new pass
    // Could be more dynamic in the future (load image dynamically on the img path)
    if (isPremiumPass(passId)) {
        return BLPPremium
    }
    return BLP
}

export function getDetailsByPass(pass: any) {
    // Not such dynamic here but no way to get these infos from DB for now
    // 1 - Could be saved in an additional column in DynamoDB (map...)
    // 2 - Could be loaded from a json config file once new Pass is created, ...
    if (isPremiumPass(pass.passId)) {
        return [
            { name: "learning_pass_esl_lessons", value: "300+" },
            { name: "learning_pass_program_levels", value: <CheckRoundedIcon /> },
            { name: "learning_pass_hd_content", value: <CheckRoundedIcon /> },
            { name: "learning_pass_ad_free", value: <CheckRoundedIcon /> },
            { name: "learning_pass_animated_series", value: <FormattedMessage id="landing_number_episodes" /> },
            { name: "learning_pass_premium_songs", value: <FormattedMessage id="landing_number_minutes" /> },
            { name: "learning_pass_premium_apps", value: 3 },
            { name: "learning_pass_ot_purchase", value: formatCurrency(pass.currency) + pass.price },
        ];
    }
    return [
        { name: "learning_pass_esl_lessons", value: "300+" },
        { name: "learning_pass_program_levels", value: <CheckRoundedIcon /> },
        { name: "learning_pass_hd_content", value: <CheckRoundedIcon /> },
        { name: "learning_pass_ad_free", value: <CheckRoundedIcon /> },
        { name: "learning_pass_animated_series", value: <ClearRoundedIcon /> },
        { name: "learning_pass_premium_songs", value: <ClearRoundedIcon /> },
        { name: "learning_pass_premium_apps", value: <ClearRoundedIcon /> },
        { name: "learning_pass_ot_purchase", value: formatCurrency(pass.currency) + pass.price },
    ];
}

export function getPassNamePrice(pass: any) {
    var passInfo = { name: <FormattedMessage id="pass_name" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />, price: formatCurrency(pass.currency) + pass.price };
    // Not fully dynamic here just because of the formatted message content
    if (isPremiumPass(pass.passId)) {
        passInfo = { name: <FormattedMessage id="pass_name_premium" values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }} />, price: formatCurrency(pass.currency) + pass.price };
    }
    return passInfo
}

// com.calmid. ... -> com_calmid_ ...
export function formatPassId(passId: string) {
    return passId.split("\.").join("_")
}

export function formatCurrency(currency: string) {
    switch (currency) {
        default:
            return "US$"
    }
}