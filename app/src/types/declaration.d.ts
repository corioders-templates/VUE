// =========================================================================
// webpack env variables
declare const __IS_PRODUCTION__: boolean;

// =========================================================================
// module declarations, so typescript will allow import them
declare module '*.vue' {
	import { Component } from 'vue';
	const component: Component;
	export default component;
}

// declare assets modules
declare module '*.svg';
declare module '*.png';
declare module '*.scss';

// // =========================================================================
// // types for compatibility with assemblyscript
// declare type i8 = number;
// declare type i16 = number;
// declare type i32 = number;
// declare type i64 = number;
// declare type isize = number;
// declare type u8 = number;
// declare type u16 = number;
// declare type u32 = number;
// declare type u64 = number;
// declare type usize = number;
// declare type bool = boolean | number;
// declare type f32 = number;
// declare type f64 = number;
// declare type v128 = object;
// declare type funcref = object | null;
// declare type externref = object | null;
// declare type exnref = object | null;
// declare type anyref = object | null;
