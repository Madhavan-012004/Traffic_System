let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        draggable: true
    });
}

function getTrafficInfo() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) {
        alert("Please enter both start and end locations.");
        return;
    }

    calculateAndDisplayRoute(start, end);
}

function calculateAndDisplayRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: 'DRIVING',
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: 'bestguess'
            }
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                const route = response.routes[0];
                const leg = route.legs[0];

                document.getElementById('travel-time').textContent = leg.duration_in_traffic.text;
                const trafficPercentage = calculateTrafficPercentage(leg.duration.value, leg.duration_in_traffic.value);
                document.getElementById('traffic-percentage').textContent = `${trafficPercentage}%`;
            } else {
                alert('Directions request failed due to ' + status);
            }
        }
    );
}

function calculateTrafficPercentage(duration, durationInTraffic) {
    return ((durationInTraffic - duration) / duration * 100).toFixed(2);
}
