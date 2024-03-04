// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';
// import Table from 'react-bootstrap/Table';

// function InquiryUserChart({ chartinqurydata }) {
//     // console.log(chartinqurydata, 'taskuser')
//     const [chartData, setChartData] = useState({});
//     const [chartOptions, setChartOptions] = useState({});
//     useEffect(() => {
//         // Process inquiryData and update chartData and chartOptions accordingly
//         const assignToData = {};
//         const labels = [];
//         const data = [];
//         const backgroundColors = [];

//         chartinqurydata.forEach((item) => {
//             const assignTo = item.TaskStatus || 'Unassigned'; // If AssignTo is null, consider it as 'Unassigned'

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
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                 },
//             },
//             legend: {
//                 position: 'right',
//                 align: 'middle'
//             },
//         };

//         setChartOptions(dynamicChartOptions);
//     }, [chartinqurydata]);
//     const generateDynamicColor = (userId) => {
//         const hash = userId.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
//         const color = `hsl(${hash % 360}, 40%, 60%)`;
//         return color;
//     };
//     const PendingTask = chartinqurydata.filter((item) => item.TaskStatus == 'Pending')
//     // console.log(PendingTask, 'pendibnfngign')
//     const RunningTask = chartinqurydata.filter((item) => item.TaskStatus == 'InProgress')
//     const CompletedTask = chartinqurydata.filter((item) => item.TaskStatus == 'Complete')

//     return (
//         <div>
//             <div>
//                 <Chart type="pie" data={chartData} options={chartOptions} style={{ width: '75%', marginLeft: '25%' }} />
//             </div>
//             <div className='ms-4 mt-3' >
//                 <Table striped bordered hover variant="light" className='w-50'>
//                     <tbody >
//                         <tr>
//                             <td className='fs-5'>
//                                 Total Inquiry
//                             </td>
//                             <td className='fs-5'>
//                                 {chartinqurydata.length}
//                             </td>
//                         </tr>
//                         <tr>
//                             <td className='fs-5'>
//                                 Total Compeletd Inquiry
//                             </td>
//                             <td className='fs-5'>
//                                 {CompletedTask.length}
//                             </td>
//                         </tr>
//                         <tr>
//                             <td className='fs-5'>
//                                 Total Pending Inquiry
//                             </td>
//                             <td className='fs-5'>
//                                 {PendingTask.length}
//                             </td>
//                         </tr>
//                         <tr>
//                             <td className='fs-5'>
//                                 Total Running Inquiry
//                             </td>
//                             <td className='fs-5'>
//                                 {RunningTask.length}
//                             </td>
//                         </tr>
//                     </tbody>
//                 </Table>
//                 {/* <h5 style={{ fontSize: '1.3rem' }}><i>Total Task-{chartinqurydata.length}</i></h5>
//                 <h5 style={{ fontSize: '1.3rem' }}><i>Total Compeletd Task-{CompletedTask.length}</i></h5>
//                 <h5 style={{ fontSize: '1.3rem' }}><i>Total Pending Task-{PendingTask.length}</i></h5>
//                 <h5 style={{ fontSize: '1.3rem' }}><i>Total Running Task-{RunningTask.length}</i></h5> */}
//             </div>
//         </div>
//     )
// }

// export default InquiryUserChart


import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
// import Table from 'react-bootstrap/Table';
import { Table } from 'antd';

function InquiryUserChart({ chartinqurydata }) {
  // console.log(taskchartdata,'chartDAta')
  const [chartOptions, setChartOptions] = useState({});
  const [inquiryData, setInquiryData] = useState([]);
  const Role = localStorage.getItem('CRMRole');
  const userid = localStorage.getItem('CRMUserId');
  const companyId = localStorage.getItem('CRMCompanyId');
  const URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('CRMtoken');

  const PendingTask = chartinqurydata.filter((item) => item.TaskStatus === 'Pending');
  const RunningTask = chartinqurydata.filter((item) => item.TaskStatus === 'InProgress');
  const CompletedTask = chartinqurydata.filter((item) => item.TaskStatus === 'Complete');
  const HoldTask = chartinqurydata.filter((item) => item.TaskStatus === 'Hold');
  const CancelTask = chartinqurydata.filter((item) => item.TaskStatus === 'Cancel');

  useEffect(() => {
    const assignToData = {};
    const labels = [];
    const data = [];
    const backgroundColors = [];

    chartinqurydata.forEach((item) => {
      const assignTo = item.TaskStatus || 'Unassigned';

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
          label: 'Total Inquiries',
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };

    const dynamicChartOptions = {
      cutoutPercentage: 70,
      legend: {
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
      },
    };

    setChartOptions({
      dynamicChartData,
      dynamicChartOptions,
      totalTasks: chartinqurydata.length,
      totalCompletedTasks: CompletedTask.length,
      totalPendingTasks: PendingTask.length,
      totalRunningTasks: RunningTask.length,
      totalHoldTasks: HoldTask.length,
      totalCancelTasks: CancelTask.length,
    });
  }, [chartinqurydata]);

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
      pending: chartOptions.totalPendingTasks,
      running: chartOptions.totalRunningTasks,
      hold:chartOptions.totalHoldTasks,
      cancel:chartOptions.totalCancelTasks,
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
    {
      title: 'Total Pending',
      dataIndex: 'pending',
      key: 'pending',
    },
    {
      title: 'Total Running',
      dataIndex: 'running',
      key: 'running',
    },
    {
      title: 'Total Hold',
      dataIndex: 'hold',
      key: 'hold',
    },
    {
      title: 'Total Cancel',
      dataIndex: 'cancel',
      key: 'cancel',
    },
  ];
  return (
    <div>
       <ReactECharts
        option={{
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                position: 'outside',
                formatter: '{b}: {c}',
              },
              emphasis: {
                label: {
                  show: true,
                },
              },
              labelLine: {
                show: true,
              },
              data: generateLabelData(),
            },
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}',
          },
          legend: {
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            data: chartOptions.dynamicChartData?.labels || [],
          },
        }}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: '100%', marginLeft: '0%', height: '483px' }}
        opts={{ renderer: 'svg', pixelRatio: 2 }}
      />
      <div className='mt-3'>
      <Table dataSource={dataSource} columns={columns} bordered={true} size="small" pagination={false} className='mt-5'/>
      </div>
    </div>
  );
}

export default InquiryUserChart;