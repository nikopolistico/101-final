<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import backgroundVideo from '@/assets/videos/background.mp4'
import niko from '@/assets/images/niko.jpg'
import cyril from '@/assets/images/cyril.jpg'
import james from '@/assets/images/james.jpg'
import logo from '@/assets/images/logo.png'

import avatarniko from '@/assets/avatars/niko.png'
import avatarcyril from '@/assets/avatars/cyril.png'
import avatarjames from '@/assets/avatars/james.png'

const { mobile } = useDisplay()

const avatars = [
  { name: 'Niko R. Polistico', avatar: avatarniko,  image: niko, description: 'Niko is a highly skilled editor known for his sharp eye for detail and commitment to quality storytelling. With years of experience in video and content editing, he brings creative vision to life through seamless transitions, precise timing, and impactful visuals.' },
  { name: 'Cyril Rollo',  avatar: avatarcyril, image: cyril, description: 'Cyril is in charge of crafting compelling content and leading outreach initiatives. He creates engaging materials tailored to the audience while also building strong connections with partners, collaborators, and the community. With a strategic approach to communication, Cyril ensures that the message not only reaches the right people' },
  { name: 'James Bongato', avatar: avatarjames,  image: james, description: 'James leads the creative direction for design and branding, ensuring every visual element aligns with a keen eye for aesthetics and a deep understanding of brand psychology, he crafts designs that are not only visually stunning but also communicate purpose and personality. From logos and layouts to color palettes and brand voice.' }
]

const aboutus = [
  { name: 'Easy Commute Developer', image: logo, description: 'As an Easy Commute Developer, I focus on building user-friendly features that simplify daily transportation for commuters through efficient and accessible technology.'}
]

const selected = ref(0)
</script>

<template>
  <v-app>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source :src="backgroundVideo" type="video/mp4" />
      </video>
    </div>

    <v-container fluid class="fill-height d-flex align-center justify-center">
      <v-row class="ma-0 pa-0" no-gutters>

        <!-- Left Side: Avatars -->
        <v-col cols="12" md="3" class="d-flex flex-column align-center justify-center mb-6 mb-md-0">
          <div
            v-for="(item, index) in avatars"
            :key="index"
            class="d-flex align-center mb-6"
            @click="selected = index"
            style="cursor: pointer;"
          >
            <v-avatar
              size="100"
              md="150"
              :class="['avatar-border', { active: selected === index }]"
            >
              <img :src="item.avatar" :alt="item.name" width="auto" height="50%" />
            </v-avatar>
            <div class="line" v-if="!mobile"></div> <!-- Hide line in mobile -->
          </div>
        </v-col>

        <!-- Right Side: Selected Avatar Content -->
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-sheet class="content-box" elevation="4">
            <img :src="avatars[selected].image" alt="" class="content-image mb-4" />
            <h1 class="text-h5 text-white mb-4 text-center text-md-left">{{ avatars[selected].name }}</h1>
            <p class="text-white text-justify font-weight-light">{{ avatars[selected].description }}</p>
          </v-sheet>
        </v-col>

        <!-- About Us Panel -->
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-sheet class="content-box" elevation="4">
            <img :src="aboutus[selected].image" alt="" class="content-image mb-4" />
            <h1 class="text-h5 text-white mb-4 text-center text-md-left">{{ aboutus[selected].name }}</h1>
            <p class="text-white text-justify">{{ aboutus[selected].description }}</p>
          </v-sheet>
        </v-col>

      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
/* Background Video */
.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
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

/* Avatar Styles */
.avatar-border {
  border: 2px solid transparent;
  margin-right: 16px;
  transition: border-color 0.3s ease;
  position: relative;
  background-color: transparent;
}
.avatar-border.active {
  border-color: #00bfff;
}

/* Horizontal Line */
.line {
  width: 100px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin-left: 16px;
  z-index: 2;
  position: relative;
}

/* Content Box */
.content-box {
  width: 100%;
  max-width: 400px;
  height: auto;
  min-height: 400px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 24px;
  border-radius: 16px;
  z-index: 2;
  position: relative;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
}

/* Images inside content */
.content-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

/* Responsive Rules */
@media (max-width: 960px) {
  .avatar-border {
    margin-bottom: 16px;
  }
  .line {
    display: none;
  }
}
@media (max-width: 600px) {
  .content-box {
    max-width: 90%;
    margin-top: 20px;
  }
  .content-image {
    max-height: 200px;
  }
}

</style>
