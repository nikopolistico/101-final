<template>
  <v-app>
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source src="@/assets/videos/background.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Header Section -->
    <v-app-bar app flat class="transparent-navbar" v-if="!isAuthRoute">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="logo">Easy Commute</v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <nav v-if="!mobile">
          <router-link to="/home" class="nav-link">Home</router-link>
          <router-link to="/routes" class="nav-link">Ride</router-link>
          <router-link to="/fare" class="nav-link">Fare</router-link>
          <router-link to="/about" class="nav-link">About Us</router-link>
          <router-link to="/guide" class="nav-link">Guide To Use</router-link>
        </nav>

        <!-- Profile Image Container (Click to open Profile Modal) -->
        <div class="profile-image-container" @click="openProfileModal">
          <img :src="profileImageUrl || defaultAvatar" class="profile-image" alt="Profile Image" />
        </div>

        <!-- Mobile Navigation Toggle -->
        <v-btn icon v-if="mobile" @click="drawer = !drawer">
          <v-icon color="white">mdi-menu</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Profile Update Modal -->
    <v-dialog v-model="profileModal" max-width="400px">
      <v-card class="profile">
        <v-card-title class="headline">Profile</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="newProfileImage"
            label="Choose a new profile image"
            accept="image/*"
            @change="onImageChange"
          ></v-file-input>

          <!-- Show Uploading spinner -->
          <v-progress-circular
            v-if="uploading"
            indeterminate
            color="primary"
            size="50"
            class="mt-3"
          ></v-progress-circular>

          <!-- Show error if upload failed -->
          <v-alert v-if="uploadError" type="error" class="mt-3">{{ uploadError }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="uploadImage(newProfileImage)">Update Image</v-btn>
          <v-btn text @click="profileModal = false">Cancel</v-btn>
        </v-card-actions>

        <v-divider></v-divider>

        <!-- Logout Option -->
        <v-card-actions>
          <v-btn color="red" @click="logoutModal = true">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Logout Confirmation Modal -->
    <v-dialog v-model="logoutModal" max-width="400px">
      <v-card>
        <v-card-title class="headline">Logout</v-card-title>
        <v-card-actions>
          <v-btn color="primary" @click="signOut">Logout</v-btn>
          <v-btn text @click="logoutModal = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <slot></slot>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // import useRoute to get the current route
import { supabase } from '@/supabaseClient.js';
import { useDisplay } from "vuetify";
import defaultAvatar from "@/assets/images/avatar.png";

// Mobile view status
const { mobile } = useDisplay();
const drawer = ref(false);
const profileModal = ref(false); // Controls the profile modal visibility
const logoutModal = ref(false); // Controls the logout modal visibility
const profileImageUrl = ref(null);  // To store the profile image URL
const newProfileImage = ref(null); // Holds the new profile image selected by the user
const uploading = ref(false); // Tracks upload state
const uploadError = ref(null); // Holds upload errors
const route = useRoute(); // Get the current route

// Reactive reference for auth check
const isAuthRoute = ref(false);

// Watch route changes to dynamically set isAuthRoute
watch(() => route.name, (newRouteName) => {
  isAuthRoute.value = newRouteName === 'auth';
}, { immediate: true });

// Handle file input change
const onImageChange = () => {
  if (newProfileImage.value) {
    uploadImage(newProfileImage.value);
  }
};

const uploadImage = async (file) => {
  if (!file) return;

  uploading.value = true;
  uploadError.value = null;

  try {
    const fileName = `${Date.now()}-${file.name}`;

    // Step 1: Upload the image to Supabase storage (in the 'profile-pictures' bucket)
    const { data, error: uploadErrorResult } = await supabase.storage
      .from('profile-pictures') // Assuming you are using the 'profile-pictures' bucket
      .upload(fileName, file);

    if (uploadErrorResult) {
      uploadError.value = 'Error uploading image.';
      console.error('Upload error:', uploadErrorResult);
      return;
    }

    // Step 2: Build the public URL for the uploaded image
    const filePath = data.path;
    const baseURL = 'https://ntmuznsceqhiytbmfmox.supabase.co'; // Replace with your Supabase project's URL
    const publicURL = `${baseURL}/storage/v1/object/public/profile-pictures/${filePath}`;

    // Set the profile image URL to display in the app
    profileImageUrl.value = publicURL;

    // Step 3: Fetch the authenticated user
    const { data: user, error: getUserError } = await supabase.auth.getUser();

    if (getUserError) {
      throw new Error(`Error fetching user: ${getUserError.message}`);
    }

    // Step 4: Directly update the user's profile image URL in the 'profiles' table
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .upsert({
        v_id: user.id,  // Directly use the authenticated user's id as v_id
        profile_image: publicURL,  // Update the profile_image field with the uploaded image URL
      });

    if (updateError) {
      throw new Error(`Error updating profile image: ${updateError.message}`);
    }

    console.log("Profile image updated successfully:", updatedProfile);

    // Step 5: Update the displayed profile image in the app
    profileImageUrl.value = publicURL;

  } catch (error) {
    console.error("Error in uploadImage:", error.message);
    uploadError.value = 'Unexpected error occurred.';
  } finally {
    uploading.value = false;
  }
};

// Sign-out function
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  } else {
    console.log("Successfully signed out!");
    window.location.href = '/';  // Redirect to home or login page
  }
};

// Open the profile update modal
const openProfileModal = () => {
  profileModal.value = true;
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
