import pixelFont from '../config/pixelFont.json';

export interface TextConfig {
    id: string;
    text: string;
    letterSpacing?: number; // 字距（格子數），預設 1
    position: { x: number; y: number }; // 0-1 相對位置
    color: string;
}

export interface GridTextConfig {
    texts: TextConfig[];
}

export interface PixelData {
    gridX: number;
    gridY: number;
    color: number;
}

interface CharDef {
    width: number;
    pixels: string[];
}

interface PixelFontData {
    charHeight: number;
    chars: { [key: string]: CharDef };
}

export class TextToGrid {
    private font: PixelFontData;

    constructor() {
        this.font = pixelFont as PixelFontData;
    }

    /**
     * 將文字轉換成格點座標
     */
    public textToPixels(
        config: TextConfig,
        gridCols: number,
        gridRows: number
    ): PixelData[] {
        const pixels: PixelData[] = [];
        const letterSpacing = config.letterSpacing ?? 1;

        // 解析顏色
        const colorHex = config.color.replace('#', '');
        const r = parseInt(colorHex.substring(0, 2), 16);
        const g = parseInt(colorHex.substring(2, 4), 16);
        const b = parseInt(colorHex.substring(4, 6), 16);
        const outputColor = (r << 16) | (g << 8) | b;

        // 計算總寬度
        let totalWidth = 0;
        const chars = config.text.toUpperCase().split('');
        for (let i = 0; i < chars.length; i++) {
            const charDef = this.font.chars[chars[i]];
            if (charDef) {
                totalWidth += charDef.width;
                if (i < chars.length - 1) {
                    totalWidth += letterSpacing;
                }
            }
        }

        // 計算起始位置（置中）
        const centerGridX = Math.floor(gridCols * config.position.x);
        const centerGridY = Math.floor(gridRows * config.position.y);
        const startGridX = centerGridX - Math.floor(totalWidth / 2);
        const startGridY = centerGridY - Math.floor(this.font.charHeight / 2);

        // 繪製每個字元
        let currentX = startGridX;
        for (const char of chars) {
            const charDef = this.font.chars[char];
            if (!charDef) continue;

            // 繪製字元的每個像素
            for (let y = 0; y < charDef.pixels.length; y++) {
                const row = charDef.pixels[y];
                for (let x = 0; x < row.length; x++) {
                    if (row[x] === '#') {
                        const gridX = currentX + x;
                        const gridY = startGridY + y;
                        if (gridX >= 0 && gridX < gridCols && gridY >= 0 && gridY < gridRows) {
                            pixels.push({ gridX, gridY, color: outputColor });
                        }
                    }
                }
            }

            currentX += charDef.width + letterSpacing;
        }

        return pixels;
    }

    /**
     * 處理整個設定檔的所有文字
     */
    public processConfig(
        config: GridTextConfig,
        gridCols: number,
        gridRows: number
    ): Map<string, PixelData[]> {
        const result = new Map<string, PixelData[]>();

        for (const textConfig of config.texts) {
            const pixels = this.textToPixels(textConfig, gridCols, gridRows);
            result.set(textConfig.id, pixels);
        }

        return result;
    }
}
