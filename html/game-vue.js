// Vue 3 version using Composition API
const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

createApp({
  setup() {
    // Reactive state
    const selectedSport = ref('Football');
    const meBoxTransform = ref({ x: 0, y: 0 });
    const sportsData = ref(sports);

    // Template refs
    const sportContainer = ref(null);
    const meBox = ref(null);

    // Helper function to normalize and find sport (case-insensitive)
    function findSportByName(sportName) {
      if (!sportName || typeof sportName !== "string") {
        return null;
      }

      // Normalize input: trim whitespace and convert to lowercase
      const normalizedInput = sportName.trim().toLowerCase();

      // Find sport with case-insensitive comparison
      return sportsData.value.find(
        (sport) => sport.name && sport.name.toLowerCase() === normalizedInput
      ) || null;
    }

    // Validate sport data structure
    function validateSportData(sport) {
      if (!sport) return false;
      if (!sport.name || typeof sport.name !== "string") return false;
      if (!sport.bg_color || typeof sport.bg_color !== "string") return false;
      if (!Array.isArray(sport.equipments)) return false;
      return true;
    }

    // Computed property for current sport data
    const currentSport = computed(() => {
      const sport = findSportByName(selectedSport.value);
      if (sport && validateSportData(sport)) {
        return sport;
      }
      return null;
    });

    // Animate Me box to selected sport position
    function animateMeBox(sportName) {
      // Validate input
      if (!sportName || typeof sportName !== "string") {
        console.warn("Invalid sport name provided to animateMeBox:", sportName);
        return;
      }

      // Wait for DOM to update, then calculate position
      nextTick(() => {
        // Use template refs or fallback to getElementById
        const containerEl = sportContainer.value || document.getElementById("sport-container");
        const meBoxEl = meBox.value || document.getElementById("me-box");

        if (!meBoxEl || !containerEl) {
          console.error("Required DOM elements not found for animation");
          return;
        }

        // Normalize sport name to lowercase for ID matching
        const normalizedName = sportName.trim().toLowerCase();
        const sportBoxId = `sport-box-${normalizedName}`;
        const targetBox = document.getElementById(sportBoxId);

        if (!targetBox) {
          console.warn(`Sport box not found for: ${sportName} (ID: ${sportBoxId})`);
          return;
        }

        // Get the position of the target sport box relative to the container
        const containerRect = containerEl.getBoundingClientRect();
        const targetRect = targetBox.getBoundingClientRect();

        // Calculate the position relative to the container
        const x = targetRect.left - containerRect.left;
        const y = targetRect.top - containerRect.top;

        // Validate calculated positions
        if (isNaN(x) || isNaN(y)) {
          console.error("Invalid position calculated for animation");
          return;
        }

        // Update reactive transform value
        meBoxTransform.value = { x, y };
      });
    }

    // Handle sport selection
    function handleSportSelection(sportName) {
      // Validate input
      if (!sportName || typeof sportName !== "string") {
        console.warn("Invalid sport selection:", sportName);
        return;
      }

      // Find sport using case-insensitive comparison
      const sport = findSportByName(sportName);

      if (sport && validateSportData(sport)) {
        selectedSport.value = sport.name; // Update reactive state
        animateMeBox(sport.name);
      } else {
        console.warn(`Sport not found or invalid: ${sportName}`);
      }
    }

    // Initialize on mount
    onMounted(() => {
      // Set default to Football
      const defaultSport = findSportByName("Football");
      if (defaultSport && validateSportData(defaultSport)) {
        selectedSport.value = defaultSport.name;
        animateMeBox(defaultSport.name);
      } else {
        console.error("Failed to initialize: Football sport not found or invalid");
      }

      // Set up event listeners for radio buttons
      const radioButtons = document.querySelectorAll('input[name="sport"]');
      if (radioButtons && radioButtons.length > 0) {
        radioButtons.forEach((radio) => {
          radio.addEventListener("change", (event) => {
            if (event.target && event.target.value) {
              handleSportSelection(event.target.value);
            }
          });
        });
      }

      // Update DOM elements with Vue reactive data
      updateDOM();
    });

    // Watch for sport changes to update DOM
    watch(selectedSport, (newSport) => {
      if (newSport) {
        animateMeBox(newSport);
        updateDOM();
      }
    });

    // Update DOM elements with reactive data
    function updateDOM() {
      nextTick(() => {
        const sport = currentSport.value;
        if (!sport) return;

        // Update container background color
        const containerEl = sportContainer.value || document.getElementById("sport-container");
        if (containerEl && sport.bg_color) {
          containerEl.style.backgroundColor = sport.bg_color;
        }

        // Update selected sport text
        const selectedSportEl = document.getElementById("selected-sport");
        if (selectedSportEl && sport.name) {
          selectedSportEl.textContent = `Select Sport: ${sport.name}`;
        }

        // Update equipment list
        const equipmentListEl = document.getElementById("equipment-list");
        if (equipmentListEl && Array.isArray(sport.equipments)) {
          equipmentListEl.innerHTML = "";
          sport.equipments.forEach((equipment) => {
            if (equipment && typeof equipment === "string") {
              const li = document.createElement("li");
              li.textContent = equipment.trim();
              equipmentListEl.appendChild(li);
            }
          });
        }

        // Update Me box transform
        const meBoxEl = meBox.value || document.getElementById("me-box");
        if (meBoxEl) {
          meBoxEl.style.transform = `translate(${meBoxTransform.value.x}px, ${meBoxTransform.value.y}px)`;
        }
      });
    }

    return {
      selectedSport,
      meBoxTransform,
      sportContainer,
      meBox,
      currentSport,
      handleSportSelection
    };
  }
}).mount('body');
