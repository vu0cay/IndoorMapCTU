//This is new code
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import './style.css'
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: 'https://geoserver.ctu.edu.vn/geoserver/ctu/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ctu%3Aroom_by_floor&maxFeatures=50&outputFormat=application%2Fjson',
    format: new GeoJSON(),
  }),
  style: {
    'fill-color': ['string', ['get', 'COLOR'], 'red'],
  },
});

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  //[vectorLayer],
  target: 'map',
  view: new View({
    center: [11774399.77267, 1122291.31705],
    zoom: 18,
  }),
});

const featureOverlay = new VectorLayer({
  source: new VectorSource(),
  map: map,
  style: {
    'stroke-color': 'rgba(255, 255, 255, 0.7)',
    'stroke-width': 2,
  },
});

let highlight;
const displayFeatureInfo = function (pixel) {
  const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });

  const info = document.getElementById('info');
  if (feature) {
    let txt = "<table style='width: 100%''><tr>"
    for(let index in feature.values_){
      
      if(index != "geometry") txt += "<th>" + index + "</th>";
    }
    txt += "</tr><tr>";
    for(let index in feature.values_){
      if(index != "geometry") txt += "<td>" + feature.values_[index] + "</td>";
    }
    txt += "</tr></table>"
    info.innerHTML = txt;
  } else {
    info.innerHTML = '&nbsp;';
  }

  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.getSource().removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.getSource().addFeature(feature);
    }
    highlight = feature;
  }
};

// map.on('pointermove', function (evt) {
//   if (evt.dragging) {
//     return;
//   }
//   const pixel = map.getEventPixel(evt.originalEvent);
//   displayFeatureInfo(pixel);
// });

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});
