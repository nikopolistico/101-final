<script setup>
import { RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import register from '@/assets/videos/register.mp4'

const { xsOnly } = useDisplay()
const isMobile = computed(() => xsOnly.value)
</script>

<template>
  <v-app>
    <!-- Background Video -->
    <div class="video-container">
      <video autoplay muted loop class="background-video">
        <source :src="register" type="video/mp4" />
      </video>
    </div>

    <!-- Header Section -->
    <v-app-bar app flat class="transparent-navbar">
      <v-container class="d-flex align-center">
        <!-- Logo -->
        <v-app-bar-title class="logo">
          Easy Commute
        </v-app-bar-title>

        <!-- Navigation -->
        <v-spacer></v-spacer>
        <router-link to="/">
          <button class="ml-3 adjustable-button">Sign in</button>
        </router-link>
      </v-container>
    </v-app-bar>
    <!-- FORMS -->
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <!-- Apply transparent background to v-card using class -->
          <v-card class="elevation-12 rounded-xl transparent-card blurred-background flexible-form">
            <v-toolbar dark flat class="rounded-t-xl transparent-card">
              <v-toolbar-title class="text-h5 font-weight-bold text-center white--text">
                Easy Commute
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-6 transparent-card white--text">
              <!-- Form Tabs and other content -->
              <v-tabs v-model="currentForm" grow class="white--text">
                <v-tab value="login">Login</v-tab>
                <v-tab value="signup">Sign Up</v-tab>
              </v-tabs>

              <v-window v-model="currentForm">
                <v-window-item value="login">
                  <v-form @submit.prevent="handleSubmit('login')" class="mt-5">
                    <v-text-field
                      v-model="loginEmail"
                      label="Email address"
                      prepend-icon="mdi-email"
                      type="email"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <v-text-field
                      v-model="loginPassword"
                      label="Password"
                      prepend-icon="mdi-lock"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <label class="d-flex align-center ml-2 text-sm">
                      <input v-model="rememberMe" type="checkbox" class="custom-checkbox" />
                      <span class="ml-2 white--text">Remember me</span>
                    </label>

                    <v-btn color="#98DED9" class="mt-4" block type="submit" rounded>
                      Sign In
                    </v-btn>
                  </v-form>
                </v-window-item>

                <v-window-item value="signup">
                  <v-form @submit.prevent="handleSubmit('signup')" class="mt-5">
                    <!-- Signup form fields -->
                    <v-text-field
                      v-model="fullname"
                      label="Full Name"
                      prepend-icon="mdi-account"
                      :rules="[rules.required, rules.fullname]"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <v-text-field
                      v-model="email"
                      label="Email address"
                      prepend-icon="mdi-email"
                      :rules="[rules.required, rules.email]"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <v-text-field
                      v-model="phone_number"
                      label="Phone number"
                      prepend-icon="mdi-phone"
                      :rules="[rules.required, rules.phone]"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <v-text-field
                      v-model="password"
                      label="Password"
                      prepend-icon="mdi-lock"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      :rules="[rules.required, rules.password]"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <v-text-field
                      v-model="confirmPassword"
                      label="Confirm Password"
                      prepend-icon="mdi-lock-check"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      :rules="[rules.required, rules.confirmPassword]"
                      required
                      filled
                      class="white-input"
                    ></v-text-field>
                    <v-btn color="#98DED9" class="mt-4" block type="submit" rounded>
                      Sign Up
                    </v-btn>
                  </v-form>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" class="white--text">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <RouterView />
  </v-app>
</template>

<style scoped>
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%; /* Default width */
  height: auto; /* Maintain aspect ratio */
  transform: translate(-50%, -50%); /* Center the video */
  min-width: 100%; /* Ensure video covers the width */
  min-height: 100%; /* Ensure video covers the height */
  object-fit: cover; /* Scale to cover the entire container */
  z-index: -1; /* Behind all content */
}
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.logo {
  font-size: 2em;
  font-weight: bold;
  color: white;
  user-select: none;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}
.transparent-navbar {
  background-color: transparent;
}

.white-text-custom {
  color: white !important;
}

.adjustable-button {
  position: absolute;
  top: var(--button-top, 50%); /* Default to center vertically */
  left: var(--button-left, 50%); /* Default to center horizontally */
  transform: translate(-50%, -50%); /* Center the button exactly */
  width: 130px;
  height: 50px;
  background: transparent;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  color: white;
  font-weight: 500;
  transition: 0.5s;
}

.adjustable-button:hover {
  background: #fff;
  color: #162938;
}

.adjustable-button:disabled {
  pointer-events: none;
}

.adjustable button:active {
  box-shadow: none;
  transform: translateY(0);
}

/* Responsive adjustments */
.adjustable-button {
  position: absolute;
  top: var(--button-top, 60%); /* Default to center vertically */
  left: var(--button-left, 85%); /* Default to center horizontally */
  transform: translate(-50%, -50%); /* Center the button exactly */
  width: 130px;
  height: 50px;
  background: transparent;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  color: white;
  font-weight: 500;
  transition: 0.5s;
}

.adjustable-button:hover {
  background: #fff;
  color: #162938;
}

.adjustable-button:disabled {
  pointer-events: none;
}

.adjustable button:active {
  box-shadow: none;
  transform: translateY(0);
}

/* Media Query for Small Devices */
@media (max-width: 600px) {
  .adjustable-button {
    width: 130px; /* Larger width for small devices */
    font-size: 1rem; /* Larger, more legible font size */
    top: 60%; /* Slightly adjust position for better visibility */
    left: 75%;
    transform: translate(-50%, -50%);
  }
}
/* Adjustments for smaller screens */
@media (max-width: 900px) {
  .logo {
    font-size: 1em;
  }
}

@media (max-width: 600px) {
  .logo {
    font-size: 1em;
  }
}

@media (max-width: 400px) {
  .logo {
    font-size: 1em;
  }
}

/* Transparent Card */
.transparent-card {
  background-color: transparent !important;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Blurred Background */
.blurred-background {
  backdrop-filter: blur(10px);
}

/* White text for forms */
.white-input .v-input__control {
  color: white !important;
}

/* Ensure all text is white */
.white--text {
  color: white !important;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 4px;
  background-color: transparent;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative; /* To position the checkmark inside */
}

.custom-checkbox:checked {
  background-color: transparent;
  border-color: white; /* Ensure the border color is white when checked */
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 4px;
  width: 4px;
  height: 7px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg); /* Make the checkmark */
}

.ml-2 {
  margin-left: 8px;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

/* Media Queries for Responsiveness */

/* Small Devices (e.g., Phones) */
@media (max-width: 600px) {
  .transparent-card {
    max-height: 80vh; /* Limit height for smaller screens */
    overflow-y: auto;
    /* Add padding for better usability */
    background-color: transparent; /* Keep background transparent */
  }
}


/* Medium Devices (e.g., Tablets) */
@media (min-width: 601px) and (max-width: 960px) {
  .transparent-card {
    max-height: 80vh; /* Adjust height for medium screens */
    overflow-y: auto;
    background-color: transparent; /* Keep background transparent */
  }
}
</style>

<script>
import { supabase } from '../../supabaseClient'

export default {
  data() {
    return {
      currentForm: 'login',
      showPassword: false,
      fullname: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      loginEmail: '',
      loginPassword: '',
      rememberMe: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      rules: {
        required: (v) => !!v || 'This field is required',
        fullname: (v) => (v && v.length >= 10) || 'Name should be at least 10 characters long',
        email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        phone: (v) =>
          (v && v.length === 11 && /^\d+$/.test(v)) || 'Phone number should be 11 digits',
        password: (v) =>
          (v &&
            v.length >= 8 &&
            /[A-Z]/.test(v) &&
            /[a-z]/.test(v) &&
            /[0-9]/.test(v) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(v)) ||
          'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      },
    }
  },
  methods: {
    showSnackbar(text, color) {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    },
    async handleSubmit(formType) {
      if (formType === 'login') {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: this.loginEmail,
            password: this.loginPassword,
          })

          if (error) throw error

          if (!data.session) {
            throw new Error('No session returned from login.')
          }

          localStorage.setItem('access_token', data.session.access_token)
          localStorage.setItem('refresh_token', data.session.refresh_token)

          if (this.rememberMe) {
            localStorage.setItem('email', this.loginEmail)
            localStorage.setItem('password', this.loginPassword)
          } else {
            localStorage.removeItem('email')
            localStorage.removeItem('password')
          }

          this.showSnackbar('Login successful!', 'success')
          // Redirect to home page after successful signup
          this.$router.push('/home')
        } catch (error) {
          console.error('Login error:', error)
          this.showSnackbar(`Login error: ${error.message}`, 'error')
        }
      } else if (formType === 'signup') {
        if (this.password !== this.confirmPassword) {
          this.showSnackbar('Passwords do not match', 'error')
          return
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password,
          })

          if (error) throw error

          const user_id = data.user?.id
          if (!user_id) throw new Error('Failed to get user ID during signup.')

          const { error: insertError } = await supabase.from('users_').insert([
            {
              verified_id: user_id,
              fullname: this.fullname,
              email_address: this.email,
              phone_number: this.phone_number,
            },
          ])

          if (insertError) throw new Error('Unable to save user details to the database.')

          this.showSnackbar('Signup successful please check your email!', 'success')
          // Redirect to home page after successful signup
          this.$router.push('/home')

          // Clear form fields after successful signup
          this.fullname = ''
          this.email = ''
          this.phone_number = ''
          this.password = ''
          this.confirmPassword = ''
        } catch (error) {
          console.error('Signup error:', error)
          this.showSnackbar(`Signup error: ${error.message}`, 'error')
        }
      }
    },
  },
  mounted() {
    const savedEmail = localStorage.getItem('email')
    const savedPassword = localStorage.getItem('password')
    if (savedEmail && savedPassword) {
      this.loginEmail = savedEmail
      this.loginPassword = savedPassword
      this.rememberMe = true
    }
  },
}
</script>
