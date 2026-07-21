mapboxgl.accessToken = mapToken;

console.log("Coordinates:", coordinates);

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 12,
});

new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML("<h5>Exact Location</h5>")
    )
    .addTo(map);