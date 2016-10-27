export const clamp = (x: number, low: number, high: number): number => {
    return ((x > high) ? high : ((x < low) ? low : x));
};

export class Color {
    r: number;
    g: number;
    b: number;
}

export interface ColorGeneratorConfig {
    seed?: number;
    count?: number;
}

export class ColorGenerator {
    private options: ColorGeneratorConfig;
    colorDictionary: {[key: string]: any} = {};

    constructor(options: ColorGeneratorConfig) {
        this.options.seed = !options.seed ? 0 : Math.round(options.seed);
        // this.options .
        this.loadColorBounds();
    }

    defineColor(name: string, hueRange: Array<number> | null, lowerBounds: Array<Array<number>>) {
        let sMin = lowerBounds[0][0];
        let sMax = lowerBounds[lowerBounds.length - 1][0];

        let bMin = lowerBounds[lowerBounds.length - 1][1];
        let bMax = lowerBounds[0][1];

        this.colorDictionary[name] = {
            hueRange: hueRange,
            lowerBounds: lowerBounds,
            saturationRange: [sMin, sMax],
            brightnessRange: [bMin, bMax]
        };
    }

    loadColorBounds() {
        this.defineColor(
            'monochrome',
            null,
            [[0, 0], [100, 0]]
        );

        this.defineColor(
            'red',
            [-26, 18],
            [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]
        );

        this.defineColor(
            'orange',
            [19, 46],
            [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]
        );

        this.defineColor(
            'yellow',
            [47, 62],
            [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]
        );

        this.defineColor(
            'green',
            [63, 178],
            [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]
        );

        this.defineColor(
            'blue',
            [179, 257],
            [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]
        );

        this.defineColor(
            'purple',
            [258, 282],
            [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]
        );

        this.defineColor(
            'pink',
            [283, 334],
            [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]
        );

    }
}
