export const DEG = Math.PI / 180;
export function skyAt(date) {
 const jd = date.getTime()/86400000 + 2440587.5, d = jd - 2451545;
 const norm = a => ((a % 360) + 360) % 360;
 const gmst = norm(280.46061837 + 360.98564736629*d);
 const g = norm(357.528 + .9856003*d)*DEG;
 const lambda = (norm(280.460 + .9856474*d) + 1.915*Math.sin(g)+.020*Math.sin(2*g))*DEG;
 const eps = (23.439 - .0000004*d)*DEG;
 const ra = Math.atan2(Math.cos(eps)*Math.sin(lambda),Math.cos(lambda))/DEG;
 const dec = Math.asin(Math.sin(eps)*Math.sin(lambda))/DEG;
 return {gmst,ra: norm(ra),dec,lon:norm(ra-gmst+180)-180,eclipticLongitude:norm(lambda/DEG)};
}
export function xyz(lat, lon, radius=1) {
 return [radius*Math.cos(lat*DEG)*Math.cos(lon*DEG),radius*Math.sin(lat*DEG),-radius*Math.cos(lat*DEG)*Math.sin(lon*DEG)];
}

