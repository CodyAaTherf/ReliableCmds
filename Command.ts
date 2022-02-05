import { Client , GuildMember , Message } from "discord.js";
import ReliableCmds from '.';

interface configuration{
    aliases: string[] | string;
    minArgs?: number;
    maxArgs?: number;
    expectedArgs?: string;
    callback: Function;
}

class Command{
    private instance: ReliableCmds;
    private client: Client;
    private _aliases: string[] = [];
    private _minArgs: number = 0;
    private _maxArgs: number = -1;
    private _expectedArgs?: string;
    private _cooldown: string[] = [];
    private _callback: Function = () => {};

    constructor(
        instance: ReliableCmds ,
        client: Client ,
        { aliases , minArgs , maxArgs , expectedArgs , callback }: configuration
    ){
        this.instance = instance;
        this.client = client;
        this._aliases = typeof aliases === 'string' ? [aliases] : aliases;
        this._minArgs = minArgs || 0;
        this._maxArgs = maxArgs || -1;
        this._expectedArgs = expectedArgs;
        this._callback = callback;
    }

    public execute(message: Message , args: string[]) {
        this._callback(
            message ,
            args ,
            args.join(' ') ,
            this.client ,
            message.guild
                ? this.instance.prefixes[message.guild.id]
                : this.instance.defaultPrefix
        )
    }

    public get aliases(): string[] {
        return this._aliases;
    }

    public get minArgs(): number {
        return this.minArgs;
    }

    public get maxArgs(): number {
        return this.maxArgs;
    }

    public get expectedArgs(): string | undefined {
        return this._expectedArgs;
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