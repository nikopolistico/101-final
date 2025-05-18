<template>
  <v-app>
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="@/assets/videos/background.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Header Section -->
    <v-app-bar app flat class="transparent-navbar">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="logo">Easy Commute</v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <nav v-if="!mobile">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/routes" class="nav-link">Ride</router-link>
          <router-link to="/fare" class="nav-link">Fare</router-link>
          <router-link to="/about" class="nav-link">About Us</router-link>
          <router-link to="/guide" class="nav-link">Guide To Use</router-link>
        </nav>
      </v-container>
    </v-app-bar>


    <slot></slot>
  </v-app>
</template>

<script setup>
import { useDisplay } from "vuetify";

// Mobile view status
const { mobile } = useDisplay();


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
  min-height: 100vh;
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

.logo {
  color: white;
  font-size: 30px;
  font-weight: bold;
}

/* Profile Image Container */
.profile-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-left: 15px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
}

/* Profile Image Styling */
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Adjustments for Navbar */
.transparent-navbar {
  background-color: rgba(0, 0, 0, 0.3);
}

.nav-link {
  color: white;
  text-decoration: none;
  margin-right: 30px;
  font-weight: 400;
  transition: opacity 0.3s ease;
}

.nav-link:hover {
  opacity: 0.8;
}

/* Mobile Drawer */
.mobile-drawer {
  background-color: black;
}

.v-list-item a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
}

.v-list-item a:hover {
  color: #007bb5;
}

/* Modal Styling */
.v-dialog{
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Card Styling */
.profile {
  border-radius: 30px;
  padding: 20px 10px;
  background-color: #000000;
  border: 3px solid white;
  color: white;
  box-shadow: 0 4px 8px rgba(196, 191, 191);
  animation: glow 3s ease-in-out infinite; /* Apply glow animation */
}

/* Title Styling */
.v-card-title.headline {
  font-size: 24px;
  font-weight: 600;
  color: #EFEEEA;
  margin-bottom: 12px;
}

/* Divider Styling */
.v-divider {
  margin: 20px 0;
}

/* File Input Styling */
.v-file-input {
  margin-bottom: 20px;
}

.v-file-input input {
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #fff;
}

.v-file-input input:focus {
  border-color: #6200ea;
  outline: none;
}

/* Button Styling */
.v-btn {
  font-weight: 500;
  text-transform: none;
  border-radius: 6px;
}

/* Primary Button Styling */
.v-btn.primary {
  background-color: #6200ea;
  color: white;
}

.v-btn.primary:hover {
  background-color: #3700b3;
}

/* Red Button Styling */
.v-btn.red {
  background-color: #d32f2f;
  color: white;
}

.v-btn.red:hover {
  background-color: #c62828;
}

/* Cancel Button Styling */
.v-btn.text {
  color: #888;
}

/* Modal Actions Styling */
.v-card-actions {
  justify-content: space-between;
  padding-top: 12px;
}

/* Glow Animation */
@keyframes glow {
  0% {
    box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #6200ea, 0 0 20px #6200ea, 0 0 25px #6200ea, 0 0 30px #6200ea;
  }
  50% {
    box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #3700b3, 0 0 40px #3700b3, 0 0 50px #3700b3, 0 0 60px #3700b3;
  }
  100% {
    box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #6200ea, 0 0 20px #6200ea, 0 0 25px #6200ea, 0 0 30px #6200ea;
  }
}

/* Adjustments for mobile */
@media (max-width: 600px) {
  .v-dialog {
    max-width: 90vw;
  }

  .v-card {
    padding: 12px;
  }

  .v-card-title.headline {
    font-size: 20px;
  }

  .v-btn {
    font-size: 14px;
  }
}
</style>
