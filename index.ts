import { Client , Guild } from 'discord.js';
import CommandHandler from './CommandHandler';

class ReliableCmds{
    private _defualtPrefix = ">";
    private _commandsDir = 'commands'
    private _mongo = ''
    private _prefixes: { [name: string]: string } = {};

    constructor(client: Client , commandsDir?: string , listenerDir?: string){
        if(!client){
            throw new Error('No Discord.JS Client provided');
        }

        if(!commandsDir){
            console.warn(`No commands directory provided , defaulting to ${this._commandsDir}`);
        }

        // Get Directory Path
        if(module && module.parent){
            // @ts-ignore
            const { path } = module.parent;
            if(path){
                commandsDir = `${path}/${commandsDir || this._commandsDir}`;
            }
        }

        this._commandsDir = commandsDir || this._commandsDir;
        new CommandHandler(this , client , this._commandsDir);

    }

    public get mongoPath(): string {
        return this._mongo;
    }

    public setMongoPath(mongoPath: string): ReliableCmds{
        this._mongo = mongoPath;
        return this;
    }

    public get prefixes(){
        return this._prefixes
    }

    public get defaultPrefix(): string {
        return this._defualtPrefix
    }

    public setDefaultPrefix(prefix: string): ReliableCmds{
        this._defualtPrefix = prefix;
        return this;
    }

    public getPrefix(guild: Guild | null): string {
        return this._prefixes[guild ? guild.id : ''] || this._defualtPrefix;
    }
}

export = ReliableCmds;