import { Dimensions } from 'react-native';
import Svg from 'react-native-svg';

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

    const toX = (i: number) => PADDING.left + (i / (weekData.length - 1)) * chartW;
    const toY = (v: number) => PADDING.top + chartH - ((v - minV) / (maxV - minV)) * chartH;
    
    const points = weekData.map((d, i) => ({ x: toX(i), y: toY(d.cal) }));
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++ ) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX = (prev.x + curr.x) / 2;
        d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return(
        <Svg width={W} height={H}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                const y = PADDING.top + t * chartH;
                const val = Math.round(maxV - t * (maxV - minV));
            })}
        </Svg>
    )
}