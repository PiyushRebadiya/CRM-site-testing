import { useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import AdminLayout from './components/adminLayout/AdminLayout';
import RegFirmInsert from './components/Master/RegisterFirmInsert/RegFirmInsert';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import LandingPage from './components/pages/LandingPage'
import LandingPage from "./components/Pages/LandingPage"
// import Snowfall from 'react-snowfall'
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import ContactForm from './components/Pages/Contact Us/ContactForm';
import PackageSelect from './components/Login/PackageSelect';
import SubscriptionPlan from './components/Pages/Pricing Plan/SubscriptionPlan';
function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
          {/* <Snowfall   
                color="#ddd"
                 snowflakeCount={200}
                 style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                  }} /> */}
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register" >
          <Register />
        </Route>
        <Route path="/dashboard" >
          <AdminLayout />
        </Route>
        <Route path="/usermaster" >
          <AdminLayout />
        </Route>
        <Route path="/categorymaster" >
          <AdminLayout />
        </Route>
        <Route path="/subcategorymaster" >
          <AdminLayout />
        </Route>
        <Route path="/projectmaster" >
          <AdminLayout />
        </Route>
        <Route path="/taskmaster" >
          <AdminLayout />
        </Route>
        <Route path="/userprofile" >
          <AdminLayout />
        </Route>
        <Route path="/department" >
          <AdminLayout />
        </Route>
        <Route path="/menulist" >
          <AdminLayout />
        </Route>
        <Route path="/roleright" >
          <AdminLayout />
        </Route>
        <Route path="/bank" >
          <AdminLayout />
        </Route>
        <Route path="/ifsc" >
          <AdminLayout />
        </Route>
        <Route path="/company" >
          <AdminLayout />
        </Route>
        {/* <Route path="/firmmaster" >
          <AdminLayout />
        </Route> */}
        <Route path="/employeemaster" >
          <AdminLayout />
        </Route>
        <Route path="/newfirm" >
          <RegFirmInsert />
        </Route>
        <Route path="/role" >
          <AdminLayout />
        </Route>
        <Route path="/party" >
          <AdminLayout />
        </Route>
        <Route path="/agentmaster" >
          <AdminLayout />
        </Route>
        <Route path="/salespersonmaster" >
          <AdminLayout />
        </Route>
        <Route path="/proformaentry" >
          <AdminLayout />
        </Route>
        <Route path="/receiptentry" >
          <AdminLayout />
        </Route>
        <Route path="/expenseentry" >
          <AdminLayout />
        </Route>
        <Route path="/documentupload" >
          <AdminLayout />
        </Route>
        <Route path="/receiptregister" >
          <AdminLayout />
        </Route>
        <Route path="/expenseregister" >
          <AdminLayout />
        </Route>
        <Route path="/reminder" >
          <AdminLayout />
        </Route>
        <Route path="/taskregister" >
          <AdminLayout />
        </Route>
        <Route path="/outstandingreport" >
          <AdminLayout />
        </Route>
        <Route path="/taskdashboard" >
          <AdminLayout />
        </Route>
        <Route path="/reminderdashboard" >
          <AdminLayout />
        </Route>
        <Route path="/sales" >
          <AdminLayout />
        </Route>
        <Route path="/purchase" >
          <AdminLayout />
        </Route>
        <Route path="/inquiry" >
          <AdminLayout />
        </Route>
        <Route path="/proformaregister" >
          <AdminLayout />
        </Route>
        <Route path="/salesregister" >
          <AdminLayout />
        </Route>
        <Route path="/purchaseregister" >
          <AdminLayout />
        </Route>
        <Route path="/inquirydashboard" >
          <AdminLayout />
        </Route>
        <Route path="/inquirydeadline" >
          <AdminLayout />
        </Route>
        <Route path="/reminderdeadline" >
          <AdminLayout />
        </Route>
        <Route path="/salesdeadlines" >
          <AdminLayout />
        </Route>
        <Route path="/dscmanagement" >
          <AdminLayout />
        </Route>
        <Route path="/campaignmaster" >
          <AdminLayout />
        </Route>
        <Route path="/registration-plan" >
          <AdminLayout />
        </Route>
        <Route path="/subscription-plan" >
          <SubscriptionPlan/>
        </Route>
        <Route path="/taskscheduler" >
          <AdminLayout />
        </Route>
        <Route path="/processmaster" >
          <AdminLayout />
        </Route>
        <Route path="/payment" >
          <AdminLayout />
        </Route>
        <Route path="/purchaseoutstanding" >
          <AdminLayout />
        </Route>
        <Route path="/ledgerregister" >
          <AdminLayout />
        </Route>
        <Route path="/emailsetting" >
          <AdminLayout />
        </Route>
        <Route path="/taxfilemaintenance" >
          <AdminLayout />
        </Route>
        <Route path="/taxfileRenew" >
          <AdminLayout />
        </Route>
        <Route path="/contactuslist" >
          <AdminLayout />
        </Route>
        <Route path="/inquiryregister" >
          <AdminLayout />
        </Route>
        <Route path="/contactform" >
          <ContactForm />
        </Route>
        <Route path="/packageselection" >
          <PackageSelect />
        </Route>
        <Route path="/partnermaster" >
          <AdminLayout />
        </Route>
        <Route path="/whatsnew" >
          <AdminLayout />
        </Route>
        <Route path="/paymentlist" >
          <AdminLayout />
        </Route>
      </Switch >
    </Router >
  );
}

export default App;