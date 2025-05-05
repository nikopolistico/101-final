<template>
    <!-- Foreground Content -->
    <div class="content-wrapper">
      <!-- Title and Intro -->
      <h1 class="main-title">Welcome to Easy Commute</h1>
      <p class="description-text">
        Our mission is to make commuting easier, faster, and stress-free.
      </p>

      <!-- Step-by-Step Guide -->
      <div class="steps-section">
        <h2 class="steps-title">How to Use</h2>
        <ol class="steps-list">
          <li><strong>Step 1:</strong> Click the <em>Ride Link</em> tab.</li>
          <li><strong>Step 2:</strong> Pick whether you want to ride.</li>
          <li><strong>Step 3:</strong> Choose the route you want.</li>
        </ol>
      </div>
    </div>
</template>

<script setup>
</script>

<style scoped>

/* Transparent Foreground Content */
.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 2rem;
  color: white;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: transparent;
}

/* Heading with glow effect */
.main-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
  background-color: transparent;
}

/* Description with softened white and glow */
.description-text {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
  text-align: justify;
  color: rgba(255, 255, 255, 0.75);
  background-color: transparent;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
}

/* Steps Section */
.steps-section {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  text-align: left;
}

.steps-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}

.steps-list {
  list-style-position: inside;
  font-size: 1.1rem;
  line-height: 1.8;
  padding: 0;
  margin: 0;
}
</style>
