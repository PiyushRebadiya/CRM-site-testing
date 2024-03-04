import React, { useEffect, useState } from 'react'
import Dashboard from '../Master/TaskDashboard/Dashboard'
import UserMaster from '../Master/UserMaster/UserMaster'
import CategoryMaster from '../Master/categoryMaster/CategoryMaster';
import TaxAdminMaster from '../Master/taxadmin/TaxAdminMaster';
import ProjectMaster from '../Master/projectMaster/ProjectMaster';
import WorkMaster from '../Master/workMaster/WorkMaster';
import UserProfile from './UserProfile';
import Header from '../Header';
import Footer from '../Footer'
import CompanyMaster from '../Master/companyMaster/CompanyMaster';
import AsignMenuMaster from './assignMenu/AssignMenuMain'
import { BrowserRouter as Router, Switch, Route, useLocation, useHistory } from "react-router-dom";
// import DepartmentMaster from '../Master/departmentMaster/DepartmentMaster';
import DepartmentMaster from '../Master/department-position/DepartmentMain'
// import PositionMaster from '../Master/positionMaster/PositionMaster';
import AssignMaster from './menuMaster/AssignMaster';
import BankMaster from '../Master/bankMaster/BankMaster';
import IfscMaster from '../Master/IFSC/IfscMaster';
// import FirmMaster from '../Master/firmMaster/FirmMaster'
import EmployeeMaster from '../Master/employeeMaster/EmployeeMaster';
// import RegFirmInsert from '../Master/RegisterFirmInsert/RegFirmInsert';
import RoleMaster from '../Master/Role/RoleMaster';
import PartyMaster from '../Master/PartyMaster/PartyMaster';
import SalesPersonMaster from '../Master/SalesPersonMaster/SalesPersonMaster';
import AgentMaster from '../Master/AgentMaster/AgentMaster';
import PerfomaMaster from '../Master/PerfomaMaster/PerfomaMaster';
import ReceiptMater from '../Master/receipt/ReceiptMaster'
import DocumentMaster from '../Master/documentUpload/DocumentMaster';
import ReportMaster from '../Master/report/ReportMaster';
import ReminderMaster from '../Master/reminder/ReminderMaster';
import TaskReportMaster from '../Master/taskReport/TaskReportMaster';
import OutStandingMaster from '../Master/outStanding/OutStandingMaster';
import ReminderDashboard from '../Master/ReminderDashboard/ReminderDashboard';
import MainDashboard from '../MainDashboard'
import InquiryMaster from '../Master/Inquiry Master/InquiryMaster';
import ProformaSalesMaster from '../Master/proformaSalesReport/ProformaSalesMaster';
import DashboardInquiry from '../Master/InquiryDashboard/DashboardInquiry';
import InqueryDeadlines from '../Master/deadlines/InqueryDeadlines';
import RemiderDeadlines from '../Master/deadlines/ReminderDeadlines'
import SalesDeadlines from '../Master/deadlines/SalesDeadlines';
import DscManagementMain from '../Master/DscManagement/DscManagementMain';
import CampaignMaster from '../Master/Campaign/CampaignMaster';
import AutoTaskMaster from "../Master/autoTask/AutoTaskMaster";
import ProcessMatser from '../Master/ProcessMaster/ProcessMaster';
import SalesMaster from "../../components/Sales/SalesMaster"
import PurchaseMaster from '../Master/purchase/PurchaseMaster';
import PurchaseOutStandingReport from '../Master/Purchase OutStanding-Report/PurchaseOutStandingReport';
import LedgerMAster from '../Master/Ledger Report/LedgerMAster';
import EmailSettings from '../Master/EmailSettings/EmailSettings';
import AlertMessage from '../Maintenance/AlertMessage';
import Maintenance from '../Maintenance/Maintenance';
import Contactus from '../Pages/Contact Us/ContactUsMaster'
import InquiryReportMaster from '../Master/Inquiry Report/InquiryReportMaster';
import RenwewLic from '../Renew/RenwewLic';
import CompanyListContext from "../context/filteredCompanyList";
import PartnerMaster from '../Master/partnerMaster/PartnerMaster';
import WhatsNew from '../Pages/WhatsNew/WhatsNew';
import RegistrationPlan from '../Pages/Pricing Plan/RegistrationPlan';
import PaymentMaster from '../Pages/PaymentList/PaymentMaster';

const AdminLayout = () => {
    const [filteredCompanyList, setFilteredCompanyList] = useState([]);

    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
        const token = localStorage.getItem("CRMtoken");
        if (!token && location.pathname != "/login" && location.pathname != "/register") {
            history.push("/login");
        }
    }, [location, history]);
    return (
        <Router>
            <CompanyListContext.Provider value={{ filteredCompanyList, setFilteredCompanyList }}>
                <Header />
                {/* <AlertMessage/> */}
                <Switch>
                    <Route path="/taxfilemaintenance">
                        <Maintenance />
                    </Route>
                    <Route path="/taxfileRenew">
                        <RenwewLic />
                    </Route>
                    <Route path="/dashboard">
                        <MainDashboard />
                    </Route>
                    <Route path="/taskdashboard">
                        <Dashboard />
                    </Route>
                    <Route path="/reminderdashboard">
                        <ReminderDashboard />
                    </Route>
                    <Route path="/usermaster" >
                        <UserMaster />
                    </Route>
                    <Route path="/categorymaster" >
                        <CategoryMaster />
                    </Route>
                    <Route path="/subcategorymaster" >
                        <TaxAdminMaster />
                    </Route>
                    <Route path="/projectmaster">
                        <ProjectMaster />
                    </Route>
                    <Route path="/taskmaster">
                        <WorkMaster />
                    </Route>
                    <Route path="/userprofile">
                        <UserProfile />
                    </Route>
                    <Route path="/department">
                        <DepartmentMaster />
                    </Route>
                    <Route path="/menulist">
                        <AssignMaster />
                    </Route>
                    <Route path="/roleright">
                        <AsignMenuMaster />
                    </Route>
                    <Route path="/bank">
                        <BankMaster />
                    </Route>
                    <Route path="/ifsc">
                        <IfscMaster />
                    </Route>
                    <Route path="/company">
                        <CompanyMaster />
                    </Route>
                    {/* <Route path="/firmmaster">
                    <FirmMaster />
                </Route> */}
                    <Route path="/employeemaster">
                        <EmployeeMaster />
                    </Route>
                    <Route path="/role">
                        <RoleMaster />
                    </Route>
                    <Route path="/party">
                        <PartyMaster />
                    </Route>
                    <Route path="/agentmaster">
                        <AgentMaster />
                    </Route>
                    <Route path="/salespersonmaster">
                        <SalesPersonMaster />
                    </Route>
                    <Route path="/proformaentry">
                        <PerfomaMaster />
                    </Route>
                    <Route path="/sales">
                        <SalesMaster />
                    </Route>
                    <Route path="/purchase">
                        <PurchaseMaster />
                    </Route>
                    <Route path="/receiptentry">
                        <ReceiptMater />
                    </Route>
                    <Route path="/expenseentry">
                        <ReceiptMater />
                    </Route>
                    <Route path="/payment">
                        <ReceiptMater />
                    </Route>
                    <Route path="/documentupload">
                        <DocumentMaster />
                    </Route>
                    <Route path="/receiptregister">
                        <ReportMaster />
                    </Route>
                    <Route path="/expenseregister">
                        <ReportMaster />
                    </Route>
                    <Route path="/reminder">
                        <ReminderMaster />
                    </Route>
                    <Route path="/taskregister">
                        <TaskReportMaster />
                    </Route>
                    <Route path="/outstandingreport">
                        <OutStandingMaster />
                    </Route>
                    <Route path="/purchaseoutstanding">
                        <PurchaseOutStandingReport />
                    </Route>
                    <Route path="/inquiry">
                        <InquiryMaster />
                    </Route>
                    <Route path="/proformaregister">
                        <ProformaSalesMaster />
                    </Route>
                    <Route path="/salesregister">
                        <ProformaSalesMaster />
                    </Route>
                    <Route path="/purchaseregister">
                        <ProformaSalesMaster />
                    </Route>
                    <Route path="/inquirydashboard">
                        <DashboardInquiry />
                    </Route>
                    <Route path="/inquirydeadline">
                        <InqueryDeadlines />
                    </Route>
                    <Route path="/reminderdeadline">
                        <RemiderDeadlines />
                    </Route>
                    <Route path="/salesdeadlines">
                        <SalesDeadlines />
                    </Route>
                    <Route path="/dscmanagement">
                        <DscManagementMain />
                    </Route>
                    <Route path="/campaignmaster">
                        <CampaignMaster />
                    </Route>
                    <Route path="/registration-plan">
                        <RegistrationPlan />
                    </Route>
                    <Route path="/taskscheduler">
                        <AutoTaskMaster />
                    </Route>
                    <Route path="/processmaster">
                        <ProcessMatser />
                    </Route>
                    <Route path="/ledgerregister">
                        <LedgerMAster />
                    </Route>
                    <Route path="/emailsetting">
                        <EmailSettings />
                    </Route>
                    <Route path="/contactuslist">
                        <Contactus />
                    </Route>
                    <Route path="/inquiryregister">
                        <InquiryReportMaster />
                    </Route>
                    <Route path="/partnermaster">
                        <PartnerMaster />
                    </Route>
                    <Route path="/whatsnew">
                        <WhatsNew />
                    </Route>
                    <Route path="/paymentlist">
                        <PaymentMaster />
                    </Route>
                </Switch>
                <Footer />
            </CompanyListContext.Provider>
        </Router>
    )
}

export default AdminLayout