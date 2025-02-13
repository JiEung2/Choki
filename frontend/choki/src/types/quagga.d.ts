// quagga.d.ts
declare module 'quagga' {
	export interface QuaggaConfig {
		inputStream: {
			type?: string;
			constraints?: any;
			area?: any;
			size?: number;
		};
		decoder: {
			readers: string[];
		};
		locate?: boolean;
		src?: string;
		numOfWorkers?: number;
	}

	export interface QuaggaResult {
		codeResult: {
			code: string;
		};
	}

	export function init(
		config: QuaggaConfig,
		callback: (err: any) => void,
	): void;
	export function start(): void;
	export function stop(): void;
	export function onDetected(callback: (result: QuaggaResult) => void): void;
	export function decodeSingle(
		config: QuaggaConfig,
		callback: (result: QuaggaResult | null) => void,
	): void;
}
