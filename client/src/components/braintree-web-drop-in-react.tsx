/*
Credit: https://github.com/Cretezy/braintree-web-drop-in-react/

MIT License

Copyright (c) 2018 Charles Crete

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {Dropin, Options} from "braintree-web-drop-in";
import * as BraintreeWebDropIn from "braintree-web-drop-in";
import * as React from "react";
import * as ReactDOM from "react-dom";

interface Props {
  options: Options;
  onInstance?: (braintree: Dropin) => any;
  onNoPaymentMethodRequestable?: () => void;
  onPaymentMethodRequestable?: (
    payload: {
      type: "CreditCard" | "PayPalAccount";
      paymentMethodIsSelected: boolean
    },
  ) => void;
  onPaymentOptionSelected?: (
    payload: { paymentOption: "card" | "paypal" | "paypalCredit" },
  ) => void;
}
export default class DropIn extends React.Component<Props> {
  public wrapper: HTMLElement;
  public instance: Dropin;

  constructor(props: Props) {
    super(props);
  }

  public async componentDidMount() {
    this.instance = await BraintreeWebDropIn.create({
      container: ReactDOM.findDOMNode(this.wrapper),
      ...this.props.options,
    });

    if (this.props.onNoPaymentMethodRequestable) {
      this.instance.on("noPaymentMethodRequestable", this.props.onNoPaymentMethodRequestable);
    }
    if (this.props.onPaymentMethodRequestable) {
      this.instance.on("paymentMethodRequestable", this.props.onPaymentMethodRequestable);
    }
    if (this.props.onPaymentOptionSelected) {
      this.instance.on("paymentOptionSelected", this.props.onPaymentOptionSelected);
    }
    if (this.props.onInstance) {
      this.props.onInstance(this.instance);
    }
  }

  public async componentWillUnmount() {
    if (this.instance) {
      await this.instance.teardown();
    }
  }

  public shouldComponentUpdate() {
    // Static
    return false;
  }

  public render() {
    return <div ref={(ref) => (this.wrapper = ref)} />;
  }
}
