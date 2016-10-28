export const HSVtoRGB = (hsv: Array<number>): Array<number> => {
    let h = hsv[0];
    if (h === 0) { h = 1; }
    if (h === 360) { h = 359; }

    h = h / 360;
    let s = hsv[1] / 100,
        v = hsv[2] / 100;

    let h_i = Math.floor(h * 6),
        f = h * 6 - h_i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        r = 256,
        g = 256,
        b = 256;

    switch (h_i) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    let result = [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    return result;
};

export const HSVtoHSL = (hsv: Array<number>): Array<number> => {
    let h = hsv[0],
        s = hsv[1] / 100,
        v = hsv[2] / 100,
        k = (2 - s) * v;
    return [
        h,
        Math.round(s * v / (k < 1 ? k : 2 - k) * 10000) / 100,
        k / 2 * 100
    ];
};

export const HSVtoHex = (hsv: Array<number>): string => {
    let rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        let hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    return '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
};

export const setHSVFormat = (hsv: Array<number>, format: string): Array<number> | string => {
    switch (format) {
        case 'hsvArray':
            return hsv;
        case 'hslArray':
            return HSVtoHSL(hsv);
        case 'hsl':
            let hsl = HSVtoHSL(hsv);
            return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
        case 'hsla':
            let hslColor = HSVtoHSL(hsv);
            return 'hsla(' + hslColor[0] + ', ' + hslColor[1] + '%, ' + hslColor[2] + '%, ' + Math.random() + ')';
        case 'rgbArray':
            return HSVtoRGB(hsv);
        case 'rgb':
            let rgb = HSVtoRGB(hsv);
            return 'rgb(' + rgb.join(', ') + ')';
        case 'rgba':
            let rgbColor = HSVtoRGB(hsv);
            return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';
        default:
            return HSVtoHex(hsv);
    }
};

export interface ColorGeneratorConfig {
    seed?: number;
    format?: string;
    hue?: string;
    luminosity?: string;
}

interface ColorInfo {
    hueRange: Array<number> | null;
    lowerBounds: Array<Array<number>>;
    saturationRange: Array<number>;
    brightnessRange: Array<number>;
}

export class ColorGenerator {
    private options: ColorGeneratorConfig;
    colorDictionary: { [key: string]: ColorInfo } = {};

    constructor(options: ColorGeneratorConfig) {
        this.options.seed = !options.seed ? 0 : Math.round(options.seed);
        this.loadColorBounds();
    }

    get seed(): number {
        return this.options.seed;
    }
    set seed(val: number) {
        this.options.seed = val;
    }

    randomColor(count = 1): Array<number> | Array<Array<number>> | Array<string> | string {
        count = Math.round(Math.abs(count));
        if (count > 1) {
            let colors: Array<Array<number>> = [];
            while (count > 0) {
                this.options.seed++;
                colors.push(this.randomColor() as Array<number>);
                count--;
            }
            return colors;
        }
        let H, S, B;

        H = this.pickHue();
        S = this.pickSaturation(H);
        B = this.pickBrightness(H, S);

        return setHSVFormat([H, S, B], this.options.format);
    }

    private randomWithin(range: Array<number>): number {
        if (this.options.seed === null) {
            return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
        } else {
            // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
            let max = range[1] || 1;
            let min = range[0] || 0;
            this.options.seed = (this.options.seed * 9301 + 49297) % 233280;
            let rnd = this.options.seed / 233280.0;
            return Math.floor(min + rnd * (max - min));
        }
    }

    private pickHue(): number {
        let hueRange = this.getHueRange(this.options.hue);
        let hue = this.randomWithin(hueRange);
        if (hue < 0) {
            hue += 360;
        }
        return hue;
    }

    private pickSaturation(hue): number {
        if (this.options.hue === 'monochrome') {
            return 0;
        }
        if (this.options.luminosity === 'random') {
            return this.randomWithin([0, 100]);
        }

        let saturationRange = this.getSaturationRange(hue);

        let sMin = saturationRange[0],
            sMax = saturationRange[1];

        switch (this.options.luminosity) {
            case 'bright':
                sMin = 55;
                break;
            case 'dark':
                sMin = sMax - 10;
                break;
            case 'light':
                sMax = 55;
                break;
        }

        return this.randomWithin([sMin, sMax]);
    }

    private pickBrightness(hue: number, saturation: number): number {
        let bMin = this.getMinBrightness(hue, saturation),
            bMax = 100;

        switch (this.options.luminosity) {
            case 'dark':
                bMax = bMin + 20;
                break;
            case 'light':
                bMin = (bMax + bMin) / 2;
                break;
            case 'random':
                bMin = 0;
                bMax = 100;
                break;
        }

        return this.randomWithin([bMin, bMax]);
    }

    private getHueRange(val: number | string | null): Array<number> {
        if (!val) {
            return [0, 360];
        }
        if (typeof val === 'number') {
            val = val as number;
            if (val < 360 && val > 0) {
                return [val, val];
            } else {
                return [0, 360];
            }
        }

        if (typeof val === 'string') {
            val = val as string;
            if (this.colorDictionary[val]) {
                let color = this.colorDictionary[val];
                if (color.hueRange) {
                    return color.hueRange;
                }
            }
        }
        return [0, 360];
    }

    private getSaturationRange(hue: number): Array<number> {
        return this.getColorInfo(hue).saturationRange;
    }

    private getColorInfo(hue): ColorInfo {
        if (hue >= 34 && hue <= 360) {
            hue -= 360;
        }

        for (let colorName in this.colorDictionary) {
            if (!this.colorDictionary.hasOwnProperty(colorName)) {
                continue;
            }
            let color = this.colorDictionary[colorName];
            if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
                return color;
            }
        }

        return this.colorDictionary['default'];
    }

    private getMinBrightness(hue: number, saturation: number): number {
        let lowerBounds = this.getColorInfo(hue).lowerBounds;

        for (let i = 0; i < lowerBounds.length - 1; i++) {
            let s1 = lowerBounds[i][0],
                v1 = lowerBounds[i][1];

            let s2 = lowerBounds[i + 1][0],
                v2 = lowerBounds[i + 1][1];

            if (saturation >= s1 && saturation <= s2) {
                let m = s2 - s1 === 0 ? 0 : (v2 - v1) / (s2 - s1),
                    b = v1 - m * s1;
                return m * saturation + b;
            }
        }

        return 0;
    }

    defineColor(name: string, hueRange: Array<number> | null, lowerBounds: Array<Array<number>>) {
        let sMin = lowerBounds[0][0],
            sMax = lowerBounds[lowerBounds.length - 1][0],

            bMin = lowerBounds[lowerBounds.length - 1][1],
            bMax = lowerBounds[0][1];

        this.colorDictionary[name] = {
            hueRange: hueRange,
            lowerBounds: lowerBounds,
            saturationRange: [sMin, sMax],
            brightnessRange: [bMin, bMax]
        };
    }

    loadColorBounds() {
        this.defineColor(
            'default',
            [0, 360],
            [[0, 0], [100, 100]]
        );

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
