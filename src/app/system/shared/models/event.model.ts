export class ALCEvent {
    constructor (public user_id: number, public type: string, public amount: number, public category: number, public date: string,
                 public description: string, public id?: number, public categoryName?: string) {}
}
