
/**
 * Perspective transform implementation fixed for ESM environments.
 * Based on perspective-transform by Jenny Louthan.
 */

interface Point {
    x: number;
    y: number;
}

export class PerspectiveTransform {
    private coeffs: number[];
    private coeffsInv: number[];

    constructor(srcPts: number[], dstPts: number[]) {
        this.coeffs = this.getNormalizationCoefficients(srcPts, dstPts, false);
        this.coeffsInv = this.getNormalizationCoefficients(srcPts, dstPts, true);
    }

    private round(num: number): number {
        return Math.round(num * 10000000000) / 10000000000;
    }

    private getNormalizationCoefficients(srcPts: number[], dstPts: number[], isInverse: boolean): number[] {
        if (isInverse) {
            const tmp = dstPts;
            dstPts = srcPts;
            srcPts = tmp;
        }

        const r1 = [srcPts[0], srcPts[1], 1, 0, 0, 0, -1 * dstPts[0] * srcPts[0], -1 * dstPts[0] * srcPts[1]];
        const r2 = [0, 0, 0, srcPts[0], srcPts[1], 1, -1 * dstPts[1] * srcPts[0], -1 * dstPts[1] * srcPts[1]];
        const r3 = [srcPts[2], srcPts[3], 1, 0, 0, 0, -1 * dstPts[2] * srcPts[2], -1 * dstPts[2] * srcPts[3]];
        const r4 = [0, 0, 0, srcPts[2], srcPts[3], 1, -1 * dstPts[3] * srcPts[2], -1 * dstPts[3] * srcPts[3]];
        const r5 = [srcPts[4], srcPts[5], 1, 0, 0, 0, -1 * dstPts[4] * srcPts[4], -1 * dstPts[4] * srcPts[5]];
        const r6 = [0, 0, 0, srcPts[4], srcPts[5], 1, -1 * dstPts[5] * srcPts[4], -1 * dstPts[5] * srcPts[5]];
        const r7 = [srcPts[6], srcPts[7], 1, 0, 0, 0, -1 * dstPts[6] * srcPts[6], -1 * dstPts[6] * srcPts[7]];
        const r8 = [0, 0, 0, srcPts[6], srcPts[7], 1, -1 * dstPts[7] * srcPts[6], -1 * dstPts[7] * srcPts[7]];

        const matA = [r1, r2, r3, r4, r5, r6, r7, r8];
        const matB = dstPts;
        let matC;

        try {
            matC = this.inv(this.dotMMsmall(this.transpose(matA), matA));
        } catch (e) {
            console.error(e);
            return [1, 0, 0, 0, 1, 0, 0, 0];
        }

        const matD = this.dotMMsmall(matC, this.transpose(matA));
        const matX = this.dotMV(matD, matB);
        for (let i = 0; i < matX.length; i++) {
            matX[i] = this.round(matX[i]);
        }
        matX[8] = 1;

        return matX;
    }

    private dim(x: any[]): number[] {
        if (typeof x === "object") {
            const y = x[0];
            if (typeof y === "object") {
                const z = y[0];
                if (typeof z === "object") {
                    return []; // Not supporting 3D dims for this shim
                }
                return [x.length, y.length];
            }
            return [x.length];
        }
        return [];
    }

    private _foreach2(x: any[], s: number[], k: number, f: (a: any) => any): any[] {
        if (k === s.length - 1) { return f(x); }
        const n = s[k];
        const ret = Array(n);
        for (let i = n - 1; i >= 0; i--) { ret[i] = this._foreach2(x[i], s, k + 1, f); }
        return ret;
    }

    private cloneV(x: any[]): any[] {
        const _n = x.length;
        const ret = Array(_n);
        for (let i = _n - 1; i !== -1; --i) {
            ret[i] = (x[i]);
        }
        return ret;
    }

    private clone(x: any[]): any[] {
        if (typeof x !== "object") return (x);
        const s = this.dim(x);
        return this._foreach2(x, s, 0, this.cloneV.bind(this));
    }

    private diag(d: number[]): number[][] {
        const n = d.length;
        const A = Array(n);
        for (let i = n - 1; i >= 0; i--) {
            const Ai = Array(n);
            const i1 = i + 2;
            let j;
            for (j = n - 1; j >= i1; j -= 2) {
                Ai[j] = 0;
                Ai[j - 1] = 0;
            }
            if (j > i) { Ai[j] = 0; }
            Ai[i] = d[i];
            for (j = i - 1; j >= 1; j -= 2) {
                Ai[j] = 0;
                Ai[j - 1] = 0;
            }
            if (j === 0) { Ai[0] = 0; }
            A[i] = Ai;
        }
        return A;
    }

    private rep(s: number[], v: any, k = 0): any {
        const n = s[k];
        const ret = Array(n);
        if (k === s.length - 1) {
            let i;
            for (i = n - 2; i >= 0; i -= 2) { ret[i + 1] = v; ret[i] = v; }
            if (i === -1) { ret[0] = v; }
            return ret;
        }
        for (let i = n - 1; i >= 0; i--) { ret[i] = this.rep(s, v, k + 1); }
        return ret;
    }

    private identity(n: number): number[][] {
        return this.diag(this.rep([n], 1));
    }

    private inv(a: number[][]): number[][] {
        const s = this.dim(a);
        const abs = Math.abs;
        const m = s[0];
        const n = s[1];
        const A = this.clone(a);
        const I = this.identity(m);
        let i, j, k, x;
        for (j = 0; j < n; ++j) {
            let i0 = -1;
            let v0 = -1;
            for (i = j; i !== m; ++i) { k = abs(A[i][j]); if (k > v0) { i0 = i; v0 = k; } }
            const Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
            const Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
            x = Aj[j];
            for (k = j; k !== n; ++k) Aj[k] /= x;
            for (k = n - 1; k !== -1; --k) Ij[k] /= x;
            for (i = m - 1; i !== -1; --i) {
                if (i !== j) {
                    const Ai = A[i];
                    const Ii = I[i];
                    x = Ai[j];
                    for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x;
                    for (k = n - 1; k > 0; --k) { Ii[k] -= Ij[k] * x; --k; Ii[k] -= Ij[k] * x; }
                    if (k === 0) Ii[0] -= Ij[0] * x;
                }
            }
        }
        return I;
    }

    private dotMMsmall(x: number[][], y: number[][]): number[][] {
        let i, j, k, p, q, r, ret, foo, bar, woo, i0;
        p = x.length; q = y.length; r = y[0].length;
        ret = Array(p);
        for (i = p - 1; i >= 0; i--) {
            foo = Array(r);
            bar = x[i];
            for (k = r - 1; k >= 0; k--) {
                woo = bar[q - 1] * y[q - 1][k];
                for (j = q - 2; j >= 1; j -= 2) {
                    i0 = j - 1;
                    woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
                }
                if (j === 0) { woo += bar[0] * y[0][k]; }
                foo[k] = woo;
            }
            ret[i] = foo;
        }
        return ret;
    }

    private dotMV(x: number[][], y: number[]): number[] {
        const p = x.length;
        const ret = Array(p);
        for (let i = p - 1; i >= 0; i--) { ret[i] = this.dotVV(x[i], y); }
        return ret;
    }

    private dotVV(x: number[], y: number[]): number {
        const n = x.length;
        let ret = x[n - 1] * y[n - 1];
        let i;
        for (i = n - 2; i >= 1; i -= 2) {
            const i1 = i - 1;
            ret += x[i] * y[i] + x[i1] * y[i1];
        }
        if (i === 0) { ret += x[0] * y[0]; }
        return ret;
    }

    private transpose(x: number[][]): number[][] {
        const m = x.length;
        const n = x[0].length;
        const ret = Array(n);
        for (let j = 0; j < n; j++) ret[j] = Array(m);
        let i;
        for (i = m - 1; i >= 1; i -= 2) {
            const A1 = x[i];
            const A0 = x[i - 1];
            let j;
            for (j = n - 1; j >= 1; --j) {
                let Bj = ret[j]; Bj[i] = A1[j]; Bj[i - 1] = A0[j];
                --j;
                Bj = ret[j]; Bj[i] = A1[j]; Bj[i - 1] = A0[j];
            }
            if (j === 0) {
                const Bj = ret[0]; Bj[i] = A1[0]; Bj[i - 1] = A0[0];
            }
        }
        if (i === 0) {
            const A0 = x[0];
            let j;
            for (j = n - 1; j >= 1; --j) {
                ret[j][0] = A0[j];
                --j;
                ret[j][0] = A0[j];
            }
            if (j === 0) { ret[0][0] = A0[0]; }
        }
        return ret;
    }

    transform(x: number, y: number): number[] {
        const coordinates = [];
        coordinates[0] = (this.coeffs[0] * x + this.coeffs[1] * y + this.coeffs[2]) / (this.coeffs[6] * x + this.coeffs[7] * y + 1);
        coordinates[1] = (this.coeffs[3] * x + this.coeffs[4] * y + this.coeffs[5]) / (this.coeffs[6] * x + this.coeffs[7] * y + 1);
        return coordinates;
    }

    transformInverse(x: number, y: number): number[] {
        const coordinates = [];
        coordinates[0] = (this.coeffsInv[0] * x + this.coeffsInv[1] * y + this.coeffsInv[2]) / (this.coeffsInv[6] * x + this.coeffsInv[7] * y + 1);
        coordinates[1] = (this.coeffsInv[3] * x + this.coeffsInv[4] * y + this.coeffsInv[5]) / (this.coeffsInv[6] * x + this.coeffsInv[7] * y + 1);
        return coordinates;
    }
}
