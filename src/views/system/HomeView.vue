<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import backgroundVideo from '@/assets/videos/homeview.mp4'

const { mobile } = useDisplay()
const drawer = ref(false)
const zoomedImage = ref(null)
const showModal = ref(false)

const openModal = (image) => {
  zoomedImage.value = image
  showModal.value = true
}

const closeModal = () => {
  zoomedImage.value = null // Reset image when closing
  showModal.value = false
}
</script>

<template>
  <v-app>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source :src="backgroundVideo" type="video/mp4" />
      </video>
    </div>

    <!-- First Row (Content above video) -->
    <div class="overlay">
      <div class="main-title">DON'T KNOW</div>
      <div class="subtitle">WHERE TO GO?</div>
      <RouterLink to="/routes" style="text-decoration: none">
        <v-btn class="contact-button"> GET STARTED </v-btn>
      </RouterLink>
    </div>

 
  </v-app>
</template>

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
.logo {
  display: flex;
  align-items: center;
  font-size: 2rem; /* Large screens default size */
  font-weight: bold;
  text-align: center;
  color: white; /* Ensures visibility on dark backgrounds */
  transition: font-size 0.3s ease;
}

/* Overlay Styles for text and button */
.overlay {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  text-align: left;
  color: white;
  z-index: 1;
  width: 90%; /* Ensures text fits well on smaller screens */
}

.main-title {
  font-size: 5rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow:
    2px 2px 10px #00bfff,
    4px 4px 10px rgba(254, 254, 254, 0.8);
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.5rem;
  text-transform: uppercase;
  margin-bottom: 20px;
  letter-spacing: 3px;
}

/* Contact Button */
.contact-button {
  display: inline-block;
  background-color: #00bfff;
  color: black;
  text-transform: uppercase;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 30px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 255, 128, 0.4);
}

.contact-button:hover {
  background-color: #ffffff;
  color: #00bfff;
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 255, 128, 0.6);
}

/* Additional Media Queries for Tablets and Larger Devices */
@media (max-width: 768px) {
  .main-title {
    font-size: 4rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .main-title {
    font-size: 5rem;
  }

  .subtitle {
    font-size: 1.8rem;
  }
}

@media (min-width: 1025px) {
  .main-title {
    font-size: 5.5rem;
  }

  .subtitle {
    font-size: 2rem;
  }

  .nav-link {
    font-size: 1.2rem;
  }
}

/* Adjustments for smaller screens */
@media (max-width: 900px) {
  .logo {
    font-size: 1.5em;
  }
}

@media (max-width: 600px) {
  .logo {
    font-size: 1.2em;
  }
}

@media (max-width: 400px) {
  .logo {
    font-size: 1em;
  }
}
</style>
