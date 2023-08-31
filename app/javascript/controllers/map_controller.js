import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    departureCity1Lat: Number,
    departureCity1Lon: Number,
    departureCity2Lat: Number,
    departureCity2Lon: Number,
  }

  connect() {
    console.log("This is connected")
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/dark-v11"
    })
    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    const geojson = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'coordinates': [
              [this.departureCity1LonValue, this.departureCity1LatValue],
              [this.departureCity2LonValue, this.departureCity2LatValue],
          ],
          'type': 'LineString'
        }
      }
      ]
    }

  this.map.on('load', () => {
    this.map.addSource('line', {
      type: 'geojson',
      data: geojson
  })

  this.map.addLayer({
    type: 'line',
    source: 'line',
    id: 'line-background',
    paint: {
      'line-color': 'purple',
      'line-width': 6,
      'line-opacity': 0.4
    }
  })


  this.map.addLayer({
    type: 'line',
    source: 'line',
    id: 'line-dashed',
    paint: {
    'line-color': 'purple',
    'line-width': 6,
    'line-dasharray': [0, 4, 3]
    }
  });


  const dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5]
  ];

  let step = 0;

  function animateDashArray(timestamp) {
// Update line-dasharray using the next value in dashArraySequence. The
// divisor in the expression `timestamp / 50` controls the animation speed.
  const newStep = parseInt(
    (timestamp / 50) % dashArraySequence.length
  );

  if (newStep !== step) {
    this.map.setPaintProperty(
    'line-dashed',
    'line-dasharray',
    dashArraySequence[step]
    );
    step = newStep;
  }

// Request the next frame of the animation.
  requestAnimationFrame(animateDashArray);
  }

// start the animation
  animateDashArray(0);
});








  }

  #addMarkersToMap() {
    // this.markersValue.forEach((marker) => {
    //   console.log(marker)
    //   new mapboxgl.Marker({opacity: 0})
    //   .setLngLat([ marker.lng, marker.lat ])
    //   .addTo(this.map)
    // })
    new mapboxgl.Marker({color: "#705eb6"})
    .setLngLat([this.departureCity1LonValue, this.departureCity1LatValue] )
    .addTo(this.map)

    new mapboxgl.Marker({color: "#705eb6"})
    .setLngLat([this.departureCity2LonValue, this.departureCity2LatValue] )
    .addTo(this.map)
    // Add markers departure cities
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    console.log(this.markersValue)
    this.markersValue.forEach(marker => bounds.extend([
      marker.lng, marker.lat ]))
      this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0})
  }

  #addAnimationToJourney() {
  }
}
