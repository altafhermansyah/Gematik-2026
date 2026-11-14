import * as THREE from "three";
import type { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const EARTH_ASSETS = {
  planetGlb: "/globe/planet.glb",
  nightLightsWebp: "/globe/planet-lights.webp",
  cloudsWebp: "/globe/planet-clouds.webp",
  dracoPath: "/draco/",
} as const;

export const EARTH_SURFACE_DEFAULTS = {
  rimColor: "#c1faff",
  rimPower: 2.4,
  nightLights: 10,
  terrainDepth: 0.33,
  terrainShade: 1.3,
  oceanGlint: 0.45,
  oceanDeep: 0.16,
  oceanFlow: 2.6,
  oceanFlowSpeed: 0.8,
  oceanFlowScale: 2.1,
} as const;

export type CloudLayerConfig = {
  height: number;
  opacity: number;
  spin: number;
  initialYaw: number;
};

const SNOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

/** Deterministic PRNG so Strict Mode remounts produce stable star/mote layout. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function disposeMaterial(mat: THREE.Material): void {
  const rec = mat as unknown as Record<string, unknown>;
  for (const key of [
    "map",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "emissiveMap",
    "alphaMap",
    "aoMap",
    "envMap",
  ]) {
    const tex = rec[key];
    if (tex instanceof THREE.Texture) {
      tex.dispose();
    }
  }
  mat.dispose();
}

export function disposeSceneObjects(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach(disposeMaterial);
      } else if (obj.material) {
        disposeMaterial(obj.material);
      }
    }
  });
}

export function createPlaceholderEarthMesh(
  radius: number,
  rimColor: string = EARTH_SURFACE_DEFAULTS.rimColor
): THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> {
  const geo = new THREE.SphereGeometry(radius, 36, 24);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uRim: { value: hexToVec3(rimColor) },
    },
    vertexShader: `
      varying vec3 vNorm;
      varying vec3 vViewPos;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mv.xyz;
        vNorm = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uRim;
      varying vec3 vNorm;
      varying vec3 vViewPos;
      void main(){
        vec3 n = normalize(vNorm);
        vec3 v = normalize(vViewPos);
        float rim = pow(1.0 - max(dot(v, n), 0.0), 2.8) * 0.72;
        float ndl = dot(n, normalize(vec3(-0.9, 0.18, 0.4)));
        float day = smoothstep(-0.1, 0.4, ndl);
        vec3 base = mix(vec3(0.015, 0.035, 0.09), vec3(0.04, 0.14, 0.34), day);
        gl_FragColor = vec4(mix(base, uRim, rim), 1.0);
      }
    `,
  });
  return new THREE.Mesh(geo, mat);
}

export function applyPlanetSurfaceMaterial(
  planetMesh: THREE.Mesh,
  targetRadius: number,
  nightTexUniform: { value: THREE.Texture },
  planetTimeUniform: { value: number },
  options?: {
    rimColor?: string;
    nightMinimumDay?: number;
  }
): { rawRadius: number; mapTexture: THREE.Texture | null } {
  planetMesh.geometry.computeBoundingSphere();
  const rawRadius = planetMesh.geometry.boundingSphere?.radius || 1;
  planetMesh.scale.setScalar(targetRadius / rawRadius);

  const origMat = Array.isArray(planetMesh.material)
    ? planetMesh.material[0]
    : planetMesh.material;
  const clonedMat =
    origMat instanceof THREE.MeshStandardMaterial
      ? origMat.clone()
      : new THREE.MeshStandardMaterial({ color: 0x224466 });

  clonedMat.metalness = 0;
  clonedMat.roughness = 1;
  clonedMat.envMapIntensity = 0;

  if (origMat && origMat !== clonedMat) {
    if (Array.isArray(planetMesh.material)) {
      planetMesh.material.forEach((m) => m.dispose());
    } else {
      origMat.dispose();
    }
  }

  const rimColor = options?.rimColor ?? EARTH_SURFACE_DEFAULTS.rimColor;
  const minNightFloor = options?.nightMinimumDay ?? 0.08;

  clonedMat.onBeforeCompile = (shader) => {
    shader.uniforms.time = planetTimeUniform;
    shader.uniforms.rimColor = { value: hexToVec3(rimColor) };
    shader.uniforms.rimPower = { value: EARTH_SURFACE_DEFAULTS.rimPower };
    shader.uniforms.nightBlendTexture = nightTexUniform;
    shader.uniforms.nightLights = { value: EARTH_SURFACE_DEFAULTS.nightLights };
    shader.uniforms.terrainDepth = { value: EARTH_SURFACE_DEFAULTS.terrainDepth };
    shader.uniforms.terrainShade = { value: EARTH_SURFACE_DEFAULTS.terrainShade };
    shader.uniforms.oceanGlint = { value: EARTH_SURFACE_DEFAULTS.oceanGlint };
    shader.uniforms.oceanDeep = { value: EARTH_SURFACE_DEFAULTS.oceanDeep };
    shader.uniforms.oceanFlow = { value: EARTH_SURFACE_DEFAULTS.oceanFlow };
    shader.uniforms.oceanFlowSpeed = {
      value: EARTH_SURFACE_DEFAULTS.oceanFlowSpeed,
    };
    shader.uniforms.oceanFlowScale = {
      value: EARTH_SURFACE_DEFAULTS.oceanFlowScale,
    };
    shader.uniforms.minNightFloor = { value: minNightFloor };

    shader.vertexShader =
      "varying vec2 vCustomUv;\n" +
      shader.vertexShader.replace(
        "void main() {",
        "void main() {\n  vCustomUv = uv;"
      );

    shader.fragmentShader =
      `
      uniform float time;
      uniform vec3 rimColor;
      uniform float rimPower;
      uniform sampler2D nightBlendTexture;
      uniform float nightLights;
      uniform float terrainDepth;
      uniform float terrainShade;
      uniform float oceanGlint;
      uniform float oceanDeep;
      uniform float oceanFlow;
      uniform float oceanFlowSpeed;
      uniform float oceanFlowScale;
      uniform float minNightFloor;
      varying vec2 vCustomUv;
      ${SNOISE}
      ` +
      shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
        #include <dithering_fragment>
        vec3 normalizedNormal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float rim = 1.0 - max(dot(viewDir, normalizedNormal), 0.0);
        rim = pow(rim, rimPower * 1.5) * 0.7;

        vec3 currentColor = gl_FragColor.rgb;
        float blueDom = currentColor.b - max(currentColor.r, currentColor.g);
        float waterMask = clamp(smoothstep(-0.005, 0.03, blueDom), 0.0, 1.0);

        if (waterMask > 0.01) {
          float fT = time * oceanFlowSpeed * 4.0;
          float fS = 4.0 * oceanFlowScale;
          float warp = snoise(vec3(vCustomUv.x * fS - fT * 0.5, vCustomUv.y * fS + fT * 0.4, fT * 0.5));
          float flow = snoise(vec3(vCustomUv.x * fS * 2.0 + fT * 0.6 + warp, vCustomUv.y * fS * 2.0 - fT * 0.5, fT * 0.7));
          float combined = (warp * 0.6 + flow * 0.4) * oceanFlow * 0.12 + warp * 0.02;
          gl_FragColor.rgb += waterMask * combined;
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.01, 0.06, 0.16), waterMask * oceanDeep);
        }

        gl_FragColor = vec4(mix(gl_FragColor.rgb, rimColor, rim), 1.0);

        vec3 viewSunDir = normalize(vec3(-0.9, 0.18, 0.4));
        float ndl = dot(normalizedNormal, viewSunDir);
        float dayAmt = smoothstep(-0.05, 0.35, ndl);

        if (dayAmt > 0.01) {
          vec3 surfPos = -vViewPosition;
          float terrH = dot(texture2D(map, vCustomUv).rgb, vec3(0.299, 0.587, 0.114));
          vec3 sigX = dFdx(surfPos), sigY = dFdy(surfPos);
          vec3 vR1 = cross(sigY, normalizedNormal), vR2 = cross(normalizedNormal, sigX);
          float fDet = dot(sigX, vR1);
          vec3 vGrad = sign(fDet) * (dFdx(terrH) * vR1 + dFdy(terrH) * vR2);
          vec3 bumpedNormal = normalize(abs(fDet) * normalizedNormal - terrainDepth * vGrad);
          vec3 shadeNormal = mix(bumpedNormal, normalizedNormal, waterMask);
          float relief = dot(shadeNormal, viewSunDir) - ndl;
          gl_FragColor.rgb *= clamp(1.0 + relief * terrainShade * dayAmt, 0.55, 1.6);
        }

        float nightFactor = smoothstep(0.18, -0.30, ndl);
        float lightsFactor = smoothstep(0.30, -0.35, ndl);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * minNightFloor, nightFactor);
        if (lightsFactor > 0.01) {
          vec3 cityLights = texture2D(nightBlendTexture, vCustomUv).rgb * currentColor * nightLights;
          gl_FragColor.rgb += cityLights * lightsFactor;
        }

        if (waterMask > 0.01 && dayAmt > 0.01) {
          vec3 halfDir = normalize(viewSunDir + viewDir);
          float ndh = max(dot(normalizedNormal, halfDir), 0.0);
          float glint = pow(ndh, 110.0);
          gl_FragColor.rgb += glint * waterMask * dayAmt * oceanGlint * vec3(1.0, 0.97, 0.88);
        }
        `
      );
  };

  planetMesh.material = clonedMat;
  return { rawRadius, mapTexture: clonedMat.map ?? null };
}

export function createCloudMeshesFromTexture(
  cloudTex: THREE.Texture,
  planetRadius: number,
  layers: readonly CloudLayerConfig[]
): { mesh: THREE.Mesh; spin: number }[] {
  cloudTex.wrapS = THREE.RepeatWrapping;
  cloudTex.wrapT = THREE.RepeatWrapping;

  const sharedCloudGeo = new THREE.SphereGeometry(1, 40, 28);
  const created: { mesh: THREE.Mesh; spin: number }[] = [];

  for (const layer of layers) {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: cloudTex },
        uOpacity: { value: layer.opacity },
        uOffset: { value: layer.initialYaw * 0.1 },
      },
      vertexShader: `
        varying vec2 vCloudUv;
        varying vec3 vNormalView;
        varying vec3 vViewPos;
        void main(){
          vCloudUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mv.xyz;
          vNormalView = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform float uOpacity;
        uniform float uOffset;
        varying vec2 vCloudUv;
        varying vec3 vNormalView;
        varying vec3 vViewPos;
        void main(){
          vec2 uv = vCloudUv * 5.0 + vec2(uOffset, 0.0);
          float alpha = texture2D(uMap, uv).a;
          if (alpha <= 0.01) discard;
          vec3 n = normalize(vNormalView);
          vec3 v = normalize(vViewPos);
          float edge = 1.0 - pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.35;
          float ndl = dot(n, normalize(vec3(-0.9, 0.18, 0.4)));
          float dayMask = 1.0 - smoothstep(0.30, -0.30, ndl) * 0.9;
          gl_FragColor = vec4(vec3(0.95, 0.98, 1.0), alpha * uOpacity * dayMask * edge);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(sharedCloudGeo, mat);
    mesh.scale.setScalar(planetRadius * layer.height);
    mesh.rotation.y = layer.initialYaw;
    mesh.renderOrder = 2;
    created.push({ mesh, spin: layer.spin });
  }

  return created;
}

export function loadParallelEarthAssets(params: {
  gltfLoader: GLTFLoader;
  texLoader: THREE.TextureLoader;
  planetRadius: number;
  nightTexUniform: { value: THREE.Texture };
  planetTimeUniform: { value: number };
  cloudConfigs: readonly CloudLayerConfig[];
  nightMinimumDay?: number;
  rimColor?: string;
  isDisposed: () => boolean;
  onTextureCreated: (tex: THREE.Texture) => void;
  onPlanetReady: (
    mesh: THREE.Mesh,
    info: { rawRadius: number; mapTexture: THREE.Texture | null }
  ) => void;
  onCloudsReady: (clouds: { mesh: THREE.Mesh; spin: number }[]) => void;
  onUpdatedStaticFrame?: () => void;
}): void {
  const {
    gltfLoader,
    texLoader,
    planetRadius,
    nightTexUniform,
    planetTimeUniform,
    cloudConfigs,
    nightMinimumDay,
    rimColor,
    isDisposed,
    onTextureCreated,
    onPlanetReady,
    onCloudsReady,
    onUpdatedStaticFrame,
  } = params;

  texLoader.load(
    EARTH_ASSETS.nightLightsWebp,
    (nightTex) => {
      if (isDisposed()) {
        nightTex.dispose();
        return;
      }
      nightTex.flipY = false;
      nightTex.encoding = THREE.sRGBEncoding;
      nightTexUniform.value = nightTex;
      onTextureCreated(nightTex);
      onUpdatedStaticFrame?.();
    },
    undefined,
    () => {
      // Night city lights are decorative; keep fallback texture cleanly.
    }
  );

  texLoader.load(
    EARTH_ASSETS.cloudsWebp,
    (cloudTex) => {
      if (isDisposed()) {
        cloudTex.dispose();
        return;
      }
      onTextureCreated(cloudTex);
      const layers = createCloudMeshesFromTexture(
        cloudTex,
        planetRadius,
        cloudConfigs
      );
      onCloudsReady(layers);
      onUpdatedStaticFrame?.();
    },
    undefined,
    () => {
      // Clouds are decorative atmosphere; safe to skip if unavailable.
    }
  );

  void gltfLoader
    .loadAsync(EARTH_ASSETS.planetGlb)
    .then((planetGltf) => {
      if (isDisposed()) {
        disposeSceneObjects(planetGltf.scene);
        return;
      }

      let firstMesh: THREE.Mesh | null = null;
      planetGltf.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && !firstMesh) {
          firstMesh = obj;
        }
      });

      if (firstMesh) {
        const info = applyPlanetSurfaceMaterial(
          firstMesh,
          planetRadius,
          nightTexUniform,
          planetTimeUniform,
          { nightMinimumDay, rimColor }
        );
        onPlanetReady(firstMesh, info);
      }
    })
    .catch(() => {
      // Keep placeholder horizon Earth active gracefully.
    });
}
