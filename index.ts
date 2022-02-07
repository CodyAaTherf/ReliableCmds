import { Client , Guild } from 'discord.js';
import { Document } from 'mongoose';
import path from 'path';

import CommandHandler from './CommandHandler';
import ListenerHandler from './ListenerHandler';
import ICommand from './interfaces/ICommand';
import mongo from './mongo';
import getAllFiles from './get-all-files';
import prefixes from './modles/prefixes';

class ReliableCmds{
    private _defualtPrefix = ">";
    private _commandsDir = 'commands'
    // private _listenerDir: '';
    private _listenerDir: string | undefined;
    private _mongo = ''
    private _syntaxError = 'Syntax Error: {PERFIX}{COMMAND}{ARGUMENTS}';
    private _prefixes: { [name: string]: string } = {};
    private _commandHandler: CommandHandler;

    constructor(client: Client , commandsDir?: string , listenerDir?: string){
        if(!client){
            throw new Error('No Discord.JS Client provided');
        }

        if(!commandsDir){
            console.warn(`No commands directory provided , defaulting to ${this._commandsDir}`);
        }

        if(module && module.parent){
            // @ts-ignore
            const { path } = module.parent;
            if(path){
                commandsDir = `${path}/${this._commandsDir}`;

                if(listenerDir){
                    listenerDir = `${path}/${listenerDir}`;
                }
            }
        }

        this._commandsDir = commandsDir || this._commandsDir;
        this._listenerDir = listenerDir || this._listenerDir;
        this._commandHandler = new CommandHandler(this , client , this._commandsDir);
        if(this._listenerDir){
            new ListenerHandler(client , this._listenerDir);
        }

        setTimeout(() => {
            if(!this._mongo){
                mongo(this._mongo)
            } else {
                console.warn('No mongo path provided'); 
            }
        } , 500);

        for (const [file, fileName] of getAllFiles(
            path.join(__dirname, 'commands')
        )) {
            this._commandHandler.registerCommand(this, client, file, fileName)
        }
      
        const loadPrefixes = async () => {
            const results: any[] = await prefixes.find({})
      
            for (const result of results) {
                const { _id, prefix } = result
      
                this._prefixes[_id] = prefix
            }
      
            console.log(this._prefixes)
        }

        loadPrefixes()
    }

    public get mongoPath(): string {
        return this._mongo;
    }

    public setMongoPath(mongoPath: string): ReliableCmds{
        this._mongo = mongoPath;
        return this;
    }

    public get syntaxError(): string{
        return this._syntaxError;
    }

    public setSyntaxError(syntaxError: string): ReliableCmds{
        this._syntaxError = syntaxError;
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

    public setPrefix(guild: Guild | null , prefix: string){
        if(guild){
            this._prefixes[guild.id] = prefix;
        }
    }

    public get commandHandler(): CommandHandler {
        return this._commandHandler;
    }

    public get commands(): ICommand[]{
        return this._commandHandler.commands;
    }

    public get CommandAmount(): number {
        return this.commands.length;
    }
}

export = ReliableCmds;