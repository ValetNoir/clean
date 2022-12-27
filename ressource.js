class RessourceManager {
  ressources;

  constructor(ressources) {
    this.ressources = {};
    Object.keys(ressources).forEach((key) => {
      this.ressources[key] = new Ressource(ressources[key]);
    });
  }

  hasLoaded() {
    let final = true;
    Object.keys(this.ressources).forEach((key) => {
      if(!this.ressources[key].hasLoaded) final = false;
    });
    return final;
  }
}

class Ressource {
  value; hasLoaded;

  constructor(filepath) {
    this.hasLoaded = false;

    fetch(filepath)
    .then(response => response.text())
    .then(text => {
      this.value = text;
      this.hasLoaded = true;
    });
  }
}