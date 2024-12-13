<template>
  <div class="homepage">
    <!-- Informatik Section -->
    <section
      class="section"
      id="informatik"
    >
      <h2 @click="toggleContent('informatik')">
        Informatik
        <img src="@/assets/icons/click-icon.png" alt="Click Icon" class="click-icon" />
      </h2>
      <a
    v-show="showSections.informatik"
    href="https://www.dhbw-stuttgart.de/studium/bachelor-studienangebot/technik/informatik/"
    target="_blank"
    rel="noopener"
    >
      <!-- Image and description that toggle on click -->
      <img src="@/assets/images/Informatik.jpg" alt="Informatik Bild" />
    </a>
      <p v-show="showSections.informatik">
        Informatiker übertragen Vorgänge der realen Welt auf Computersysteme,
        indem sie komplexe Aufgabenstellungen in geeignete Modelle überführen und diese auf Softwaresystemen abbilden. <br>
        Dabei entwickeln sie innovative Lösungen, um Prozesse zu optimieren und Technologien effizient einzusetzen.<br>
        Ihre Arbeit umfasst die Analyse, Konzeption und Umsetzung von IT-Systemen, die in nahezu allen Branchen Anwendung finden.<br>
        Informatiker gestalten so die digitale Transformation und treiben Innovationen in Wirtschaft und Gesellschaft voran.<br>
      </p>
    </section>

    <!-- Elektrotechnik Section -->
    <section
      class="section"
      id="elektrotechnik"
    >
      <h2 @click="toggleContent('elektrotechnik')">
        Elektrotechnik
        <img src="@/assets/icons/click-icon.png" alt="Click Icon" class="click-icon" />
      </h2>
      <!-- Image and description that toggle on click -->
      <a
    v-show="showSections.elektrotechnik"
    href="https://www.dhbw-stuttgart.de/studium/bachelor-studienangebot/technik/elektrotechnik-und-informationstechnik/"
    target="_blank"
    rel="noopener"
    >
 
    <img src="@/assets/images/Elektrotechnik.jpg" alt="Elektrotechnik Bild" />
     </a>
      <p v-show="showSections.elektrotechnik">
        Die Elektrotechnik bewegt und verändert die Welt: Smartphones, Assistenzsysteme, Smart Home oder Medizintechnik sind aus unserem Leben nicht mehr wegzudenken.<br>
        Sie bildet die Grundlage für nahezu alle modernen Technologien und ermöglicht Fortschritte in der Kommunikation, Energieversorgung und Automatisierung.<br>
        Elektrotechniker entwickeln innovative Lösungen, um Prozesse effizienter zu gestalten und neue Anwendungen zu erschließen.<br>
        Ihre Arbeit treibt die Digitalisierung, Nachhaltigkeit und den technologischen Fortschritt in vielen Lebensbereichen entscheidend voran.<br>
      </p>
    </section>

    <!-- Maschinenbau Section -->
    <section
      class="section"
      id="maschinenbau"
    >
      <h2 @click="toggleContent('maschinenbau')">
        Maschinenbau
        <img src="@/assets/icons/click-icon.png" alt="Click Icon" class="click-icon" />
      </h2>
      <a
    v-show="showSections.maschinenbau"
    href="https://www.dhbw-stuttgart.de/studium/bachelor-studienangebot/technik/maschinenbau/"
    target="_blank"
    rel="noopener"
  >
    <img src="@/assets/images/maschinenbau.jpg" alt="Maschinenbau Bild" />
  </a>
      <p v-show="showSections.maschinenbau">
        Der Maschinenbau mit seinen zahlreichen Ausprägungen verknüpft Theorie und Praxis, Naturwissenschaft und Technik.<br>
        Als eine der vielseitigsten Ingenieurdisziplinen schafft er die Grundlage für die Entwicklung innovativer Produkte und Systeme. <br>
        Von der Konstruktion moderner Fahrzeuge bis hin zur Robotik und Produktionstechnik prägt der Maschinenbau nahezu alle Industriebereiche.<br>
        Er verbindet Kreativität mit präzisem technischen Wissen und trägt entscheidend zur Lösung globaler Herausforderungen <br>
        wie Nachhaltigkeit und technologischer Innovation bei.
      </p>
    </section>

<!-- Google Maps Section -->
<section
  class="section"
  id="maps"
>
  <h2 @click="toggleContent('maps')">
    Standort
    <img src="@/assets/icons/click-icon.png" alt="Click Icon" class="click-icon" />
  </h2>
  
  <!-- Embedded Google Maps iframe -->
  <iframe
  v-show="showSections.maps"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5257.899057585005!2d9.166687399999999!3d48.7828538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4799db3bf852fbad%3A0x5ea836885f84d66!2sDHBW%20Stuttgart%20-%20Fakult%C3%A4t%20Technik!5e0!3m2!1sde!2sde!4v1734028869599!5m2!1sde!2sde"
  class="map-container"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
</section>


  </div>
</template>


<script>
export default {
  name: "HomePage",
  data() {
    return {
      // Keeps track of which sections are currently open
      showSections: {
        informatik: false,
        elektrotechnik: false,
        maschinenbau: false,
        maps: false,
      },
    };
  },
  methods: {
    // Toggles the visibility of a specific section
    toggleContent(section) {
      this.showSections[section] = !this.showSections[section];
    },
  },
};
</script>

<style scoped>
.homepage {
    font-family: inherit;
}


</style>

