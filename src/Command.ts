import { Client , GuildMember , Message } from "discord.js";
import ReliableCmds from '.';
import ICmdConfig from "./interfaces/ICmdConfig";

class Command{
    private instance: ReliableCmds;
    private client: Client;
    private _names: string[] = [];
    private _minArgs: number = 0;
    private _maxArgs: number;
    private _syntaxError?: string;
    private _expectedArgs?: string;
    private _description?: string;
    private _cooldown: string[] = [];
    private _callback: Function = () => {};

    constructor(
        instance: ReliableCmds ,
        client: Client ,
        names: string[] ,
        callback: Function ,
        { minArgs , maxArgs , syntaxError ,  expectedArgs , description }: ICmdConfig
    ){
        this.instance = instance;
        this.client = client;
        this._names = typeof names === 'string' ? [names] : names;
        this._minArgs = minArgs || 0;
        this._maxArgs = maxArgs === undefined ? -1 : maxArgs;
        this._syntaxError = syntaxError;
        this._expectedArgs = expectedArgs;
        this._description = description;
        this._callback = callback;

        if(this._minArgs < 0){
            throw new Error(`minArgs must be greater than or equal to 0.`);
        }

        if(this._maxArgs < -1){
            throw new Error(`maxArgs must be greater than or equal to -1.`);
        }

        if(this._maxArgs !== -1 && this._maxArgs < this._minArgs){
            throw new Error(`maxArgs must be greater than or equal to minArgs.`);
        }
    }

    public execute(message: Message , args: string[]) {
        this._callback(
            message ,
            args ,
            args.join(' ') ,
            this.client ,
            this.instance.getPrefix(message.guild) ,
            this.instance
        )
    }

    public get names(): string[] {
        return this._names;
    }

    public get minArgs(): number {
        return this._minArgs;
    }

    public get maxArgs(): number {
        return this._maxArgs;
    }

    public get syntaxError(): string | undefined{
        return this._syntaxError;
    }

    public get expectedArgs(): string | undefined {
        return this._expectedArgs;
    }

    public get description(): string | undefined {
        return this._description;
    }

    public setCooldown(member: GuildMember | string , seconds: number){
        if(typeof member !== 'string'){
            member = member.id;
        }

        console.log(`${member} has been set on cooldown for ${seconds} seconds.`);
    }

    public clearCooldown(member: GuildMember | string , seconds: number){
        if(typeof member !== 'string'){
            member = member.id;
        }

        console.log(`${member} has been cleared from cooldown.`);
    }

    public get callback(): Function {
        return this._callback;
    }
}

export = Command