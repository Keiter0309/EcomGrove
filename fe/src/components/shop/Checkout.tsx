import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    environment: "sandbox" as "sandbox",
    currency: "USD",
    intent: "capture",
  };

  const handleApprove = (orderId: string) => {
    console.log("Order Approved with ID:", orderId);
    // Handle post-payment actions like updating the backend
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical", shape: "rect" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: "0.1",
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then((details) => {
            handleApprove(data.orderID);
            if (details.payer) {
              console.log(
                "Transaction completed by:",
                details.payer.name?.given_name
              );
            } else {
              console.log(
                "Transaction completed, but payer details are unavailable."
              );
            }
          });
        }}
        onError={(err) => {
          console.error("An error occurred:", err);
        }}
      />
    </PayPalScriptProvider>
  );
}
