// Plant management functions
let socket = new WebSocket("ws://"+window.location.host+"/notifications");
let id = null;

async function createPlant() {

  const city = document.querySelector('#city').value;

  disableCreationButton();

  const query = `mutation($eoloPlant: EoloPlantInput) {
    createEoloPlant(eoloPlant: $eoloPlant) {
      id
      city
      planning
    }
  }`;

  const response = await graphql(query, { eoloPlant: { city }});

  const plant = response.data.createEoloPlant;

  console.log("id creacion " + plant.id);

  socket.send(JSON.stringify({
    request: 'SUBSCRIBE',
    id: plant.id,
    message: ""
  }));

  // console.log(JSON.stringify(plant));

  // createPlantView(plant);
  //
  // enableCreationButton();

}

async function getAllPlants() {

  const query = `query {
    eoloPlants {
      id
      city
      planning
    }
  }`;

  const response = await graphql(query);

  const plants = response.data.eoloPlants;
  
  plants.map(createPlantView);
}

function deletePlant(id) {

  const query = `mutation($id: ID!) {
    deleteEoloPlant(id: $id) {
      id
      city
      planning
    }
  }`;

  graphql(query, { id });

  deletePlantView(id);
}

async function graphql(request, variables) {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query: request, variables })
  });

  return await response.json();
}

// Plant View functions

function disableCreationButton() {
  document.querySelector('#generate').style.display = 'none';
  document.querySelector('#creationSpinner').style.display = 'block';
}

function enableCreationButton() {
  document.querySelector('#generate').style.display = 'block';
  document.querySelector('#creationSpinner').style.display = 'none';
}

function createPlantView(plant) {

  const htmlContent = `<div id="plant-${plant.id}" class="col"></div>`;
  const current = document.querySelector('#plants').innerHTML;
  document.querySelector('#plants').innerHTML = htmlContent + current;
  document.querySelector('#plants-title').style.display = 'block';
  document.getElementById('progress').innerHTML = "Progress 0%";
  document.getElementById('progress_bar').value = 0;
  createOrUpdatePlanView(plant);
}

function deletePlantView(id) {

  const elem = document.querySelector('#plant-' + id);
  elem.parentNode.removeChild(elem);

  if (document.querySelector('#plants').childElementCount === 0) {
    document.querySelector('#plants-title').style.display = 'none';
  }
}

function createOrUpdatePlanView(plant) {

  const plantElement = document.querySelector('#plant-' + plant.id);
  if (!plantElement) {
    createPlantView(plant);
  } else {

    const htmlContent = `
    <div class="card mb-4 shadow-sm">
      <div class="card-header">
        <h4 class="my-0 fw-normal">${plant.city}</h4>
      </div>
      <div class="card-body px-2">
        <ul class="list-unstyled mt-3 mb-4">
          <li class="weather">Planning: ${plant.planning}</li>
        </ul>
        <div class="d-flex align-items-center">
          <button type="button" onClick="deletePlant(${plant.id})" class="btn btn-danger btn-sm d-none><i class="fas fa-trash-alt"></i>Delete</button>
        </div>
      </div>
    </div>
  `;

    document.querySelector('#plant-' + plant.id).innerHTML = htmlContent;
  }
}

// -------------

getAllPlants();


socket.onopen = e => {
  console.log("WebSocket connection established");
};

socket.onmessage = event => {
  console.log(`[message] Data received from server: ${event.data}`);
  var div = document.getElementById('progress');
  var progress_bar = document.getElementById('progress_bar');
  var object = JSON.parse(event.data);
  div.innerHTML = "Progress " + object.progress + "%";
  progress_bar.value = object.progress
  if (object.completed == true) {
    createPlantView(object);
    enableCreationButton();
    // createOrUpdatePlanView(object);
  }
};

socket.onclose = event => {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    console.log('[close] Connection died');
  }
};

socket.onerror = error => {
  console.log(`[error] ${error.message}`);
};


