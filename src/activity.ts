import * as cheerio from 'cheerio';
import { Activity, Lap, Track } from './model/activity'

export function createFrom(data: string): Activity {
  const file = cheerio.load(data, { xmlMode: true });
  return createActivity(file);
}

function createActivity(file: CheerioStatic): Activity {
  let activity: Activity = {
    start_time: null,
    laps: [],

    time: 0,
    distance: 0,
    ascend: 0,
    descend: 0,
  };
  
  const start_time = file('Activity > Id').text();
  activity.start_time = new Date(start_time);

  const lapsNode = file('Lap');
  activity.laps = createLaps(lapsNode);

  activity.laps.forEach(lap => {
    activity.time += lap.total_time;
    activity.distance += lap.distance;
    activity.ascend += lap.ascend;
    activity.descend -= lap.descend;
  });

  assertProperyIsNotNull(activity);
  return activity;
}
  
function createLaps(lapsNode: Cheerio): Lap[] {
  let laps: Lap[] = [];
  lapsNode.each((idx, lapNode) => {
    const data = cheerio.load(lapNode, { xmlMode: true });
    const lap = createLap(data);
    laps.push(lap);
  });  
  return laps;
}
  
function createLap(lapNode: CheerioStatic): Lap {
  let lap: Lap = {
    start_time: null,
    total_time: 0,
    distance: 0,
    max_speed: 0,
    calories: 0,
    avg_hr: 0,
    max_hr: 0,
    tracks: [],
    avg_speed: 0,
    avg_run_cadence: 0,
    max_run_cadence: 0,
    ascend: 0,
    descend: 0
  };

  lap.start_time = new Date(lapNode('Lap')[0].attribs['StartTime']);
  lap.total_time = +lapNode('Lap > TotalTimeSeconds').text();
  lap.distance   = +lapNode('Lap > DistanceMeters').text();
  lap.max_speed  = +lapNode('Lap > MaximumSpeed').text();
  lap.calories   = +lapNode('Lap > Calories').text();
  lap.avg_hr     = +lapNode('Lap > AverageHeartRateBpm > Value').text();
  lap.max_hr     = +lapNode('Lap > MaximumHeartRateBpm > Value').text();
  lap.tracks     = createTracks(lapNode('Lap > Track').children('Trackpoint'));
    
  const extensions = lapNode('Lap > Extensions');
  extensions[0].children.forEach(node => {
    if (node.name === "ns3:LX") {
      node.children.forEach(node2 => {
        if (node2.name === "ns3:AvgSpeed") {
          lap.avg_speed = +(node2.children[0]['data']);
          return;
        }
        if (node2.name === "ns3:AvgRunCadence") {
          lap.avg_run_cadence = +(node2.children[0]['data']);
          return;
        }
        if (node2.name === "ns3:MaxRunCadence") {
          lap.max_run_cadence = +(node2.children[0]['data']);
          return;
        }
      });
    }
  });

  const elev  = calculateAscDsc(lap.tracks);
  lap.ascend  = elev.ascend;
  lap.descend = elev.descend;

  assertProperyIsNotNull(lap);
  return lap;
}
  
function calculateAscDsc(tracks: Track[]) {
  let ascend = 0, descend = 0;
  tracks.reduce((prev, curr) => {
    const elev = curr.altitude - prev.altitude;
    if (elev > 0) {
      ascend += elev;
    }
    else {
      descend -= elev;
    }
    return curr;
  });

  return {ascend: ascend, descend: descend};
}
  
function createTracks(tracksNode: Cheerio): Track[] {
  let tracks: Track[] = [];
  tracksNode.each((idx, trackNode) => {
    const data = cheerio.load(trackNode, { xmlMode: true });
    const track = createTrack(data);
    tracks.push(track);
  });  
  return tracks;
}
  
function createTrack(trackNode: CheerioStatic): Track {
  let track: Track = {
    time: null,
    position: {
      latitude: 0,
      longitude: 0
    },
    altitude: 0,
    distance: 0,
    hr: 0,
    speed: 0,
    run_cadence: 0,
  };

  track.time = new Date(trackNode('Time').text());
  track.position.latitude = +trackNode('Position > LatitudeDegrees').text();
  track.position.longitude = +trackNode('Position > LongitudeDegrees').text();;
  track.altitude = +trackNode('AltitudeMeters').text();
  track.distance = +trackNode('DistanceMeters').text();
  track.hr = +trackNode('HeartRateBpm > Value').text();

  const extensions = trackNode('Extensions');
  extensions[0].children.forEach(node => {
    if (node.name === "ns3:TPX") {
      node.children.forEach(node2 => {
        if (node2.name === "ns3:Speed") {
          track.speed = +(node2.children[0]['data']);
          return;
        }
        if (node2.name === "ns3:RunCadence") {
          track.run_cadence = +(node2.children[0]['data']);
          return;
        }
      });
    }
  });

  assertProperyIsNotNull(track);
  return track;
}
  
  
function assertProperyIsNotNull(data: Object) {
  Object.keys(data).forEach(key => {
    if (data[key] == null) {
      console.warn(key , 'がNULLです。', data);
    }
  });
}