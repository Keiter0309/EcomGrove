import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout() {
  return (
    <PayPalScriptProvider
      options={{ clientId: `${import.meta.env.VITE_PAYPAL_CLIENT_ID}` }}
    >
      <PayPalButtons style={{ layout: "vertical", shape: 'rect',  }} />
    </PayPalScriptProvider>
  );
}