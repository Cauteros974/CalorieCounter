import { Dimensions } from 'react-native';

const W = Dimensions.get('window').width - 40;
const H = 200;
const PADDING = { top: 20, bottom: 30, left: 40, right: 20 };


const weekData = [
  { day: 'Mon', cal: 1800 },
  { day: 'Tue', cal: 2100 },
  { day: 'Wed', cal: 1950 },
  { day: 'Thu', cal: 2400 },
  { day: 'Fri', cal: 1700 },
  { day: 'Sat', cal: 2000 },
  { day: 'Sun', cal: 2200 },
];

function SimpleLineChart({color} : {color: string}) {
    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    const values = weekData.map(d => d.cal);
    const minV = Math.min(...values) - 200;
    const maxV = Math.max(...values) + 200;
}