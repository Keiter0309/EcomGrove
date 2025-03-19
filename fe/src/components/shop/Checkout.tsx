import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
  const initialOptions = {
    clientId: `${import.meta.env.VITE_PAYPAL_CLIENT_ID}`,
    environment: "sandbox" as "sandbox",
    currency: "USD",
    intent: "capture",
  };
  return (  
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons style={{ layout: "vertical", shape: "rect" }} />
    </PayPalScriptProvider>
  );
}
