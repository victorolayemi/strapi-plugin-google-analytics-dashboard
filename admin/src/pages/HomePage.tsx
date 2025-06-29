import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Box, Flex, Radio, Loader } from '@strapi/design-system';
import { format, parse } from 'date-fns';
import CenteredLoader from '../components/CenterLoader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const presets = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Last 180 days', value: '180d' },
  { label: 'Last 1 year', value: '365d' },
];

const chartTypes = [
  'overview',
  'users-by-country',
  'users-by-device',
  'sessions-by-source',
  'pageviews-by-path',
  'users-over-time',
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4', '#a52a2a'];

const Home = () => {
  const [dateRange, setDateRange] = useState(presets[0]);
  const [charts, setCharts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const [errorState, setErrorState] = useState<{ message: string } | null>(null);

  const fetchCharts = async () => {
    setLoading(true);
    setErrorState(null);

    try {
      const query = `?range=${dateRange.value}`;
      const results = await Promise.all(
        chartTypes.map((type) =>
          fetch(`/api/strapi-google-analytics-dashboard/charts/${type}${query}`).then((res) =>
            res.json()
          )
        )
      );

      // If any chart returns an error, use that as the global error
      const error = results.find((r) => r?.error);
      if (error) {
        setErrorState({ message: error.message || 'Something went wrong.' });
        setCharts({});
        return;
      }

      const data: Record<string, any> = {};
      chartTypes.forEach((type, index) => {
        data[type] = results[index];
      });
      setCharts(data);
    } catch (err) {
      setErrorState({ message: 'Failed to fetch charts. Check your connection or credentials.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, [dateRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
  };

  const renderPieChart = (data: any, labelKey = 'name', valueKey = 'value') => {
    const chartData = (data?.rows || []).map((row: any) => ({
      name: row.dimensionValues?.[0]?.value,
      value: parseFloat(row.metricValues?.[0]?.value || '0'),
    }));
    return (
      <Pie
        data={{
          labels: chartData.map((d: any) => d[labelKey]),
          datasets: [
            {
              label: 'Value',
              data: chartData.map((d: any) => d[valueKey]),
              backgroundColor: COLORS,
              borderColor: '#fff',
              borderWidth: 1,
            },
          ],
        }}
        options={chartOptions}
      />
    );
  };

  const renderLineChart = (data: any) => {
    if (!data?.rows?.length) return <p>No data</p>;

    const metricNames = data.metricHeaders?.map((m: any) => m.name) || [];
    const isMonthlyView = data.rows.length > 31;

    const rawData = data.rows.map((row: any) => {
      const dateStr = row.dimensionValues?.[0]?.value;
      const date = parse(dateStr, 'yyyyMMdd', new Date());

      return {
        date,
        label: isMonthlyView ? format(date, 'MMM yyyy') : format(date, 'EEE, d MMM'),
        metrics: row.metricValues.map((val: any) => parseFloat(val.value || '0')),
      };
    });

    // Sort by date descending
    rawData.sort(
      (a: { date: { getTime: () => number } }, b: { date: { getTime: () => number } }) =>
        a.date.getTime() - b.date.getTime()
    );

    const groupedData = isMonthlyView
      ? (() => {
          const map = new Map<string, number[]>();

          rawData.forEach(({ label, metrics }: { label: string; metrics: number[] }) => {
            if (!map.has(label)) {
              map.set(label, Array(metrics.length).fill(0));
            }
            const current = map.get(label)!;
            metrics.forEach((val: number, i: number) => {
              current[i] += val;
            });
          });

          return Array.from(map.entries())
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([label, metrics]) => ({ label, metrics }));
        })()
      : rawData.map((row: { label: string; metrics: number[] }) => ({
          label: row.label,
          metrics: row.metrics,
        }));

    // 🔠 Utility to humanize label
    const humanize = (str: string) =>
      str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .replace(/_/g, ' ');

    const chartData = {
      labels: groupedData.map((item: { label: any }) => item.label),
      datasets: metricNames.map((rawName: string, index: number) => ({
        label: humanize(rawName),
        data: groupedData.map((item: { metrics: { [x: string]: any } }) => item.metrics[index]),
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
        tension: 0.4,
        fill: false, // Line-only
      })),
    };

    return (
      <Line
        data={chartData}
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            legend: { display: false },
          },
        }}
      />
    );
  };

  const renderOverviewArea = () => {
    const data = charts['overview'];
    if (!data?.rows?.length) return <p>No data for overview</p>;

    const metricNames = data.metricHeaders?.map((m: any) => m.name) || [];
    const isMonthlyView = data.rows.length > 31;

    const rawData = data.rows.map((row: any) => {
      const dateStr = row.dimensionValues?.[0]?.value;
      const date = parse(dateStr, 'yyyyMMdd', new Date());

      return {
        date,
        label: isMonthlyView ? format(date, 'MMM yyyy') : format(date, 'EEE, d MMM'),
        metrics: row.metricValues.map((v: any) => parseFloat(v.value || '0')),
      };
    });

    // Sort descending by date
    rawData.sort(
      (a: { date: { getTime: () => number } }, b: { date: { getTime: () => number } }) =>
        a.date.getTime() - b.date.getTime()
    );

    const groupedData = isMonthlyView
      ? (() => {
          const map = new Map<string, number[]>();

          rawData.forEach(({ label, metrics }: { label: string; metrics: number[] }) => {
            if (!map.has(label)) {
              map.set(label, Array(metrics.length).fill(0));
            }
            const current = map.get(label)!;
            metrics.forEach((val: number, i: number) => {
              current[i] += val;
            });
          });

          return Array.from(map.entries())
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([label, metrics]) => ({ label, metrics }));
        })()
      : rawData;

    // 🔠 Utility to make label human-readable
    const humanize = (str: string) =>
      str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (s) => s.toUpperCase()) // Capitalize first letter
        .replace(/_/g, ' '); // Replace underscores with space

    const chartData = {
      labels: groupedData.map((row: { label: any }) => row.label),
      datasets: metricNames.map((rawName: string, index: number) => ({
        label: humanize(rawName),
        data: groupedData.map((row: { metrics: { [x: string]: any } }) => row.metrics[index]),
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: `${COLORS[index % COLORS.length]}`,
        tension: 0.4,
        fill: true,
      })),
    };

    return <Line data={chartData} options={chartOptions} />;
  };

  const renderHorizontalBarChart = (data: any, labelKey = 'name', valueKey = 'value') => {
    const chartData = (data?.rows || []).map((row: any) => ({
      name: row.dimensionValues?.[0]?.value,
      value: parseFloat(row.metricValues?.[0]?.value || '0'),
    }));

    // Extract metric names from data if available, fallback to 'Users'
    const metricNames = data?.metricHeaders?.map((m: any) => m.name) || ['Users'];

    return (
      <Bar
        data={{
          labels: chartData.map((d: any) => d[labelKey]),
          datasets: metricNames.map((name: any, index: number) => ({
            label: name,
            data: chartData.map((d: any) => d[valueKey]),
            backgroundColor: COLORS[index % COLORS.length],
            borderColor: '#fff',
            borderWidth: 1,
          })),
        }}
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            legend: { display: false },
          },
          indexAxis: 'y',
        }}
      />
    );
  };

  if (loading) return <CenteredLoader />;

  return (
    <Box padding={4}>
      <Box paddingBottom={4}>
        <h1 style={{ fontSize: 24, fontWeight: 700, paddingBottom: 8 }}>
          Google Analytics Dashboard
        </h1>
        <Radio.Group
          label="Select Date Range"
          onValueChange={(value: string) => {
            const preset = presets.find((p) => p.value === value);
            if (preset) setDateRange(preset);
          }}
          value={dateRange.value}
          name="date-range"
        >
          <Flex gap={2} wrap="wrap">
            {presets.map((preset: any) => (
              <Radio.Item key={preset.value} value={preset.value}>
                {preset.label}
              </Radio.Item>
            ))}
          </Flex>
        </Radio.Group>
      </Box>

      {errorState ? (
        <Box paddingTop={4} paddingBottom={4} background="neutral0">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#ff4d4f' }}>
            ⚠️ {errorState.message}
          </h2>
          <Box paddingTop={2}>
            <a
              href="/admin/settings/strapi-google-analytics-dashboard"
              style={{
                backgroundColor: '#007eff',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 4,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Go to Settings
            </a>
          </Box>
        </Box>
      ) : (
        <Flex wrap="wrap" gap={4} alignItems="stretch">
          {[
            {
              title: 'Overview',
              chart: renderOverviewArea(),
              flex: '0 0 48%', // ~half width
            },
            {
              title: 'Users by Country',
              chart: renderHorizontalBarChart(charts['users-by-country']),
            },
            {
              title: 'Users by Device',
              chart: renderHorizontalBarChart(charts['users-by-device']),
            },
            {
              title: 'Sessions by Source',
              chart: renderHorizontalBarChart(charts['sessions-by-source']),
            },
            {
              title: 'Top Pageviews',
              chart: renderHorizontalBarChart(charts['pageviews-by-path']),
              flex: '0 0 48%',
            },
            {
              title: 'Users Over Time',
              chart: renderLineChart(charts['users-over-time']),
              flex: '0 0 48%',
            },
          ].map((section: any, index: any) => (
            <Box
              key={index}
              style={{
                flex: section.flex || '1',
                minHeight: 250,
                minWidth: 300,
              }}
              background="neutral0"
              shadow="tableShadow"
              hasRadius
              padding={4}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>{section.title}</h2>
              <Box
                style={{
                  flex: section.flex || '1',
                  minWidth: 300,
                  minHeight: 250,
                }}
              >
                {section.chart}
              </Box>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default Home;
