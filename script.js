

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


function startAirportService(centerLong, centerLat,rotateAlt) {
    rotateAltitiude = rotateAlt;
    mapOriginLatitude = centerLong;
    mapOriginLongitude = centerLat;
    thresoldLat=centerLong;
    thresoldLong=centerLat;
    rotateAltitiude = rotateAlt;
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [centerLong, centerLat],
        zoom: 12,
        pitch: 45,
        antialias: true,
        bearing: 0

    });
    map.on('load', () => {

        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
         
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.0});
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
/*  function dispose() {
   tb.dispose().then((_)=>{

   });
} */





function sayHi() {
    JavascriptChannel.postMessage("hii");

}



/* 
function planeFly(startLat, startLong, endLat, endLong, targetLat, targetLong, upper, lower) {

    let plane;
    let api = {
        fixedZoom: true,
        pan: false,
        maxZoom: 15
    };

    animate();
    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

            // instantiate threebox
            window.tb = new Threebox(
                map,
                map.getCanvas().getContext('webgl'),
                {
                    realSunlight: true,
                    enableSelectingObjects: true, //change this to false to disable 3D objects selection
                    enableTooltips: true, // change this to false to disable default tooltips on fill-extrusion and 3D models
                }
            );
            tb.altitudeStep = 1;
            tb.setSunlight(new Date(2021, 0, 18, 12));

            var options = {
                type: 'gltf',
                obj: 'plane.glb',
                scale: 0.5,
                rotation: { x: 90, y: 0, z: 0 },
                anchor: 'center',
                bbox: false

            }
            if (api.fixedZoom) options.fixedZoom = api.maxZoom;
            tb.loadObj(options, function (model) {
                plane = model
                    .setCoords([targetLat, targetLong, lower]);
                plane.setRotation({ x: 0, y: 0, z: 135 })
                plane.addEventListener('ObjectChanged', onObjectChanged, false);
                plane.castShadow = true;
                tb.add(plane);

                fly(tb, [[
                    startLat, startLong, upper
                ]
                    , [
                    endLat, endLong, lower
                ]

                ]);

            })
        },

        render: function (gl, matrix) {
            tb.update();
        }
    })


    let line;
    function onObjectChanged(e) {
        let model = e.detail.object; //here's the object already modified
        if (api.pan) map.panTo(model.coordinates);
    }


    function fly(tb, pathForFly) {
        // extract path geometry from callback geojson, and set duration of travel
        var options = {
            path: pathForFly,
            duration: 20000
        }
        try {
            // start the truck animation with above options, and remove the line when animation ends
            plane.followPath(
                options,
                async function () {
                    tb.remove(line);
                    tb.remove(plane);
                    tb.removeLayer("custom-layer")
                    await tb.clear(["custom-layer", true]) 

                }
            );
        } catch (error) {
            JavascriptChannel.postMessage(error);
        }


        // set up geometry for a line to be added to map, lofting it up a bit for *style*
        let lineGeometry = options.path;

        // create and add line object
        line = tb.line({
            geometry: lineGeometry,
            width: 5,
            color: 'steelblue'
        })
        tb.add(line, "custom-layer");
    }
} */