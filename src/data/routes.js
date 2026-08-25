import { STATIONS } from './stations';
import { METRO_LINES } from './lines';

// Predefined ordered station lines for shortest path generation
const LINE_ORDER = {
  aqua: ['sec-51', 'sec-50', 'sec-76', 'sec-101', 'sec-137', 'sec-142', 'sec-143', 'sec-144', 'sec-148', 'knowledge-park-2', 'pari-chowk', 'depot'],
  blue: ['noida-electronic-city', 'sec-62', 'sec-52', 'sec-34', 'noida-city-centre', 'botanical-garden', 'sec-18', 'sec-16', 'mandi-house', 'rajiv-chowk'],
  magenta: ['botanical-garden', 'kalindi-kunj', 'hauz-khas', 'iit-delhi']
};

// Interchange points connecting network lines
const INTERCHANGES = [
  { fromStation: 'sec-51', toStation: 'sec-52', type: 'walkway', name: 'Sector 51 ↔ Sector 52 Walkway (300m / 4 min)' },
  { fromStation: 'sec-52', toStation: 'sec-51', type: 'walkway', name: 'Sector 52 ↔ Sector 51 Walkway (300m / 4 min)' },
  { fromStation: 'botanical-garden', toStation: 'botanical-garden', type: 'platform', name: 'Botanical Garden (Platform Interchange)' }
];

export function findRoute(fromId, toId) {
  if (!fromId || !toId || fromId === toId) {
    const originStation = STATIONS.find(s => s.id === fromId) || STATIONS[0];
    return {
      success: false,
      message: 'Origin and Destination must be different stations.',
      from: originStation,
      to: originStation
    };
  }

  const origin = STATIONS.find(s => s.id === fromId);
  const dest = STATIONS.find(s => s.id === toId);

  if (!origin || !dest) {
    return { success: false, message: 'Invalid station selection.' };
  }

  // Check if same line
  if (origin.line === dest.line) {
    const lineStns = LINE_ORDER[origin.line] || [];
    const idx1 = lineStns.indexOf(origin.id);
    const idx2 = lineStns.indexOf(dest.id);

    let pathIds = [];
    if (idx1 !== -1 && idx2 !== -1) {
      if (idx1 <= idx2) {
        pathIds = lineStns.slice(idx1, idx2 + 1);
      } else {
        pathIds = lineStns.slice(idx2, idx1 + 1).reverse();
      }
    } else {
      pathIds = [origin.id, dest.id];
    }

    const stationList = pathIds.map(id => STATIONS.find(s => s.id === id)).filter(Boolean);
    const stopsCount = Math.max(1, stationList.length - 1);
    const durationMins = stopsCount * 2.5 + 2;
    const baseFare = Math.min(60, Math.max(15, stopsCount * 5 + 10));

    return {
      success: true,
      from: origin,
      to: dest,
      isDirect: true,
      interchangesCount: 0,
      interchangeDetails: [],
      path: stationList,
      stopsCount,
      durationMins: Math.round(durationMins),
      fare: baseFare,
      routes: [
        {
          id: 'direct-fastest',
          title: 'Direct Metro (Fastest)',
          tag: 'Recommended',
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          durationMins: Math.round(durationMins),
          fare: baseFare,
          interchangesCount: 0,
          stopsCount,
          crowd: origin.crowd || 'Moderate',
          co2SavedKg: (stopsCount * 0.42).toFixed(1),
          path: stationList,
          departureTime: 'Every 3-5 min'
        }
      ]
    };
  }

  // Cross-line routing with interchange (e.g. Aqua Line <-> Blue Line via Sec 51/52 or Blue <-> Magenta via Botanical Garden)
  let path1 = [];
  let path2 = [];
  let interchangeNote = '';

  if (origin.line === 'aqua' && (dest.line === 'blue' || dest.line === 'magenta')) {
    // Path: origin -> sec-51 -> interchange -> sec-52 -> dest
    const aquaStns = LINE_ORDER.aqua;
    const fromIdx = aquaStns.indexOf(origin.id);
    const sec51Idx = aquaStns.indexOf('sec-51');
    const aquaSlice = fromIdx <= sec51Idx 
      ? aquaStns.slice(fromIdx, sec51Idx + 1)
      : aquaStns.slice(sec51Idx, fromIdx + 1).reverse();

    const blueStns = LINE_ORDER.blue;
    const sec52Idx = blueStns.indexOf('sec-52');
    const destIdx = blueStns.indexOf(dest.id);

    let blueSlice = [];
    if (destIdx !== -1) {
      blueSlice = sec52Idx <= destIdx
        ? blueStns.slice(sec52Idx, destIdx + 1)
        : blueStns.slice(destIdx, sec52Idx + 1).reverse();
    } else {
      blueSlice = ['sec-52', 'botanical-garden'];
    }

    path1 = aquaSlice;
    path2 = blueSlice;
    interchangeNote = 'Change at Sector 51 to Sector 52 (Blue Line) via dedicated walkway';
  } else if (origin.line === 'blue' && dest.line === 'aqua') {
    const blueStns = LINE_ORDER.blue;
    const fromIdx = blueStns.indexOf(origin.id);
    const sec52Idx = blueStns.indexOf('sec-52');
    const blueSlice = fromIdx <= sec52Idx
      ? blueStns.slice(fromIdx, sec52Idx + 1)
      : blueStns.slice(sec52Idx, fromIdx + 1).reverse();

    const aquaStns = LINE_ORDER.aqua;
    const sec51Idx = aquaStns.indexOf('sec-51');
    const destIdx = aquaStns.indexOf(dest.id);
    const aquaSlice = sec51Idx <= destIdx
      ? aquaStns.slice(sec51Idx, destIdx + 1)
      : aquaStns.slice(destIdx, sec51Idx + 1).reverse();

    path1 = blueSlice;
    path2 = aquaSlice;
    interchangeNote = 'Change at Sector 52 to Sector 51 (Aqua Line) via dedicated walkway';
  } else {
    // General fallback route
    path1 = [origin.id, 'botanical-garden'];
    path2 = ['botanical-garden', dest.id];
    interchangeNote = 'Interchange at Botanical Garden Station';
  }

  const combinedIds = Array.from(new Set([...path1, ...path2]));
  const stationList = combinedIds.map(id => STATIONS.find(s => s.id === id)).filter(Boolean);
  const stopsCount = Math.max(2, stationList.length - 1);
  const durationMins = Math.round(stopsCount * 2.6 + 6); // +6 min interchange transfer
  const fare = Math.min(80, Math.max(25, stopsCount * 5 + 15));

  return {
    success: true,
    from: origin,
    to: dest,
    isDirect: false,
    interchangesCount: 1,
    interchangeDetails: [interchangeNote],
    path: stationList,
    stopsCount,
    durationMins,
    fare,
    routes: [
      {
        id: 'route-optimal',
        title: 'Optimal Transit Route',
        tag: 'Fastest',
        badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        durationMins,
        fare,
        interchangesCount: 1,
        stopsCount,
        crowd: 'Moderate',
        co2SavedKg: (stopsCount * 0.46).toFixed(1),
        path: stationList,
        interchangeNote
      },
      {
        id: 'route-comfort',
        title: 'Alternative Low-Crowd Route',
        tag: 'Less Crowded',
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        durationMins: durationMins + 5,
        fare: fare - 5,
        interchangesCount: 1,
        stopsCount: stopsCount + 1,
        crowd: 'Low',
        co2SavedKg: (stopsCount * 0.44).toFixed(1),
        path: stationList,
        interchangeNote
      }
    ]
  };
}
