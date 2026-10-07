import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/cart-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { LangProvider } from "@/contexts/lang-context";
import CartDrawer from "@/components/cart/cart-drawer";
import ChatWidget from "@/components/chat/chat-widget";
import CookieConsent from "@/components/ui/cookie-consent";
import HomePage from "@/pages/home";
import CollectionPage from "@/pages/collection";
import ProductPage from "@/pages/product";
import CartPage from "@/pages/cart";
import CheckoutSuccessPage from "@/pages/checkout-success";
import StoryPage from "@/pages/story";
import CulturePage from "@/pages/culture";
import ContactPage from "@/pages/contact";
import FAQPage from "@/pages/faq";
import ShippingPage from "@/pages/shipping";
import SizeGuidePage from "@/pages/size-guide";
import CommunityPage from "@/pages/community";
import CareersPage from "@/pages/careers";
import TrackOrderPage from "@/pages/track-order";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/collection" component={CollectionPage} />
      <Route path="/product/:id">
        {(params) => <ProductPage id={params.id} />}
      </Route>
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/story" component={StoryPage} />
      <Route path="/culture" component={CulturePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/shipping" component={ShippingPage} />
      <Route path="/size-guide" component={SizeGuidePage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/track-order" component={TrackOrderPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <CartProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <CartDrawer />
          </WouterRouter>
          <ChatWidget />
          <CookieConsent />
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
