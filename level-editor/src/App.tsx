import React, { Fragment, useState } from 'react'
import './App.css';
import World from './components/World';
import ItemDashboard from './components/ItemDashboard';
import LevelWindow from './components/LevelWindow';
import Turret from './components/Turret';
import Door from './components/Door';
import Avatar from './components/Avatar';
// import uuid from 'uuid';

//initial json
let levelInit = {
  world: {
    gravity: -14.7,
    bounds: [32.0,18.0],
    backgroundPres: 'present_background',
    backgroundPast: 'past_background',
    diamondshape: [ 0.2, 1.8, 2.4, 1.8, 1.4, 0.1],
    capsuleshape: [0.2,1.1,2.9,1.1,2.9,0.6,1.7,0.1,0.2,0.6],
    roundshape: [ 0.1, 1.4, 0.5, 1.7, 2.4, 1.7, 2.7, 1.4, 2.6, 0.8, 2.0, 0.2, 0.8, 0.2 ],
    density: 0.0,
    heavy_density: 10.0,
    friction: 0.6,
    restitution: 0.1,
    bullet_offset: 0.7,
    effect_volume: 0.8
  },
  capsules: {
    presentcapsule1: {
      name: "present_capsule",
      pos: [
        3.0,
        7.0
      ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "present_capsule",
      space: 1
    },
    pastcapsule1: {
      name: "past_capsule",
      pos: [
        4.5,
        1.0
      ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "past_capsule",
      space: 2
    }
  },
  diamonds: {
    presentdiamond1: {
      name: "present_diamond",
      pos: [
        1.0,
        2.0
      ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "present_diamond",
      space: 1
    },
    pastdiamond1: {
      name: "past_diamond",
      pos: [
        13.5,
        3.5
      ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "past_diamond",
      space: 2
    },
    pastdiamond2: {
      name: "past_diamond",
      pos: [
        20.0,
        5.0
      ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "past_diamond",
      space: 2
    }
  },
  rounds: {
    presentround1: {
      name: "present_round",
      pos: [11.5, 2.0],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "present_round",
      space: 1
    },
    presentround2: {
      name: "present_round",
      pos: [ 9.5, 13.0 ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "present_round",
      space: 1
    },
    pastround1: {
      name: "past_round",
      pos: [ 2.0, 13.0 ],
      bodytype: "static",
      density: 0.0,
      friction: 0.6,
      restitution: 0.1,
      texture: "past_round",
      space: 2
    },
  },
  enemies: {
    enemy1: {
      pos: [13.0, 6.0],
      shrink: [0.0168, 0.021375],
      texture: "enemypresent",
      entitytype: "present",
      cooldown: 120,
      bodytype: "dynamic",
      density: 1.0
    },
    enemy2: {
      pos: [15.625, 11.03125],
      shrink: [0.0168, 0.021375],
      texture: "enemypast",
      entitytype: "past",
      cooldown: 120,
      bodytype: "dynamic",
      density: 1.0
    }
  },
  avatar: {
    pos: [2.5, 5.0],
    shrink: [0.0216,0.01125],
    texture: 'dude',
    density: 1.0,
    bodytype: 'dynamic',
    avatarstanding: 'avatarstanding',
    avatarcrouching: 'avatarcrouching',
    avatardashing: 'avatardashing',
    avatarfalling: 'avatarfalling'
  },
  door: {
    pos: [29.5, 15.5],
    size: [1.92, 1.92],
    bodytype: 'static',
    density: 0.0,
    friction: 0.0,
    restitution: 0.0,
    texture: 'goal',
    sensor: true,
    nextlevel: 0,
    space: 3
  },
  turrets: {
    turret1: {
      pos: [18.5,10.3],
      shrink: [0.0168, 0.021375],
      texture: "turret",
      entitytype: "present",
      cooldown: 360,
      direction: [-3.0, 0.0],
      bodytype: "static",
      density: 1.0
    },
    turret2: {
      pos: [8.5, 5.0],
      shrink: [0.0168, 0.021375],
      texture: "turret",
      entitytype: "past",
      cooldown: 480,
      direction: [0.0, 2.0],
      bodytype: "static",
      density: 1.0
    }
  }
};

//styling for container holding Level Window and ItemDashboard
const containerStyling = {
  height: '600px',
  minWidth: '1000px',
  // width: '100vw',
  display: 'flex'
}

//styling for this
const appStyling = {
  minHeight: '20px',
  height: '25px',
  width: '100%'
}

//downloads state info as a json called export
function exportToJson(objectData: JSON) {
  let filename = "export.json";
  let contentType = "application/json;charset=utf-8;";
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(objectData)))], { type: contentType });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    var a = document.createElement('a');
    a.download = filename;
    a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(objectData));
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}


const App : React.FC = ({}) => {
  
  const [world, setWorld] = useState(levelInit.world);
  const [avatar, setAvatar] = useState(levelInit.avatar);
  const [door, setDoor] = useState(levelInit.door);
  const [turrets, setTurrets] = useState(levelInit.turrets);
  const [capsules, setCapsules] = useState(levelInit.capsules);
  const [diamonds, setDiamonds] = useState(levelInit.diamonds);
  const [rounds, setRounds] = useState(levelInit.rounds);
  const [enemies, setEnemies] = useState(levelInit.enemies);
  const [gameObjects, setGameObjects] = useState<any>(levelInit); //represents json, init with levelinit
  const [objectPostitions, setOp] = useState(new Object()) // not used yet


  let editorObjects = useState([{id:'world', selected: false}]); //not used yet

  let updateState = (newState:any) => { // updates state
    let {world, platforms, avatar, door, turrets} = newState;
    setWorld(newState.world);
    setAvatar(newState.avatar);
    setDoor(newState.door);
    setTurrets(newState.turrets);
    setGameObjects(newState);
    console.log("App avatar", avatar);
  }
  let selectComponent = (id:string, open:boolean) => { //not used for anything yet
    editorObjects.map(
      (item:any) => {
        if(item.id == id){
          item.selected = true;
        }else{
          item.selected = false;
        }
    })
  }
  //used for debugging and formatting json during download

  // gravity: -14.7,
  // bounds: [32.0,18.0],
  // "present_background": "present_background",
  // "past_background": "past_background",
  // diamondshape: [ 0.2, 1.8, 2.4, 1.8, 1.4, 0.1],
  // capsuleshape: [0.2,1.1,2.9,1.1,2.9,0.6,1.7,0.1,0.2,0.6],
  // roundshape: [ 0.1, 1.4, 0.5, 1.7, 2.4, 1.7, 2.7, 1.4, 2.6, 0.8, 2.0, 0.2, 0.8, 0.2 ],
  // density: 0.0,
  // heavy_density: 10.0,
  // friction: 0.6,
  // restitution: 0.1,
  // bullet_offset: 0.7,
  // effect_volume: 0.8
  let tester = {
    gravity: world.gravity,
    bounds: world.bounds,
    present_background: world.backgroundPres,
    past_background: world.backgroundPast,
    diamondshape: world.diamondshape,
    capsuleshape: world.capsuleshape,
    roundshape: world.roundshape,
    density: world.density,
    heavy_density: world.heavy_density,
    friction: world.friction,
    restitution: world.restitution,
    bullet_offset: world.bullet_offset,
    effect_volume: world.effect_volume,
    door,
    avatar,
    turrets,
    capsules,
    diamonds,
    rounds,
    enemies
  }

  return (
    <div className="App" >
      <header className="App-header" style = {appStyling} >
        <button onClick= {() => exportToJson(JSON.parse(JSON.stringify(tester)))} style = {{height:'20px', fontSize:'7pt'}}>Download</button>
      </header>
      <div style = {containerStyling}>
        <LevelWindow key = {JSON.stringify(gameObjects) + "lw"} backgroundPastPath = {world.backgroundPast} backgroundPresPath = {world.backgroundPres} 
          gameObjectState = {gameObjects} updateState = {updateState}></LevelWindow>
        <ItemDashboard key = {JSON.stringify(gameObjects)} gameObjectsInput={gameObjects} update={updateState} selected={selectComponent}>
          </ItemDashboard>
      </div>
    </div>
  );
}

export default App;
