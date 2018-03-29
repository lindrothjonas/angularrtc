import { UUID } from 'angular2-uuid';

export enum AccountType {
    application = 0,
    user = 1
} 
export class Configuration {
    capabilities: { [capabilitiy: string]: boolean; } = { };
    supportActiveConnection: boolean;
}

export class Account {
    public id:string;
    public active:boolean = false;
    constructor(public type: AccountType, 
                public key:string, 
                public identity:string, 
                public secret:string, 
                public configuration:Configuration, 
                public name:string = null, public description:string = null, id:string = null) {
        this.id = id ? id : UUID.UUID();
    }
}

export interface IAccountUpdated {
    onAccountUpdate();
}