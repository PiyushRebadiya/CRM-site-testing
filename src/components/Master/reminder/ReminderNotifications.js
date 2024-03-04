// ReminderNotifications.js
import axios from 'axios';
import moment from 'moment';
import { notification, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// Function to show the notification
const showNotification = (message, reminderId) => {
   
    notification.open({
        message: 'Reminder Due',
        description: (
            <div>
                <p>{message}</p>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => CloseNotification(reminderId)}
                >
                    Completed
                </Button>
            </div>
        ),
        icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }}/>,
    });
};
let apiResponse
// Function to close the notification
const CloseNotification = async (id) => {
     const URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('CRMtoken');
    const custId = localStorage.getItem('CRMCustId');
    const CompanyId = localStorage.getItem('CRMCompanyId');
   
    const reminderIdToUpdate = id;
    try {
        const res = await axios.get(URL + `/api/Master/ReminderById?ReminderId=${id}`, {
            headers: { Authorization: `bearer ${token}` },
        });
        // setApiData(res.data);
        apiResponse = res.data
    } catch (error) {
        console.log(error);
    }
    try {
        // Make an API call to update the reminder
        const res = await axios.post(URL + "/api/Master/CreateReminder", {
            Flag: "U",
            Reminder: {
                ReminderId: apiResponse.ReminderId,
                ReminderName: apiResponse.ReminderName,
                PartyId: apiResponse.PartyId,
                CompanyID: apiResponse.CompanyID,
                ReminderDate: apiResponse.ReminderDate,
                ReminderType: apiResponse.ReminderType,
                IsExtend: apiResponse.IsExtend,
                IsActive: apiResponse.IsActive,
                AutoClose: true,
                IPAddress: apiResponse.IPAddress,
                UserID: apiResponse.UserID,
                UserName: apiResponse.UserName,
                ServerName: apiResponse.ServerName,
                EntryTime: new Date(),
                ReferenceId: apiResponse.ReferenceId
            }
        }, {
            headers: { Authorization: `bearer ${token}` },
        });
        if (res.data.Success) {

        } else {
        }
    } catch (error) {
        console.error(error);
    }
};

// Function to check and show notifications
const checkAndShowNotifications = (data) => {
    const currentDate = new Date();
    const today = moment();

    data.forEach((item) => {
        const eventDate = new Date(item.ReminderDate);
        const daysUntilEvent = moment(item.ReminderDate).diff(today, 'days');

        if (daysUntilEvent >= 0 && daysUntilEvent <= 10 && !item.AutoClose) {
            showNotification(`Reminder for ${item.ReminderName} is due in ${daysUntilEvent} days.`, item.ReminderId);
        }
    });
};

export { checkAndShowNotifications };
