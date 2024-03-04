import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
// import Table from 'react-bootstrap/Table';
import { Table } from 'antd';

function InquriryChart({ chartinqurydata }) {
  const [chartOptions, setChartOptions] = useState({});
  const [inquiryData, setInquiryData] = useState([]);

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
      title: 'Total Inquiry',
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
        {/* <Table striped bordered hover variant="light" className='w-100'>
          <tbody>
            <tr>
              <td className='fs-5'>Total Task</td>
              <td className='fs-5'>Total Completed Task</td>
              <td className='fs-5'>Total Pending Task</td>
              <td className='fs-5'>Total Running Task</td>
            </tr>
            <tr style={{ textAlign: 'center' }}>
              <td className='fs-5'>{chartOptions.totalTasks}</td>
              <td className='fs-5'>{chartOptions.totalCompletedTasks}</td>
              <td className='fs-5'>{chartOptions.totalPendingTasks}</td>
              <td className='fs-5'>{chartOptions.totalRunningTasks}</td>
            </tr>
          </tbody>
        </Table> */}
        <Table dataSource={dataSource} columns={columns} bordered={true} size="small" pagination={false} className='mt-5'/>
      </div>
    </div>
  );
}

export default InquriryChart;
