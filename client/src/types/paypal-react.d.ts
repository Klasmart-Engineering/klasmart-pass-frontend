declare module "@paypal/react-paypal-js" {
  import { PureComponent, ReactNode } from "react";

  export type CreateOrderData = {};

  type SHIPPING_PREFERENCE =
    | "GET_FROM_FILE"
    | "NO_SHIPPING"
    | "SET_PROVIDED_ADDRESS";

  type Address = {
    address_line_1: string;
    address_line_2: string;
    admin_area_2: string;
    admin_area_1: string;
    postal_code: string;
    country_code: string;
  };

  export type Payer = {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
    phone: {
      phone_number: string;
    };
    birth_date: string;
    tax_info: {
      tax_id: string;
      tax_id_type: string;
    };
    address: Address;
  };

  type Payee = {
    merchant_id: string;
    email_address: string;
  };

  interface Amount {
    currency_code: string;
    value: string;
  }

  interface AmountWithBreakdown extends Amount {
    breakdown?: {
      item_total: Amount;
      shipping: Amount;
      handling: Amount;
      tax_total: Amount;
      insurance: Amount;
      shipping_discount: Amount;
      discount: Amount;
    };
  }

  type PlatformFee = {
    amount: Amount;
    payee: Payee;
  };

  type PaymentInstruction = {
    platform_fees: PlatformFee[];
    disbursement_mode: "INSTANT" | "DELAYED";
  };

  type ShippingInfo = {
    name: {
      full_name: string;
    };
    address: Address;
  };

  type PurchaseItem = {
    name: string;
    quantity: string;
    unit_amount: Amount;
    tax?: Amount;
    description?: string;
    sku: string;
    category: "DIGITAL_GOODS" | "PHYSICAL_GOODS";
  };

  export type PurchaseUnit = {
    amount: AmountWithBreakdown;
    reference_id?: string;
    description?: string;
    custom_id?: string;
    invoice_id?: string;
    soft_descriptor?: string;
    payee?: Payee;
    payment_instruction?: PaymentInstruction;
    shipping?: ShippingInfo;
    items?: PurchaseItem[];
  };

  export type OrderApplicationContext = {
    brand_name: string;
    locale: string;
    landing_page: "LOGIN" | "BILLING" | "NO_PREFERENCE";
    shipping_preference: SHIPPING_PREFERENCE;
    user_action: "CONTINUE" | "PAY_NOW";
    payment_method: {};
    return_url: string;
    cancel_url: string;
    stored_payment_source: {};
  };

  export type CreateOptions = {
    intent: "CAPTURE" | "AUTHORIZE";
    purchase_units: PurchaseUnit[];
    payer?: Payer;
    application_context?: OrderApplicationContext;
  };

  type CreateOrderActions = {
    order: {
      create: (options: CreateOptions) => Promise<string>;
    };
  };

  export type OnApproveOrderData = {
    billingToken: string;
    facilitatorAccessToken: string;
    orderID: string;
    payerID: string;
    paymentID: string;
  };

  export type OnApproveOrderActions = {
    order: {
      create: (options: CreateOptions) => Promise<string>;
    };
  };

  export type OnCancelledOrderData = {
    orderID: string;
  };

  export type OnCancelledOrderActions = {
    redirect: () => void;
  };

  type PayPalButtonsProps = {
    createOrder?: (data: CreateOrderData, actions: CreateOrderActions) => void;
    createSubscription?: () => void;
    fundingSource?: string;
    style?: {
      color?: string;
      height?: number;
      label?: string;
      layout?: string;
      shape?: string;
      tagline?: boolean;
    };
    shippingPreference?: SHIPPING_PREFERENCE;
    onApprove?: (
      data: OnApproveOrderData,
      actions: OnApproveOrderActions
    ) => void;
    onCancel?: (data: OnCancelOrderData, actions: OnCancelOrderActions) => void;
    onClick?: () => void;
    onError?: () => void;
    onInit?: () => void;
    onShippingChange?: () => void;
  };

  export class PayPalButtons extends PureComponent<PayPalButtonsProps, {}> {}

  type PayPalScriptProviderProps = {
    options: {
      "client-id": string;
      "merchant-id"?: string;
      currency?: string;
      intent?: string;
      commit?: boolean;
      vault?: boolean | string;
      components?: string;
      "disable-funding"?: string;
      /*
       * @deprecated
       */
      "disable-card"?: string;
      "integration-date"?: string;
      debug?: boolean | string;
      "buyer-country"?: string;
      locale?: string;
      "data-partner-attribution-id"?: string;
      "data-csp-nonce"?: string;
      "data-order-id"?: string;
      "data-page-type"?: string;
    };
    children: ReactNode;
  };

  export class PayPalScriptProvider extends PureComponent<
    PayPalScriptProviderProps,
    {}
  > {}
}
