<template>
  <v-app>
    <div class="routes-container">
      <!-- Section 1: Search & Map -->
      <div class="section-1">
        <v-col cols="12" class="text-left mt-10 text-white">
          <h1>🚖Find Your Route</h1>
        </v-col>

        <div class="search-section">
          <input v-model="startLocation" type="text" placeholder="from" />
          <input v-model="endLocation" type="text" placeholder="to" />
          <button @click="findRoute">Find Best Route</button>
        </div>

        <div id="map" style="height: 500px;"></div>
      </div>

    </div>
      <!-- Section 2: Route Details -->
      <div class="section-2 ml-5">
          <div class="info-wrapper">
            <div class="info-header mt-10">
              <h2>Barangaypassed</h2>
            </div>
            <transition name="fade">
              <ul v-show="showPassedBarangays">
                <li class="text-white" v-for="(barangay, index) in passedBarangays" :key="index">
                  {{ barangay }}
                </li>
              </ul>
            </transition>

            <div class="info-header">
              <h2 class="mt-10">SuggestedRoute</h2>
            </div>
            <transition name="fade">
              <ul>
                <li class="text-white" v-for="route in suggestedRouteList" :key="route">
                  {{ route }} Route
                </li>
              </ul>
            </transition>
          </div>

          <div class="info-card mt-5">
            <h4 class="text-white">Turn-by-Turn Directions</h4>
            <ul>
              <li v-for="(instruction, index) in routeInstructions" :key="index" class="text-white">
                {{ index + 1 }}. {{ instruction }}
              </li>
            </ul>
        </div>


      <!-- Section 3: Manual Routes List -->
      <div class="section-3">
        <div class="info-card">
          <h2 class="text-white">Click on a route to show it on the map</h2>
          <h3>Tricycle</h3>
          <ul class="two-column-list">
            <li
              v-for="route in routes.filter(r => !isNumeric(r.id))"
              :key="route.id"
              @click="polygonroutes(route.id)"
              style="cursor: pointer; user-select: none;"
              title="Click to show route on map"
            >
              {{ route.id }}
            </li>
          </ul>

          <h3 class="mt-2">Multicab</h3>
          <ul class="two-column-list">
            <li
              v-for="route in routes.filter(r => isNumeric(r.id))"
              :key="route.id"
              @click="polygonroutes(route.id)"
              style="cursor: pointer; user-select: none;"
              title="Click to show route on map"
            >
              {{ route.id }}
            </li>
          </ul>

        </div>
      </div>

    </div>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet-routing-machine";

export default {
  setup() {
    const map = ref(null);

    const bestRouteLayer = ref(null);
    const selectedRouteLayer = ref(null);

    const passedBarangays = ref([]);
    const suggestedRoute = ref("");
    const startLocation = ref("");
    const endLocation = ref("");
    const showPassedBarangays = ref(true);
    const suggestedRouteList = ref([]);
    const routeInstructions = ref([]);


    const movingMarker = ref(null);

    const routes = [
  { id: "Red", barangays: ["Holy Redeemer", "Obrero", "Ambago", "Bading", "Agusan Pequeño", "Pagatpatan"] },
  { id: "White", barangays: ["Robinsons", "Libertad", "Bancasi", "Dumalagan"] },
  { id: "Yellow", barangays: ["Holy Redeemer", "Obrero", "Doongan", "Ambago", "Babag", "Bading", "Agusan Pequeño", "Pagatpatan", "P. Rizal", "Villa Kananga"]},
  { id: "Green", barangays: ["Langihan", "Slaughterhouse", "Doongan", "Ambago", "Babag", "Bading", "Agusan Pequeño", "Pagatpatan", "P. Rizal", "Villa Kananga"] },
  { id: "1", barangays: ["Bancasi", "Dumalagan", "Libertad", "Robinsons", "SM", "Diego Silang"] },
  { id: "2", barangays: ["Bancasi", "Dumalagan", "Libertad","Robinsons", "SM", "Gaisano", "Diego Silang"] },
  { id: "4", barangays: ["Bancasi", "Dumalagan",  "Libertad","Robinsons","SM", "Gaisano","J.C Aquino Avenue", "Langihan", "Holy Redeemer", "City Hall"] },
  { id: "7", barangays: ["Taligaman", "Ampayon", "Caraga State University", "Tiniwisan", "Baan", "City Hall", "SM", "Gaisano", "Ampayon", "Antongalon"] },
  { id: "8", barangays: ["Los Angeles", "Sumilihon", "Taguibo", "Ampayon", "Tiniwisan", "Baan", "City Hall","Langihan Public Market", "Gaisano", "Ampayon", "Taguibo", "Caraga State University"] },
  { id: "10", barangays: ["Dumalagan", "Baan", "Baan Km. 3", "Tiniwisan", "Ampayon", "Robinsons", "SM", "Gaisano"] },
  { id: "12", barangays: ["Amparo", "Bit-os", "Gaisano", "San Vicente", "Montilla Blvd.", "Holy Redeemer", "City Hall", "Mandacpan"] },
  { id: "14", barangays: ["Ampayon", "Tiniwisan","Lemon", "Pigdaulan", "Mahay", "San Vicente", "SM", "Gaisano", "Robinsons"] },
];


const isNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};



    const getCoordinatesFromGeocodingAPI = async (location) => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location + " Butuan City"
      )}&format=json&limit=1`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
      } else {
        throw new Error(`Location not found: ${location}`);
      }
    };

    // Flexible match function checks substrings both ways
    const matches = (input, barangay) => {
      input = input.toLowerCase();
      barangay = barangay.toLowerCase();
      return barangay.includes(input) || input.includes(barangay);
    };

    const polygonroutes = async (routeId) => {
  const route = routes.find((r) => r.id === routeId);
  if (!route) return;

  try {
    const coordsPromises = route.barangays.map((b) =>
      getCoordinatesFromGeocodingAPI(b)
    );
    const coords = await Promise.all(coordsPromises);

    // Remove existing manual route
    if (map.value._manualRoutingControl) {
      map.value.removeControl(map.value._manualRoutingControl);
      map.value._manualRoutingControl = null;
    }

    // Create routing control with no UI box
    const routingControl = L.Routing.control({
      waypoints: coords,
      lineOptions: {
        styles: [{ color: "red", weight: 2, opacity: 0.9 }],
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false, // ❌ disables default instruction box
    }).addTo(map.value);

    // 🧽 Remove the routing container from DOM just in case
    const container = document.querySelector('.leaflet-routing-container');
    if (container) container.remove();

    map.value._manualRoutingControl = routingControl;
  } catch (error) {
    console.error("Error routing selected route:", error);
    alert("Failed to draw the selected route.");
  }
};



    // Reverse geocode to find barangays along best route
    const reverseGeocode = async (lat, lon) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        return (
          data.address.village ||
          data.address.suburb ||
          data.address.neighbourhood ||
          data.address.city_district ||
          data.address.city ||
          ""
        );
      }
      return "";
    };

    // Get barangays passed by best route
    const passedBarangaysUpdate = async (coordinates) => {
      try {
        const foundBarangays = new Set();

        for (let i = 0; i < coordinates.length; i += 10) {
          const coord = coordinates[i];
          const barangayName = await reverseGeocode(coord.lat, coord.lng);
          if (barangayName) foundBarangays.add(barangayName);
        }

        passedBarangays.value = Array.from(foundBarangays);
      } catch (err) {
        console.error("Error getting passed barangays:", err);
      }
    };

    const findRoute = async () => {
  if (!startLocation.value || !endLocation.value) {
    alert("Please enter both start and end locations.");
    return;
  }

  try {
    const startCoords = await getCoordinatesFromGeocodingAPI(startLocation.value);
    const endCoords = await getCoordinatesFromGeocodingAPI(endLocation.value);

    if (bestRouteLayer.value) {
      map.value.removeLayer(bestRouteLayer.value);
      bestRouteLayer.value = null;
    }

    if (map.value._routingControl) {
      map.value.removeControl(map.value._routingControl);
      map.value._routingControl = null;
    }

    const routingControl = L.Routing.control({
      waypoints: [startCoords, endCoords],
      lineOptions: {
        styles: [{ color: "#0118D8", weight: 2, opacity: 0.9 }],
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: false,
      show: false, // ❌ Hides default UI
    });

    routingControl.addTo(map.value);
    map.value._routingControl = routingControl;

    routingControl.on("routesfound", async (e) => {
      const route = e.routes[0];

      // ✂️ REMOVE leaflet-routing-container from map
      const container = document.querySelector('.leaflet-routing-container');
      if (container) container.remove();

      // Draw green route line
      if (bestRouteLayer.value) {
        map.value.removeLayer(bestRouteLayer.value);
      }

      bestRouteLayer.value = L.polyline(route.coordinates, {
        color: "#0118D8",
        weight: 2,
        opacity: 0.9,
      }).addTo(map.value);

      // Emoji marker
      const emojiIcon = L.divIcon({
        className: 'emoji-marker',
        html: '🚖',
        iconSize: [40, 40],
        iconAnchor: [15, 15],
      });

      movingMarker.value = L.marker(route.coordinates[0], { icon: emojiIcon }).addTo(map.value);

      let currentIndex = 0;
      const speed = 100;
      function moveMarker() {
        if (currentIndex < route.coordinates.length) {
          movingMarker.value.setLatLng(route.coordinates[currentIndex]);
          currentIndex++;
          setTimeout(moveMarker, speed);
        }
      }
      moveMarker();

      // Barangays along route
      await passedBarangaysUpdate(route.coordinates);

      // Suggested Routes Matching
      const start = startLocation.value.trim().toLowerCase();
      const end = endLocation.value.trim().toLowerCase();

      let matchedRoutes = [];
      for (const r of routes) {
        const barangaysLower = r.barangays.map((b) => b.trim().toLowerCase());
        const startMatch = barangaysLower.some((b) => matches(start, b));
        const endMatch = barangaysLower.some((b) => matches(end, b));
        if (startMatch && endMatch) {
          matchedRoutes.push(r.id);
        }
      }

      suggestedRouteList.value = matchedRoutes;
      suggestedRoute.value = matchedRoutes.length
        ? `${matchedRoutes.join(", ")} Route${matchedRoutes.length > 1 ? 's' : ''}`
        : "No specific route matched";

      // Fit view
      if (selectedRouteLayer.value) {
        const group = L.featureGroup([bestRouteLayer.value, selectedRouteLayer.value]);
        map.value.fitBounds(group.getBounds());
      } else {
        map.value.fitBounds(bestRouteLayer.value.getBounds());
      }

      // 📋 Store directions in Section 3 only
      routeInstructions.value = [];
      if (route.instructions?.length) {
        route.instructions.forEach(i => {
          routeInstructions.value.push(`${i.text} — ${i.distance.toFixed(0)} m`);
        });
      } else if (route.legs?.length > 0) {
        route.legs[0].steps.forEach(step => {
          if (step.instruction) {
            routeInstructions.value.push(`${step.instruction} — ${step.distance.toFixed(0)} m`);
          }
        });
      }

      // Clean up
      routingControl.remove();
      map.value._routingControl = null;
    });
  } catch (error) {
    console.error(error);
    alert("Error finding route.");
  }
};



    onMounted(() => {
      map.value = L.map("map").setView([8.9492, 125.5435], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map.value);
    });

    return {
      startLocation,
      endLocation,
      findRoute,
      polygonroutes,
      routes,
      passedBarangays,
      suggestedRoute,
      showPassedBarangays,
      suggestedRouteList,
      isNumeric,
      routeInstructions,
    };
  },
};
</script>


<style scoped>

/* Main Container */
.routes-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: 80vh;
  width: 100%;
  padding: 2px;
  max-width: 1200px;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  flex-wrap: nowrap;
}

.section-1 {
  flex: 9;
  max-width: 80%;
  overflow-y: auto;
  min-width: 300px;
}

.section-2 {
  position: fixed;
  top: 100px;
  right: 220px;
  width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10000;
}

/* Section 3 pinned to far right */
.section-3 {
  position: fixed;
  top: 100px;
  right: 50px;
  width: 180px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(0,0,0,0.7);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 10000;
}

/* Search section */
.search-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
  color: white;
  z-index: 1;
}

.search-section input {
  color: white;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1 1 200px;
  background: transparent;
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
  margin: 20px auto;
  max-width: 1200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: #F5F5DC;
  position: relative;
  z-index: 2;
  background: transparent;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  animation: fadeIn 0.5s ease;
}

/* Section 2 info-card text aligned left with better spacing */
.section-2 .info-card {
  margin: 20px 0;
  max-width: 100%;
  text-align: center;
  padding: 10px 8px;
  line-height: 1.4;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Optional: style the titles inside section-2 */
.section-2 .info-card h2,
.section-2 .info-card p {
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 14px;
  color: #F5F5DC;
}

.info-header {
  display: block;
  margin: 0;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  padding: 10px 0;
  color: #F5F5DC;
  text-align: center
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

/* Override margin to align left in section-3 */
.section-3 .info-card {
  margin: 20px 0;
  max-width: 100%;
  text-align: left;
  padding: 10px;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Two-column list for routes */
.two-column-list {
  text-align: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 30px;
  padding: 0;
  list-style: none;
}

.two-column-list li {
  border-radius: 10px;
  padding: 10px;
  border: 2px solid #B6B09F;
}

/* ===== Responsive Styles ===== */
@media (max-width: 1024px) {
  .routes-container {
    flex-wrap: wrap;
    justify-content: center;
    min-height: auto;
  }

  .section-1,
  .section-2,
  .section-3 {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    width: 100% !important;
    max-height: none !important;
    overflow-y: visible !important;
    margin-bottom: 20px;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .section-2 .info-card,
  .section-3 .info-card {
    padding: 10px !important;
    background: rgba(0, 0, 0, 0.7) !important;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
}

@media (max-width: 600px) {
  .search-section {
    flex-direction: column;
    gap: 12px;
  }

  .search-section input,
  .search-section button {
    flex: 1 1 100%;
    width: 100%;
  }

  #map {
    height: 50vh;
  }

  .info-card {
    padding: 12px 8px;
  }

  .info-header {
    font-size: 11px;
  }

  .info-card li {
    font-size: 12px;
  }

  .two-column-list {
    grid-template-columns: 1fr;
    gap: 8px 0;
  }

  .two-column-list li {
    padding: 8px;
  }
}

</style>
