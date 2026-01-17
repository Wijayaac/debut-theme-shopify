// Get DOM elements
const sportRadios = document.querySelectorAll('input[name="sport"]');
const sportContainer = document.getElementById("sport-container");
const meBox = document.getElementById("me-box");
const selectedSportText = document.getElementById("selected-sport");
const equipmentList = document.getElementById("equipment-list");
const sportBoxes = document.querySelectorAll(".sport-box");

// Helper function to normalize and find sport (case-insensitive)
function findSportByName(sportName) {
  if (!sportName || typeof sportName !== "string") {
    return null;
  }

  // Normalize input: trim whitespace and convert to lowercase
  const normalizedInput = sportName.trim().toLowerCase();

  // Find sport with case-insensitive comparison
  return sports.find((sport) => sport.name && sport.name.toLowerCase() === normalizedInput) || null;
}

// Validate sport data structure
function validateSportData(sport) {
  if (!sport) return false;
  if (!sport.name || typeof sport.name !== "string") return false;
  if (!sport.bg_color || typeof sport.bg_color !== "string") return false;
  if (!Array.isArray(sport.equipments)) return false;
  return true;
}

// Initialize the page with default selection (Football)
function initializePage() {
  const defaultSport = findSportByName("Football");
  if (defaultSport && validateSportData(defaultSport)) {
    updateBackgroundColor(defaultSport.bg_color);
    updateSportName(defaultSport.name);
    updateEquipmentList(defaultSport.equipments);
    // Position Me box at Football initially
    animateMeBox(defaultSport.name);
  } else {
    console.error("Failed to initialize: Football sport not found or invalid");
  }
}

// Update background color of container
function updateBackgroundColor(color) {
  if (!color || typeof color !== "string") {
    console.warn("Invalid color provided:", color);
    return;
  }
  if (sportContainer) {
    sportContainer.style.backgroundColor = color;
  }
}

// Update selected sport name display
function updateSportName(name) {
  if (!name || typeof name !== "string") {
    console.warn("Invalid sport name provided:", name);
    return;
  }
  if (selectedSportText) {
    selectedSportText.textContent = `Select Sport: ${name}`;
  }
}

// Update equipment list
function updateEquipmentList(equipments) {
  if (!Array.isArray(equipments)) {
    console.warn("Invalid equipments array provided:", equipments);
    return;
  }
  if (!equipmentList) {
    console.error("Equipment list element not found");
    return;
  }

  equipmentList.innerHTML = "";
  equipments.forEach((equipment) => {
    if (equipment && typeof equipment === "string") {
      const li = document.createElement("li");
      li.textContent = equipment.trim();
      equipmentList.appendChild(li);
    }
  });
}

// Animate Me box to selected sport position
function animateMeBox(sportName) {
  // Validate input
  if (!sportName || typeof sportName !== "string") {
    console.warn("Invalid sport name provided to animateMeBox:", sportName);
    return;
  }

  if (!meBox || !sportContainer) {
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
  const containerRect = sportContainer.getBoundingClientRect();
  const targetRect = targetBox.getBoundingClientRect();

  // Calculate the position relative to the container
  const x = targetRect.left - containerRect.left;
  const y = targetRect.top - containerRect.top;

  // Validate calculated positions
  if (isNaN(x) || isNaN(y)) {
    console.error("Invalid position calculated for animation");
    return;
  }

  // Use transform to position the Me box (this works with CSS transition)
  meBox.style.transform = `translate(${x}px, ${y}px)`;
}

// Handle sport selection
function handleSportSelection(event) {
  // Validate event and target
  if (!event || !event.target) {
    console.error("Invalid event object provided");
    return;
  }

  const selectedSportName = event.target.value;

  // Validate input
  if (!selectedSportName || typeof selectedSportName !== "string") {
    console.warn("Invalid sport selection:", selectedSportName);
    return;
  }

  // Find sport using case-insensitive comparison
  const selectedSport = findSportByName(selectedSportName);

  if (selectedSport && validateSportData(selectedSport)) {
    updateBackgroundColor(selectedSport.bg_color);
    animateMeBox(selectedSport.name);
    updateSportName(selectedSport.name);
    updateEquipmentList(selectedSport.equipments);
  } else {
    console.warn(`Sport not found or invalid: ${selectedSportName}`);
  }
}

// Add event listeners to radio buttons
if (sportRadios && sportRadios.length > 0) {
  sportRadios.forEach((radio) => {
    if (radio && typeof radio.addEventListener === "function") {
      radio.addEventListener("change", handleSportSelection);
    }
  });
} else {
  console.warn("No sport radio buttons found");
}

// Initialize page when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
