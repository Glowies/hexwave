export class ShiftArray<T> {
    private readonly _array: T[];
    private readonly _size: number;
    private _start: number;

    constructor(size: number, initialValue: T) {
        this._array = [];
        this._start = 0;
        this._size = size;

        for(let i=0; i<size; i++){
            this.push(initialValue);
        }
    }

    public push(item: T): void{
        this._array[this._start] = item;
        this._start = (this._start + 1) % this._size;
    }

    public get(index: number): T{
        return this._array[mod(this._start - index - 1, this._size)];
    }

    public toString(): string{
        let result: string = "[ " + this.get(0);

        for(let i=1; i<this._size; i++){
            result += ", " + this.get(i);
        }

        return result + " ]";
    }
}

function mod(x: number, y: number): number{
    return x - y * Math.floor(x / y);
}