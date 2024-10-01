
import './style.css'

import {TimelineLite,TweenMax,TimelineMax} from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBA_ASTC_10x5_Format, WireframeGeometry } from 'three';
import * as dat from 'dat.gui';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';


gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.refresh()


let loadManager=new THREE.LoadingManager();

let loadAnimation=new TimelineLite();

// let infini=new TimelineMax();

var path = document.querySelector('#path1');
var l = path.getTotalLength();

var path2 = document.querySelector('#path2');
var l2 = path2.getTotalLength();

var pathAnimation=new TimelineMax();
pathAnimation.repeat(-1);

function toggleTimeline(tl) {
      var repeats = Math.floor(tl.totalTime() / tl.duration());
     
      tl.repeat(repeats);
   
  }

loadManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

	// console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    loadAnimation
    .set("body",{overflow:"hidden"} )
    .to("#loaderWrap", 0.5, {opacity: 1, display: 'flex'})
    
    TweenMax.set(path, {strokeDasharray:l})
    pathAnimation.add(TweenMax.fromTo(path, 3, {strokeDashoffset:l}, {strokeDashoffset:0}),'start')

    TweenMax.set(path2, {strokeDasharray:l2})
    pathAnimation.add( TweenMax.fromTo(path2, 3, {strokeDashoffset:l2}, {strokeDashoffset:0}),'start')
  

};

loadManager.onLoad = function ( ) {

	// console.log( 'Loading complete!');
    // loadAnimation.reverse();
    
    toggleTimeline(pathAnimation);
   new TimelineMax().to("#loaderWrap", 0.5, {opacity: 0, display: 'none',delay:2}).set("body",{overflow:"visible"} )

};


loadManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	// console.log( 'Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

loadManager.onError = function ( url ) {

	// console.log( 'There was an error loading ' + url );

};



var navigation = new TimelineLite({paused:true, reversed:true});
navigation
        .set("body",{overflow:"hidden"} )
        .to("#navigationWrap", 0.5, {opacity: 1, display: 'block'})
        .to(".navbar", 0.3, {opacity: 0}, "-=0.1")
        .to(".close", 0.3, {display: "block", opacity: 1}, "-=0.1")
        .from(".menu", 0.5, {opacity: 0, y: 30})
        .from(".social", 0.5, {opacity: 0});

document.querySelectorAll(".navbar, .close").forEach(item => {
  item.addEventListener('click', () =>{
    navigation.reversed() ? navigation.play() : navigation.reverse();
  })})

  










const gui= new dat.GUI();
dat.GUI.toggleHide();


const cursor={
    x:0,
    y:0
}


const sizes={
    width:window.innerWidth/2,
    height:window.innerHeight
};

window.addEventListener("mousemove",(event)=>{

    cursor.x=event.clientX/sizes.width - 0.5;
    cursor.y=-(event.clientY/sizes.height - 0.5);

})


document.querySelectorAll(".circle").forEach((child)=>{
    let x=Math.floor(Math.random() *0.8* window.innerWidth);
    let y=Math.floor(Math.random() * 0.6* window.innerHeight);
    child.style.top=y+"px";
    child.style.left=x+"px";
   
})




const canvas=document.querySelector(".webgl");

const scene= new THREE.Scene();
// gui.
//     add(mesh.position,'y' )
//     .min(-3)
//     .max(3)
//     .step(0.01)
//     .name("Elevation");

// gui
//     .add(mesh,'visible')


// mesh.scale.set(2,0.5,0.5);

// mesh.rotation.y=Math.PI;
// const group= new THREE.Group();

// scene.add(group)

// const cube1=new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1,5,5,5),
//     new THREE.MeshBasicMaterial({color:0xffff00})
// )

// group.add(cube1)

function setTransparencyOff(material){
    material.transparent=false;
    material.needsUpdate=true;
}


const gltfLoader= new GLTFLoader(loadManager);

gltfLoader.load(
    '/models/untitled.gltf',
    (gltf)=>{
            gltf.scene.scale.set(3,3,3)
            gltf.scene.position.set(0,-2.767,0)
            // gltf.scene.rotation.y=Math.PI * 0.5

        scene.add(gltf.scene)
        
        gui.add(gltf.scene.position,'x').min(-5).max(5).step(0.001).name('positionX')
        gui.add(gltf.scene.position,'y').min(-5).max(5).step(0.001).name('positionY')
        gui.add(gltf.scene.position,'z').min(-5).max(20).step(0.001).name('positionZ')
        
        // camera.lookAt((-5,8,5))
        
        gsap.to(gltf.scene.rotation,10,{y:2  *Math.PI, repeat:-1, ease:"linear"})
        // gsap.to(gltf.scene.position,{scrollTrigger:{trigger:".second",scrub:true,start:'top bottom',end:'top center'},z:-150})
        
        gsap.to(gltf.scene.position,3,{y:-2 , repeat:-1, yoyo:true, ease:"power.easeInOut"})
        gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
        
        gltf.scene.traverse((object) => {
            if (object.isMesh){ object.material.transparent = true;
                
            gsap.to( object.material,{scrollTrigger:{trigger:".second",scrub:true,start:'top bottom-=300',end:'top center'},opacity:0})
            
                //  object.material.depthWrite = false
            
			// object.material.emissive = true;
			// object.material.emissiveIntensity = 3000.0;
        }
        if(object.name=="fuse"){
            object.children.forEach((child) => {
                child.material.transparent = true;
                child.material.alphaTest=0.05
                gsap.to( child.material,{scrollTrigger:{trigger:".second",scrub:true,start:'top bottom-=300',end:'top center'},opacity:0})
            
                // child.material.depthWrite = false
            
                 child.material.emissive = "#FFFFFF";
                 child.material.emissiveIntensity = 0.1;
                 child.material.needsUpdate = true;
            
         gui.add(child.material,'emissiveIntensity').min(0.1).max(1000000000000).step(1000).name('emissive')
        })}  
    
    
    });
        // updateMaterials()
    },
    ( xhr ) =>{

		// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
    (error)=>{
        console.log(error)
    }
)


const textureLoader = new THREE.TextureLoader(loadManager);
var bluePrintTexture=textureLoader.load(
        '/textures/image.jpg',

)

const planeGeometery=new THREE.PlaneBufferGeometry(10,10,100,100)
const bluePrintMaterial= new THREE.MeshStandardMaterial({map:bluePrintTexture,transparent:true,opacity:0,alphaTest:0.05})
bluePrintMaterial.transparent = true;
bluePrintMaterial.alphaTest=0.05;
const bluePrint=new THREE.Mesh(planeGeometery, bluePrintMaterial)

bluePrintMaterial.opacity=0;
bluePrint.rotation.y=-1.227

gui.add(bluePrint.rotation,'y').min(-5).max(5).step(0.001).name('Rotation Y BluePrint')

    
// bluePrint.castShadow=true
bluePrint.receiveShadow=true

scene.add(bluePrint)

function setTransparencyOn(material){
    material.transparent=true;
    material.needsUpdate=true;
}
gsap.to( bluePrintMaterial,{scrollTrigger:{trigger:"#second",scrub:true,start:'top center',end:'top top'},opacity:1})

gsap.to( bluePrintMaterial,{scrollTrigger:{trigger:"#third",scrub:true,start:'top bottom-=300',end:'top center'},opacity:0})

gsap.to(bluePrintMaterial,{scrollTrigger:{trigger:".third",scrub:true,start:'top bottom-=300',end:'top bottom-=300',markers:true},transparent:true,})



var colorTexture=textureLoader.load(
    'textures/12.png'
)

const box=new THREE.BoxBufferGeometry(10,10,10,100,100,100)

const boxMaterial=new THREE.MeshMatcapMaterial({matcap :colorTexture,transparent:true,opacity:0,alphaTest:0.05})
const boxMesh=new THREE.Mesh(box,boxMaterial)


gltfLoader.load(
    '/models/prototype.gltf',
    (gltf)=>{
        gltf.scene.scale.set(35,35,35)
            // gltf.scene.scale.set(0.05,0.05,0.05)
            // gltf.scene.position.set(0,-2.202,0)
        gltf.scene.position.set(3.5,-2.659,0)
            // gltf.scene.rotation.y=Math.PI * 0.5

        scene.add(gltf.scene)
        
        gui.add(gltf.scene.position,'x').min(-5).max(5).step(0.001).name('positionX')
        gui.add(gltf.scene.position,'y').min(-5).max(5).step(0.001).name('positionY')
        gui.add(gltf.scene.position,'z').min(-5).max(20).step(0.001).name('positionZ')
        
        // camera.lookAt((0,7,7))
        
        // gsap.to(gltf.scene.rotation,3,{y:2  *Math.PI, repeat:-1, ease:"linear"})
        // gsap.to(gltf.scene.position,{scrollTrigger:{trigger:".second",scrub:true,start:'top bottom',end:'top center'},z:-150})
        
        // gsap.to(gltf.scene.position,3,{y:-2 , repeat:-1, yoyo:true, ease:"power.easeInOut"})
        // gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
        
        gltf.scene.traverse((object) => {
            if (object.isMesh){ 
                object.material=boxMaterial
            // gsap.to( object.material,{scrollTrigger:{trigger:".fourth",scrub:true,start:'top bottom-=300',end:'top center'},opacity:1})
            
                //  object.material.depthWrite = false
            
			// object.material.emissive = true;
			// object.material.emissiveIntensity = 3000.0;
        }});
        // updateMaterials()
    },
    ( xhr ) =>{

		// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
    (error)=>{
        console.log(error)
    }
)



gsap.to( boxMaterial,{scrollTrigger:{trigger:"#third",scrub:true,start:'top center',end:'top top'},opacity:1})

gsap.to( boxMaterial,{scrollTrigger:{trigger:"#fourth",scrub:true,start:'top bottom-=300',end:'top center'},opacity:0})
gsap.to(boxMaterial,{scrollTrigger:{trigger:"#fourth",scrub:true,start:'top bottom-=300',end:'top center'},transparent:true,})
// gsap.to(boxMaterial,{scrollTrigger:{trigger:"#fourth",scrub:true,start:'top bottom-=300',end:'top bottom-=300',markers:true},transparent:true,onComplete:setTransparencyOn,onCompleteParams:[bluePrintMaterial]})

// scene.add(boxMesh)



gltfLoader.load(
    '/models/Chair.gltf',
    (gltf)=>{
        gltf.scene.scale.set(7,7,7)
            // gltf.scene.scale.set(0.05,0.05,0.05)
            gltf.scene.position.set(0,-2.202,0)
            // gltf.scene.rotation.y=Math.PI * 0.5

        scene.add(gltf.scene)
        
        gui.add(gltf.scene.position,'x').min(-5).max(5).step(0.001).name('positionX')
        gui.add(gltf.scene.position,'y').min(-5).max(5).step(0.001).name('positionY')
        gui.add(gltf.scene.position,'z').min(-5).max(20).step(0.001).name('positionZ')
        
        // camera.lookAt((0,7,7))
        
        // gsap.to(gltf.scene.rotation,3,{y:2  *Math.PI, repeat:-1, ease:"linear"})
        // gsap.to(gltf.scene.position,{scrollTrigger:{trigger:".second",scrub:true,start:'top bottom',end:'top center'},z:-150})
        
        // gsap.to(gltf.scene.position,3,{y:-2 , repeat:-1, yoyo:true, ease:"power.easeInOut"})
        // gui.add(gltf.scene.rotation,'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotation')
        
        gltf.scene.traverse((object) => {
            if (object.isMesh){ 
                object.material.transparent = true;
                object.material.opacity=0
                    
                object.castShadow=true
                object.receiveShadow=true
                object.material.alphaTest=0.05
            gsap.to( object.material,{scrollTrigger:{trigger:"#fourth",scrub:true,start:'top bottom-=300',end:'top center'},opacity:1})
            
                //  object.material.depthWrite = false
            
			// object.material.emissive = true;
			// object.material.emissiveIntensity = 3000.0;
        }});
        // updateMaterials()
    },
    ( xhr ) =>{

		// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
    (error)=>{
        console.log(error)
    }
)


const cubeTextureLoader= new THREE.CubeTextureLoader()



const environmentMap= cubeTextureLoader.load(
    [
        '/0/px.jpg',
        '/0/nx.jpg',
        '/0/py.jpg',
        '/0/ny.jpg',
        '/0/pz.jpg',
        '/0/nz.jpg'


]
)

environmentMap.encoding=THREE.sRGBEncoding



// scene.background=environmentMap;
scene.environment=environmentMap; 




const ambientLight=new THREE.AmbientLight("#ffffff",0.5)
scene.add(ambientLight)

gui.add(ambientLight,'intensity').min(0).max(10).step(0.001).name('Light Intesity')




const directionalLight = new THREE.DirectionalLight(0xffff0ff,2)

directionalLight.position.set(-4.6,5,-3.15)
directionalLight.castShadow=true
directionalLight.shadow.camera.far=15
directionalLight.shadow.mapSize.set(1024,1024)

// const directionalLightCameraHelper= new THREE.CameraHelper(directionalLight.shadow.camera)

// scene.add(directionalLightCameraHelper)


gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('Light Intesity')
gui.add(directionalLight.position,'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position,'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position,'z').min(-5).max(5).step(0.001).name('lightZ')

scene.add(directionalLight)










// const axesHelper = new THREE.AxesHelper(3)

// scene.add(axesHelper)


var gridXZ = new THREE.GridHelper(10, 10,'#81A19E', '#81A19E' );
gridXZ.color=new THREE.Color(0x006600);
gridXZ.position.y=-2.767
scene.add(gridXZ);



window.addEventListener("resize",()=>{
    //update Size
    sizes.width=window.innerWidth;
    sizes.height=window.innerHeight;
    //Update Camera
    camera.aspect=sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    //Update Renderer
    
    renderer.setSize(sizes.width, sizes.height)
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

})


window.addEventListener("dblclick",()=>{
    if(!document.fullscreenElement){
        canvas.requestFullscreen()
    }else{
        document.exitFullscreen();
    }
})



const camera= new THREE.PerspectiveCamera(75,sizes.width/sizes.height);

// const aspectRatio=sizes.width/sizes.height;
// const camera=new THREE.OrthographicCamera(-1*aspectRatio,1*aspectRatio,1,-1,0.01,100)
// camera.position.x=1
// camera.position.z=3


camera.position.z=8.3
camera.position.x=-8


gui.add(camera.position,'x').min(-5).max(5).step(0.001).name('cameraX')
gui.add(camera.position,'y').min(-5).max(5).step(0.001).name('cameraY')
gui.add(camera.position,'z').min(-5).max(20).step(0.001).name('cameraZ')
scene.add(camera);

const controls=new OrbitControls(camera,canvas);

controls.enableDamping=true;
const renderer=new THREE.WebGLRenderer({
    canvas: canvas
    ,alpha:true,antialias: true
})

renderer.setSize(sizes.width, sizes.height);

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.render(scene,camera);
renderer.setClearColor( 0xffffff, 0);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping=THREE.ReinhardToneMapping
renderer.physicallyCorrectLights = true 
// gsap.to(renderer.color,{color:'#ffffff',repeat:3,yoyo:true, duration:1})

// gsap.to(cube1.position,{x:2,duration:2,repeat:3,yoyo:true});
const tick=()=>{
    // camera.position.x=Math.sin(cursor.x * Math.PI * 2 ) * 3;
    // camera.position.z=Math.cos(cursor.x * Math.PI * 2 ) * 3;
    // camera.position.y=cursor.y *4;
    controls.update() ;
    // cube1.rotation.y+=0.02
     renderer.render(scene,camera)
    window.requestAnimationFrame(tick)

};
tick()