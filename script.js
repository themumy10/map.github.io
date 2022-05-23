

function submit() {
    var coloredDiv = document.getElementById('coloredDiv');
    coloredDiv.setAttribute("style", "background-color: red;");
    JavascriptChannel.postMessage("helooo");
}



mapboxgl.accessToken = 'pk.eyJ1IjoibXNhaGluZ2lyYXkiLCJhIjoiY2t6OXFpbjB5MGxzNjJ1bzF4cnBsZm9rZiJ9.Q29x7rlXQlOQ2iSF61Y20Q';

let mapOriginLatitude;
let mapOriginLongitude;
let map;

let animationIndex = 0;
let animationTime = 0.0;

let rotateAltitiude;


let thresoldLat;
let thresoldLong;
var approachAnimationId = null;/* 
function startService(centerLat, centerLong, rotateAlt, heading,thresoldLatTemp,thresoldLongTemp,) {
    mapOriginLatitude = centerLat;
    mapOriginLongitude = centerLong;
    thresoldLat=thresoldLatTemp;
    thresoldLong=thresoldLongTemp;
    rotateAltitiude = rotateAlt;
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [thresoldLatTemp, thresoldLongTemp],
        zoom: 18,
        pitch: 88,
        antialias: true,
        bearing: heading

    });
    map.on('load', () => {

        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
         
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5});
        map.setFog({
            'range': [-2, 20],
            'color': 'white',
            'horizon-blend': 0.1
        }); 

        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 90.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    });
    map.on('error', (c) => {
        JavascriptChannel.postMessage("map error");
        JavascriptChannel.postMessage(c.toString());
    });
    map.on('webglcontextlost', () => {
        JavascriptChannel.postMessage("context lost");
    });
    map.on('webglcontextrestored', () => {
        JavascriptChannel.postMessage("context restored");
    });
} */
function resetToAirport(centerLong, centerLat,rotateAlt,targetlat,targetlong){
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5});
    rotateAltitiude = rotateAlt;
    mapOriginLatitude = centerLong;
    mapOriginLongitude = centerLat;
    thresoldLat=centerLong;
    thresoldLong=centerLat;
    try {
        updateCameraPosition([mapOriginLatitude, mapOriginLongitude], rotateAltitiude, [targetlat, targetlong]);
    } catch (error) {
        
    }
   

}
let targetLatTemp;
let targetLongTemp;
function setRunway(centerLat, centerLong, rotateAlt,thresoldLatTemp,thresoldLongTemp,targetLat,targetLong){

    mapOriginLatitude = centerLat;
    mapOriginLongitude = centerLong;
    thresoldLat=thresoldLatTemp;
    thresoldLong=thresoldLongTemp;
    rotateAltitiude = rotateAlt;
    targetLatTemp=targetLat;
    targetLongTemp=targetLong;
    try {
        updateCameraPosition([centerLat, centerLong], rotateAltitiude, [targetLat, targetLong]);
    } catch (error) {
        
    }
    
}
function setStyleOF(style){

map.setStyle(style);
}


function onDragEnd() {
const lngLat = marker.getLngLat();
coordinates.style.display = 'block';
coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
}
 
marker.on('dragend', onDragEnd);
function startAirportService(centerLong, centerLat,rotateAlt) {
    rotateAltitiude = rotateAlt;
    mapOriginLatitude = centerLong;
    mapOriginLongitude = centerLat;
    thresoldLat=centerLong;
    thresoldLong=centerLat;
    rotateAltitiude = rotateAlt;
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [centerLong, centerLat],
        zoom: 12,
        pitch: 45,
        antialias: true,
        bearing: 0

    });
    
    const marker = new mapboxgl.Marker({
draggable: true
})
.setLngLat([centerLong, centerLat])
.addTo(map);
 
  /*   map.on('load', () => {

        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
         
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5});
        map.setFog({
            'range': [-2, 20],
            'color': 'white',
            'horizon-blend': 0.1
        }); 

        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 90.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
   
    }); */
    
    
    map.on('load', () => {
        map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
         
        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
        }
        });
        });
    map.on('error', (c) => {
        JavascriptChannel.postMessage("map error");
        JavascriptChannel.postMessage(c.toString());
    });
    map.on('webglcontextlost', () => {
        JavascriptChannel.postMessage("context lost");
    });
    map.on('webglcontextrestored', () => {
        JavascriptChannel.postMessage("context restored");
    });
}
function updateCameraPosition(position, altitude, target) {
    const camera = map.getFreeCameraOptions();

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
        position,
        altitude
    );
  
    camera.lookAtPoint(target);

    map.setFreeCameraOptions(camera);
}

const lerp = (a, b, t) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        const result = [];
        for (let i = 0; i < Math.min(a.length, b.length); i++)
            result[i] = a[i] * (1.0 - t) + b[i] * t;
        return result;
    } else {
        return a * (1.0 - t) + b * t;
    }
};




function approach(startLat, startLong, endLat, endLong, targetLat, targetLong, upper, lower) {


    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 0.1});
    
    let lastTime = 0.0
    function frame(time) {
        const current={
            duration: 15000.0,
            animate: (phase) => {
                const start = [startLat, startLong];
                const end = [endLat, endLong];
                const alt = [upper, lower];

                // interpolate camera position while keeping focus on a target lat/lng
                const position = lerp(start, end, phase);
                const altitude = lerp(alt[0], alt[1], phase);
              
                var  target = [targetLat, targetLong];

                updateCameraPosition(position,altitude, target);
            }
        }
        if (animationTime < current.duration) {
            // Normalize the duration between 0 and 1 to interpolate the animation
            const phase = animationTime / current.duration;
            current.animate(phase);
        }

        // Elasped time since last frame, in milliseconds
        const elapsed = time - lastTime;
        animationTime += elapsed;
        lastTime = time;
        approachAnimationId = window.requestAnimationFrame(frame);
        if (animationTime > current.duration) {
           animationTime = 0.0;
        }       
    }

    approachAnimationId = window.requestAnimationFrame(frame);
}

var rotateAnimationID = null;


function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    updateCameraPosition([mapOriginLatitude, mapOriginLongitude], rotateAltitiude, [thresoldLat, thresoldLong]);
    map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.

    rotateAnimationID = window.requestAnimationFrame(rotateCamera);

}
function stopApproach() {
  
   

   
    window.cancelAnimationFrame(approachAnimationId); 
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5});
}
function stopRotation() {
    window.cancelAnimationFrame(rotateAnimationID);
}


var planeAnimationID = null;
function stopPlane() {
    window.cancelAnimationFrame(planeAnimationID);
}
function animate() {
    planeAnimationID = requestAnimationFrame(animate);

}





function sayHi() {
    JavascriptChannel.postMessage("hii");

}



