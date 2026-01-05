/// <reference types="vite/client" />
import * as _THREE from 'three';

declare global {
  const THREE: typeof _THREE;

  namespace THREE {
    export type BufferAttribute = _THREE.BufferAttribute;
    export type AmbientLight = _THREE.AmbientLight;
    export type DirectionalLight = _THREE.DirectionalLight;
    export type Frustum = _THREE.Frustum;
    export type ShaderMaterial = _THREE.ShaderMaterial;
    export type IUniform = _THREE.IUniform;
    export type InstancedBufferAttribute = _THREE.InstancedBufferAttribute;
    export type InterleavedBuffer = _THREE.InterleavedBuffer;
    export type Object3D = _THREE.Object3D;
    export type MeshBasicMaterial = _THREE.MeshBasicMaterial;
    export type Sphere = _THREE.Sphere;
    export type BoxGeometry = _THREE.BoxGeometry;
    export type Camera = _THREE.Camera; 
    export type Scene = _THREE.Scene;
    export type Color = _THREE.Color;
    export type Clock = _THREE.Clock;
    export type InstancedMesh = _THREE.InstancedMesh;
    export type PerspectiveCamera = _THREE.PerspectiveCamera;
    export type OrthographicCamera = _THREE.OrthographicCamera;
    export type BufferGeometry = _THREE.BufferGeometry;
    export type Material = _THREE.Material;
    export type Mesh = _THREE.Mesh;
    export type Texture = _THREE.Texture;
    export type Vector2 = _THREE.Vector2;
    export type Vector3 = _THREE.Vector3;
    export type Quaternion = _THREE.Quaternion;
    export type Euler = _THREE.Euler;
    export type Matrix4 = _THREE.Matrix4;
    export type WebGLRenderer = _THREE.WebGLRenderer;
  }
}

export {};