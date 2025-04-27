<template>
  <v-app>
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="@/assets/videos/background.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="routes-container">
  <v-col cols="12" class="text-center mb-6 mt-10 text-white">
    <h1>🚖 Easy Commute: Find Your Route</h1>
  </v-col>

  <div class="search-section">
    <input v-model="startLocation" type="text" placeholder="Start Barangay" />
    <input v-model="endLocation" type="text" placeholder="Destination Barangay" />
    <button @click="findRoute">Find Best Route</button>
  </div>

  <div id="map"></div> <!-- MAP INSIDE HERE -->

  <!-- Cards below the map (passedBarangays and suggestedRoute) -->
  <transition name="fade">
    <div v-if="passedBarangays.length" class="info-card">
      <div class="info-header" @click="togglePassedBarangays">
        <h2>Barangays You Will Pass Through:</h2>
        <span>{{ showPassedBarangays ? 'Hide' : 'Show' }}</span>
      </div>
      <ul v-show="showPassedBarangays">
        <li v-for="(barangay, index) in passedBarangays" :key="index">
          {{ barangay }}
        </li>
      </ul>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="suggestedRoute" class="info-card">
      <div class="info-header" @click="toggleSuggestedRoute">
        <h2>Sakay ka sa:</h2>
        <span>{{ showSuggestedRoute ? 'Hide' : 'Show' }}</span>
      </div>
      <p v-show="showSuggestedRoute">{{ suggestedRoute }}</p>
    </div>
  </transition>

</div>

  </v-app>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet-routing-machine';

export default {
  setup() {
    const map = ref(null);
    const routeControl = ref(null);
    const passedBarangays = ref([]);
    const suggestedRoute = ref('');
    const startLocation = ref('');
    const endLocation = ref('');
    const showPassedBarangays = ref(true);
    const showSuggestedRoute = ref(true);

    const routes = [
    // Original routes
    { id: 'Red', barangays: ["Holy Redeemer Butuan City", "Obrero Butuan City", "Ambago Butuan City", "Bading Butuan City", "Agusan Pequeño", "Pagatpatan Butuan City"] },
    { id: 'White', barangays: ["Paradise Village Butuan", "Balangay Shrine Butuan City", "Libertad Butuan City", "Bancasi Butuan City", "Pinamanculan Butuan City", "Chinese Cemetery Butuan City", "Dumalagan Butuan City"] },
    { id: 'Yellow', barangays: ["Holy Redeemer Butuan City", "Obrero Butuan City", "Doongan Butuan City", "Ambago Butuan City", "Babag Butuan City", "Bading Butuan City", "Agusan Pequeño Butuan City", "Pagatpatan Butuan City", "P. Rizal Butuan City", "Villa Kananga Butuan City", "Imadejas Butuan City", "Bayanihan Butuan City", "Golden Ribbon Butuan City", "Maon Butuan City", "Pangabuggan Butuan City", "San Vicente Butuan City", "Bit-os Butuan City"] },
    { id: 'Green', barangays: ["Langihan Butuan City", "Slaughterhouse Butuan City", "Doongan Butuan City", "Ambago Butuan City", "Babag Butuan City", "Bading Butuan City", "Agusan Pequeño", "Pagatpatan Butuan City", "P. Rizal Butuan City", "Villa Kananga Butuan City", "Imadejas Butuan City", "Bayanihan Butuan City", "Golden Ribbon Butuan City", "Maon Butuan City", "Pangabuggan Butuan City", "Mandacpan Butuan City", "Bit-os Butuan City", "Baan Riverside Butuan City", "Mahogany Butuan City", "Buhangin Butuan", "Baan Km.3 Butuan", "IRA Homes Butuan", "Lemon Butuan", "Tiniwisan Butuan", "Cabcabon Butuan", "Bobon Butuan", "Taligaman Butuan", "Taligaman High School Butuan", "Basag Butuan", "Purok 5 Basag Butuan", "Ampayon Public Market Butuan", "Ampayon Butuan", "Liboon Subdivision Butuan", "Caraga State University", "Camayah"] },

    // New routes
    { id: "1", barangays: ["Bangcasi Airport", "Dumalagan Butuan", "J.C Aquino Avenue", "A.D. Curato St. Butuan", "Durano St. Butuan", "T. Calo St.Butuan"] },
    { id: "2", barangays: ["Bangcasi", "Dumalagan", "J.C Aquino Avenue", "North Montilla Blvd", "T. Calo St.Butuan", "J.C Aquino Ave", "Dumalagan"] },
    { id: "4", barangays: ["Bangcasi", "Dumalagan", "J.C Aquino Avenue", "A. D. Curato St. Butuan", "T. Sanchez St. Butuan", "M. Calo St.", "G. Flores St. Butuan", "Rosales St.", "North Montilla Blvd.", "BOPAI Puregold Butuan Tabuan", "Holy Redeemer", "Butuan City Hall", "Gaisano Butuan", "J. C. Aquino Butuan", "Dumalagan"] },
    { id: "8", barangays: ["Sto. Nino Diocesan Shrine", "Los Angeles Butuan City", "Sumilihon Butuan City", "Taguibo", "Ampayon", "Philippine Science High School Butuan", "Tiniwisan", "Baan Butuan City", "J.C. Aquino Ave.", "J. Rosales St.", "Butuan City Hall", "J. Satorre St.", "Jeels Masagana Farm", "Salvador Calo St.", "Langihan Public Market", "Magsaysay St. Butuan", "Andaya St.", "North Montilla Blvd.", "McDonald's Butuan Downtown", "R. Calo St.", "T. Sanchez St.", "M. Calo St.", "Baan Viaduct", "Baan Km. 3", "Ampayon", "Taguibo", "Sumilihon"] },
    { id: "12", barangays: ["Amparo Butuan", "Bit-os", "Gaisano Butuan", "San Vicente Butuan City", "Montilla Blvd. Butuan", "Holy Redeemer", "City Hall", "Mandacpan Butuan City"] },
    { id: "13", barangays: ["Banza National High School Butuan", "Brgy. Maug Butuan City", "Mahogany Butuan City", "Baan Butuan", "M. Calo St. Butuan", "G. Flores Avenue Butuan", "Rosales St. Butuan City", "North Montilla Blvd.", "Obrero Elem. School", "Langihan Public Market", "Butuan City Hall", "J. Rosales St.", "J. C. Aquino Ave. (DBP)", "Baan Viaduct", "Brgy. Mahogany", "Brgy. Maug", "Brgy. Banza"] },
    { id: "10", barangays: ["Dumalagan Butuan", "J.C. Aquino Ave. Butuan", "Baan Butuan", "Baan Km. 3", "Tiniwisan Butuan", "Philippine Science High School Butuan", "Ampayon", "Vice Versa"] },
    { id: "7", barangays: ["De Oro Butuan", "Taligaman Butuan", "Antongalon Elem. School Butuan", "LTFRB Butuan", "Ampayon Butuan", "Caraga State University", "Philippine Science High School Butuan", "Tiniwisan Butuan", "Butuan Medical Center", "Baan Butuan", "M. Calo St.", "G. Flores St.", "North Montilla Blvd. Butuan", "Andaya St. Butuan", "Langihan Public Market", "Butuan City Hall", "Development Bank Of The Philippines", "SM Butuan", "R. Calo St. Butuan", "T. Sanchez St. Butuan", "M. Calo St. Butuan", "Baan Viaduct Butuan", "Baan Km. 3", "Tiniwisan Butuan", "Ampayon", "Antongalon Butuan", "Taligaman Butuan"] },
    { id: "14", barangays: ["Ampayon Butuan City", "Tiniwisan Butuan City", "Alviola Butuan City", "ERA STORE Butuan City", "Lemon Butuan City", "Pigdaulan Butuan City", "Mahay Butuan City", "San Vicente Butuan City", "Montilla Boulevard", "SM Butuan City", "Gaisano Butuan City", "Robinsons Butuan City"] }
  ];


    const getCoordinatesFromGeocodingAPI = async (location) => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return L.latLng(data[0].lat, data[0].lon);
      } else {
        throw new Error(`Location not found: ${location}`);
      }
    };

    const reverseGeocode = async (lat, lon) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        return data.address.village || data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.city || "";
      }
      return "";
    };

    const findRoute = async () => {
      if (!startLocation.value || !endLocation.value) {
        alert('Please enter both start and end locations.');
        return;
      }

      try {
        const startCoords = await getCoordinatesFromGeocodingAPI(startLocation.value);
        const endCoords = await getCoordinatesFromGeocodingAPI(endLocation.value);

        if (routeControl.value) {
          map.value.removeControl(routeControl.value);
        }

        routeControl.value = L.Routing.control({
          waypoints: [startCoords, endCoords],
          routeWhileDragging: true
        }).addTo(map.value);

        routeControl.value.on('routesfound', async (e) => {
          const route = e.routes[0];
          const coordinates = route.coordinates;
          const foundBarangays = new Set();

          for (let i = 0; i < coordinates.length; i += 10) {
            const coord = coordinates[i];
            const barangayName = await reverseGeocode(coord.lat, coord.lng);
            if (barangayName) foundBarangays.add(barangayName);
          }

          passedBarangays.value = Array.from(foundBarangays);
        });

        const start = startLocation.value.toLowerCase();
        const end = endLocation.value.toLowerCase();

        let matchedRoute = null;

        for (const route of routes) {
          const barangays = route.barangays.map(b => b.toLowerCase());
          if (barangays.some(b => start.includes(b)) && barangays.some(b => end.includes(b))) {
            matchedRoute = route.id;
            break;
          }
        }

        suggestedRoute.value = matchedRoute ? `${matchedRoute} Route` : 'No specific route matched';

      } catch (error) {
        console.error(error);
        alert('Error finding route.');
      }
    };

    const togglePassedBarangays = () => {
      showPassedBarangays.value = !showPassedBarangays.value;
      nextTick(() => {
        const list = document.querySelector('.passed-barangays-list');
        if (list) {
          list.style.maxHeight = showPassedBarangays.value ? list.scrollHeight + 'px' : '0px';
        }
      });
    };

    const toggleSuggestedRoute = () => {
      showSuggestedRoute.value = !showSuggestedRoute.value;
    };

    onMounted(() => {
      map.value = L.map('map').setView([8.9492, 125.5435], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map.value);
    });

    return { passedBarangays, suggestedRoute, startLocation, endLocation, findRoute, showPassedBarangays, showSuggestedRoute, togglePassedBarangays, toggleSuggestedRoute };
  }
};
</script>

<style scoped>
/* Background Video */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  min-height: 100vh; /* Ensures the video always covers the screen */
}

/* Video Container */
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Main Container */
.routes-container {
  position: relative;
  z-index: 1; /* Make sure it's above the video */
  padding: 20px;
  width: 100%;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Search section */
.search-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}
.search-section input {
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1 1 200px;
}
.search-section button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
.search-section button:hover {
  background-color: #0056b3;
}

/* Map */
#map {
  width: 100%;
  height: 70vh;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  background: #f8f9fa;
  z-index: 1;
}

/* Leaflet controls */
#map .leaflet-container {
  height: 100%;
  width: 100%;
}
#map .leaflet-control-container {
  z-index: 1000;
}

/* Cards */
.info-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.8); /* Slightly white glass effect */
  border-radius: 12px;
  padding: 20px;
  margin: 20px auto;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  max-width: 600px;
  animation: fadeIn 0.5s ease;
}
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
}
.info-card ul {
  list-style: none;
  padding: 0;
  margin-top: 12px;
}
.info-card li {
  font-size: 14px;
  padding: 4px 0;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

</style>
