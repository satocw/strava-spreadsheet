export interface Activity {
  start_time: Date|null;
  time: number;       // Seconds
  distance: number;   // Meters
  ascend: number;     // Meters
  descend: number;    // Meters
  laps: Lap[];
}

export interface Lap {
  start_time: Date|null;
  total_time: number;
  distance: number;
  max_speed: number;
  calories: number;
  avg_hr: number;
  max_hr: number;
  tracks: Track[];
  avg_speed: number;
  avg_run_cadence: number;
  max_run_cadence: number;

  ascend: number;   // Calculate from tracks
  descend: number;  // Calculate from tracks
}

export interface Track {
  time: Date|null;
  position: Position;
  altitude: number;
  distance: number;
  hr: number;
  speed: number;
  run_cadence: number;
}
  
export interface Position {
  latitude: number;
  longitude: number;
}
