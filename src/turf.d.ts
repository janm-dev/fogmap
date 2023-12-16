declare module "@turf/turf" {
	export function point(coordinates: [number, number]): any;
	export function mask(point: any, mask?: any): any;
	export function buffer(
		point: any,
		radius: number,
		options: { units?: "kilometers" | "miles" | "degrees"; steps?: number }
	): any;
	export function union(polygon1: any, polygon2: any, options?: {}): any;
}
