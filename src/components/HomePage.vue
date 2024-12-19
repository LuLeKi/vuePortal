<template>
  <div class="homepage">
    <!-- Informatik Section -->
    <section class="section" id="informatik">
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
        <img src="@/assets/images/Informatik.jpg" alt="Informatik Bild" />
      </a>
      <section v-show="showSections.informatik">
        <p>Informatiker übertragen Vorgänge der realen Welt auf Computersysteme,</p>
        <p>indem sie komplexe Aufgabenstellungen in geeignete Modelle überführen und diese auf Softwaresystemen abbilden.</p>
        <p>Dabei entwickeln sie innovative Lösungen, um Prozesse zu optimieren und Technologien effizient einzusetzen.</p>
        <p>Ihre Arbeit umfasst die Analyse, Konzeption und Umsetzung von IT-Systemen, die in nahezu allen Branchen Anwendung finden.</p>
        <p>Informatiker gestalten so die digitale Transformation und treiben Innovationen in Wirtschaft und Gesellschaft voran.</p>
      </section>
    </section>

    <!-- Elektrotechnik Section -->
    <section class="section" id="elektrotechnik">
      <h2 @click="toggleContent('elektrotechnik')">
        Elektrotechnik
        <img src="@/assets/icons/click-icon.png" alt="Click Icon" class="click-icon" />
      </h2>
      <a
        v-show="showSections.elektrotechnik"
        href="https://www.dhbw-stuttgart.de/studium/bachelor-studienangebot/technik/elektrotechnik-und-informationstechnik/"
        target="_blank"
        rel="noopener"
      >
        <img src="@/assets/images/Elektrotechnik.jpg" alt="Elektrotechnik Bild" />
      </a>
      <section v-show="showSections.elektrotechnik">
        <p>Die Elektrotechnik bewegt und verändert die Welt: Smartphones, Assistenzsysteme, Smart Home oder Medizintechnik sind aus unserem Leben nicht mehr wegzudenken.</p>
        <p>Sie bildet die Grundlage für nahezu alle modernen Technologien und ermöglicht Fortschritte in der Kommunikation, Energieversorgung und Automatisierung.</p>
        <p>Elektrotechniker entwickeln innovative Lösungen, um Prozesse effizienter zu gestalten und neue Anwendungen zu erschließen.</p>
        <p>Ihre Arbeit treibt die Digitalisierung, Nachhaltigkeit und den technologischen Fortschritt in vielen Lebensbereichen entscheidend voran.</p>
      </section>
    </section>

    <!-- Maschinenbau Section -->
    <section class="section" id="maschinenbau">
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
      <section v-show="showSections.maschinenbau">
        <p>Der Maschinenbau mit seinen zahlreichen Ausprägungen verknüpft Theorie und Praxis, Naturwissenschaft und Technik.</p>
        <p>Als eine der vielseitigsten Ingenieurdisziplinen schafft er die Grundlage für die Entwicklung innovativer Produkte und Systeme.</p>
        <p>Von der Konstruktion moderner Fahrzeuge bis hin zur Robotik und Produktionstechnik prägt der Maschinenbau nahezu alle Industriebereiche.</p>
        <p>Er verbindet Kreativität mit präzisem technischen Wissen und trägt entscheidend zur Lösung globaler Herausforderungen</p>
        <p>wie Nachhaltigkeit und technologischer Innovation bei.</p>
      </section>
    </section>

    <!-- Google Maps Section -->
    <section class="section" id="maps">
      <h2 @click="toggleContent('maps')">
        Standort
        <img src="@/assets/icons/click-icon.png" alt="Click Icon" class="click-icon" />
      </h2>
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
      // Tracks the visibility state of each section
      showSections: {
        informatik: false,
        elektrotechnik: false,
        maschinenbau: false,
        maps: false,
      },
    };
  },
  methods: {
    // Toggles visibility of a section
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

/* Adjustments for mobile view */
@media (max-width: 768px) {
  .section p {
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: left;
    margin: 1rem auto;
    max-width: 90%;
  }
}
</style>
