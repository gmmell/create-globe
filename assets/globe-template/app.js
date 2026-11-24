import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {skyAt, xyz, DEG} from './astronomy.js';
const host = document.querySelector('#globe');
const status = document.querySelector('#status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
try {
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
host.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030407);
const camera = new THREE.PerspectiveCamera(44,1,.01,2000);
const controls = new OrbitControls(camera,renderer.domElement);
controls.enablePan=false;
controls.enableDamping=!reduced;
controls.minDistance=1.15;
controls.maxDistance=12;
controls.rotateSpeed=.55;
controls.zoomSpeed=.8;
controls.touches.TWO=THREE.TOUCH.DOLLY_ROTATE;
function reset(){camera.position.set(...xyz(20,100,3.4));controls.target.set(0,0,0);controls.update();}
reset();
function resize(){const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(host);
resize();
const loader = new THREE.TextureLoader();
const textures = await Promise.all(['earth-day.jpg','earth-night.jpg','clouds.jpg','stars.jpg'].map(async name=>{
 const texture=await loader.loadAsync('./assets/'+name);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 return texture;
}));
const [day,night,cloudMap,stars]=textures;
const sun=new THREE.Vector3();
const uniforms={day:{value:day},night:{value:night},cloudMap:{value:cloudMap},sun:{value:sun},lighting:{value:1},nightDarkness:{value:.3},cities:{value:1},clouds:{value:1}};
const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vec4 world=modelMatrix*vec4(position,1.);vPosition=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
const earth=new THREE.Mesh(new THREE.SphereGeometry(1,512,256),new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:`
 uniform sampler2D day,night,cloudMap;uniform vec3 sun;uniform float lighting,cities,clouds,nightDarkness;varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;
 void main(){vec3 n=normalize(vNormal);float nd=dot(n,sun);float lit=smoothstep(-.10,.16,nd);float diffuse=.11+.89*max(nd,0.);vec3 land=texture2D(day,vUv).rgb;float cloud=texture2D(cloudMap,vUv).r*clouds;vec3 surface=mix(land,vec3(.92),cloud*.87);vec3 daylight=surface*mix(1.,diffuse,lighting);vec3 nights=texture2D(night,vUv).rgb*1.7*cities*(1.-lit)*lighting*(1.-cloud*.8);vec3 viewDir=normalize(cameraPosition-vPosition);float rim=pow(1.-max(dot(n,viewDir),0.),3.);vec3 atmosphere=vec3(.08,.31,.68)*rim*(.10+.55*lit);float nightDim=mix(1.,mix(1.-nightDarkness,1.,lit),lighting);gl_FragColor=vec4((daylight+atmosphere)*nightDim+nights,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`}));scene.add(earth);
const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(1.025,96,48),new THREE.ShaderMaterial({uniforms:{sun:{value:sun}},vertexShader:vertex,fragmentShader:`uniform vec3 sun;varying vec3 vNormal;varying vec3 vPosition;void main(){vec3 n=normalize(vNormal);vec3 v=normalize(cameraPosition-vPosition);float rim=pow(max(0.,1.-abs(dot(n,v))),4.);float lit=smoothstep(-.3,.5,dot(n,sun));gl_FragColor=vec4(vec3(.16,.44,.85),rim*(.12+.55*lit));}`,side:THREE.BackSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(atmosphere);

const sky = new THREE.Group();scene.add(sky);
const starSphere=new THREE.Mesh(new THREE.SphereGeometry(1000,64,32),new THREE.ShaderMaterial({uniforms:{map:{value:stars}},vertexShader:`varying vec3 v;void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D map;varying vec3 v;void main(){vec3 d=normalize(v);float ra=atan(-d.z,d.x);vec2 uv=vec2(.5-ra/6.28318530718,.5+asin(d.y)/3.14159265359);vec3 col=texture2D(map,uv).rgb;gl_FragColor=vec4(col*.14,1.);
#include <colorspace_fragment>
}`,side:THREE.BackSide,depthWrite:false}));sky.add(starSphere);


function zoom(factor){camera.position.setLength(THREE.MathUtils.clamp(camera.position.length()*factor,controls.minDistance,controls.maxDistance));controls.update();}
document.querySelector('#zoom-in').onclick=()=>zoom(.85);
document.querySelector('#zoom-out').onclick=()=>zoom(1.15);
document.querySelector('#reset').onclick=reset;
host.addEventListener('keydown',event=>{
 if(event.key==='+' || event.key==='=') zoom(.85);
 else if(event.key==='-') zoom(1.15);
 else if(event.key==='Home') reset();
 else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
  const p=new THREE.Spherical().setFromVector3(camera.position);
  if(event.key==='ArrowLeft')p.theta-=.08;
  if(event.key==='ArrowRight')p.theta+=.08;
  if(event.key==='ArrowUp')p.phi-=.08;
  if(event.key==='ArrowDown')p.phi+=.08;
  p.makeSafe();camera.position.setFromSpherical(p);controls.update();
 } else return;
 event.preventDefault();
});
status.textContent='Drag to rotate · Scroll or pinch to zoom';
let last=-Infinity;
renderer.setAnimationLoop(time=>{
 if(time-last>1000){const state=skyAt(new Date());sun.set(...xyz(state.dec,state.lon));sky.rotation.y=-state.gmst*DEG;last=time;}
 controls.update();renderer.render(scene,camera);
});
renderer.domElement.addEventListener('webglcontextlost',event=>{
 event.preventDefault();renderer.setAnimationLoop(null);status.textContent='The globe stopped rendering. Reload to try again.';
});
} catch(error) {
 status.textContent='The globe could not load. Use a WebGL 2 browser and check that the image files are available.';
 console.error(error);
}
