// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Chart } from 'primereact/chart';
// import { Table } from 'react-bootstrap';

// function TaskCompletedChart({ taskcompletedata }) {
//     console.log(taskcompletedata,'test')
//     // React.useEffect(() => {
//     //     if (insertChartData) {
//     //         insertChartData.current = fetchData
//     //     }
//     // }, [])
//     const [chartData, setChartData] = useState({});
//     const [chartOptions, setChartOptions] = useState({});
//     const [inquiryData, setInquiryData] = useState([]);
//     const Role = localStorage.getItem('CRMRole');
//     const userid = localStorage.getItem('CRMUserId');
//     const companyId = localStorage.getItem('CRMCompanyId');
//     const URL = process.env.REACT_APP_API_URL;
//     const token = localStorage.getItem('CRMtoken');

//     // const fetchData = async () => {
//     //     try {

//     //         if (Role == 'Admin') {
//     //             // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}&TaskStatus=Complete`, {
//     //             const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
//     //                 headers: { Authorization: `bearer ${token}` }
//     //             })
//     //             console.log(res, "response")
//     //             setInquiryData(res.data)
//     //         }
//     //         else {
//     //             // const res = await axios.get(URL + `/api/Master/TaskList?CompanyId=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : userid}&AssignTo=${Role == 'Admin' ? '' : ''}&TaskStatus=Complete`, {
//     //             const res = await axios.get(URL + `/api/Master/GetDeadlineList1?CompanyID=${companyId}&Type=Task&AssignBy=${Role == 'Admin' ? '' : ''}&AssignTo=${Role == 'Admin' ? '' : userid}`, {
//     //                 headers: { Authorization: `bearer ${token}` }
//     //             })
//     //             setInquiryData(res.data)
//     //         }
//     //         // setInquiryData(res.data);
//     //         // console.log(res.data, 'datasforcharts');
//     //     } catch (error) {
//     //         console.log(error);
//     //     }
//     // };
//     // useEffect(() => {
//     //     fetchData();
//     // }, []);
//     // console.log(taskcompletedata, 'conqiroqrhqro')
//     const completedinquiry = taskcompletedata.filter((item) => item.TaskStatus == 'Complete')
//     // console.log(completedinquiry, 'conmopjwotwjp')

//     useEffect(() => {
//         // Process inquiryData and update chartData and chartOptions accordingly
//         const assignToData = {};
//         const labels = [];
//         const data = [];
//         const backgroundColors = [];

//         completedinquiry.forEach((item) => {
//             const assignTo = item.ATFName + ' ' + item.ATLName || 'Unassigned'; // If AssignTo is null, consider it as 'Unassigned'

//             if (!assignToData[assignTo]) {
//                 assignToData[assignTo] = 0;
//                 // Generate a dynamic color based on user ID (you can replace this with any unique identifier)
//                 const dynamicColor = generateDynamicColor(assignTo);
//                 backgroundColors.push(dynamicColor);
//             }

//             assignToData[assignTo]++;
//         });

//         for (const assignTo in assignToData) {
//             labels.push(assignTo);
//             data.push(assignToData[assignTo]);
//         }

//         const dynamicChartData = {
//             labels,
//             datasets: [
//                 {
//                     label: 'Total Inquiries',
//                     data,
//                     backgroundColor: backgroundColors,
//                 },
//             ],
//         };

//         setChartData(dynamicChartData);

//         const dynamicChartOptions = {
//             cutoutPercentage: 70,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                 },
//             },
//             legend: {
//                 position: 'right',
//                 align: 'middle',
//                           },
//         };

//         setChartOptions(dynamicChartOptions);
//     }, [taskcompletedata]);
//     const generateDynamicColor = (userId) => {
//         const hash = userId.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
//         const color = `hsl(${hash % 360}, 55%, 60%)`;
//         return color;
//     };
//     return (
//         <div>
//             <Chart type="doughnut" data={chartData} options={chartOptions} style={{ width: '75%', marginLeft: '25%' }} />
//             <div className='ms-4 mt-3'>
//                 <Table striped bordered hover variant="light" className='w-50'>
//                     <tbody >
//                         <tr>
//                             <td className='fs-5'>
//                                 Total Completed Task
//                             </td>
//                             <td className='fs-5'>
//                                 {completedinquiry.length}
//                             </td>
//                         </tr>
//                     </tbody>
//                 </Table>
//                 {/* <h5 style={{ fontSize: '1.3rem' }}> <i>Total Completed Task-{completedinquiry.length}</i></h5> */}
//             </div>
//         </div>
//     );
// }

// export default TaskCompletedChart;


import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
// import Table from 'react-bootstrap/Table';
import { Table } from 'antd';

function TaskCompletedChart({ taskcompletedata }) {
  // console.log(taskcompletedata,'chartDAta')
  const [chartOptions, setChartOptions] = useState({});
  const [inquiryData, setInquiryData] = useState([]);
  const Role = localStorage.getItem('CRMRole');
  const userid = localStorage.getItem('CRMUserId');
  const companyId = localStorage.getItem('CRMCompanyId');
  const URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('CRMtoken');

//   const PendingTask = taskchartdata.filter((item) => item.TaskStatus === 'Pending');
//   const RunningTask = taskchartdata.filter((item) => item.TaskStatus === 'InProgress');
  const CompletedTask = taskcompletedata.filter((item) => item.TaskStatus === 'Complete');

  useEffect(() => {
    const assignToData = {};
    const labels = [];
    const data = [];
    const backgroundColors = [];

    CompletedTask.forEach((item) => {
      const assignTo = item.ATFName + ' ' + item.ATLName || 'Unassigned';

      if (!assignToData[assignTo]) {
        assignToData[assignTo] = 0;
        const dynamicColor = generateDynamicColor(assignTo);
        backgroundColors.push(dynamicColor);
      }

      assignToData[assignTo]++;
    });

    for (const assignTo in assignToData) {
      labels.push(assignTo);
      data.push(assignToData[assignTo]);
    }

    const dynamicChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };

    const dynamicChartOptions = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        data: labels || [],
        bottom: 10,
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          bottom:'30',
          data: dynamicChartData.datasets[0].data.map((value, index) => {
            return {
              value,
              name: dynamicChartData.labels[index],
              itemStyle: {
                color: dynamicChartData.datasets[0].backgroundColor[index],
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
            };
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    setChartOptions({
      dynamicChartData,
      dynamicChartOptions,
      totalTasks: taskcompletedata.length,
      totalCompletedTasks: CompletedTask.length,
      // totalPendingTasks: PendingTask.length,
      // totalRunningTasks: RunningTask.length,
    });
  }, [taskcompletedata]);

  const generateDynamicColor = (userId) => {
    const hash = userId.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const color = `hsl(${hash % 360}, 58%, 60%)`;
    return color;
  };
  const generateLabelData = () => {
    const labelData = [];

    chartOptions.dynamicChartData?.datasets?.[0]?.data.forEach((value, index) => {
      const label = {
        value,
        name: chartOptions.dynamicChartData?.labels?.[index],
        itemStyle: {
          color: chartOptions.dynamicChartData?.datasets?.[0]?.backgroundColor?.[index],
        },
        label: {
          show: false, // Initially hide the label
          position: 'center',
          formatter: `{b}\n{c}`,
          fontSize: 14,
          fontWeight: 'bold',
        },
        emphasis: {
          label: {
            show: true, // Show the label on hover
          },
        },
      };

      labelData.push(label);
    });

    return labelData;
  };
  const dataSource = [
    {
      key: '1',
      label: 'Total Task',
      total: chartOptions.totalTasks,
      completed: chartOptions.totalCompletedTasks,
    },
  ];

  const columns = [
    {
      title: 'Total Task',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Total Completed',
      dataIndex: 'completed',
      key: 'completed',
    },
  ];
  
  return (
    <div>
      {chartOptions.dynamicChartOptions ? (
        <ReactECharts
          option={chartOptions.dynamicChartOptions}
          notMerge={true}
          lazyUpdate={true}
          style={{ width: '100%', marginLeft: '0%', height: '483px' }}
          opts={{ renderer: 'svg', pixelRatio: 2 }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
      <div className='mt-3'>
        <Table dataSource={dataSource} columns={columns} bordered={true} size="small" pagination={false} className='mt-5'/>
      </div>
    </div>
  );
}

export default TaskCompletedChart;
