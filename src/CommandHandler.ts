import { Client , Guild } from "discord.js";
import fs from "fs";
import ReliableCmds from '.';
import Command from './Command';
import getAllFiles from "./get-all-files";
import ICommand from "./interfaces/ICommand";
import disabledCommands from "./modles/disabled-commands";

class CommandHandler {
    private _commands: Map<String , Command> = new Map();
    private _disabled: Map<String , String[]> = new Map();

    constructor(instance: ReliableCmds , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = getAllFiles(dir)
                console.log('Command files: ' , files);

                const amount = files.length;
                if (amount > 0){
                    this.fetchDisabledCommands();
                    console.log(`Found and Loaded ${amount} command(s)`);

                    for(const [file , fileName] of files){
                        this.registerCommand(instance , client , file , fileName);
                    }

                    client.on('message' , (message) => {
                        const guild: Guild | null = message.guild;
                        let content: string = message.content;
                        const prefix = instance.getPrefix(guild);

                        if (content.startsWith(prefix)){
                            content = content.substring(prefix.length);
                            const args = content.split(/ /g);
                            const firstElement = args.shift()

                            if(firstElement){
                                const name = firstElement.toLowerCase();
                                const command = this._commands.get(name);
                                
                                if(command){
                                    
                                    if(guild){
                                        const isDisabled = instance.commandHandler.isCommandDisabled(
                                            guild.id ,
                                            command.names[0]
                                        )

                                        if(isDisabled){
                                            message.reply(`This command is disabled.`);
                                            return;
                                        }
                                    }

                                    const { minArgs , maxArgs , expectedArgs } = command;
                                    let { syntaxError = instance.syntaxError } = command;

                                    if(
                                        (minArgs !== undefined && args.length < minArgs) ||
                                        (maxArgs !== undefined &&
                                            maxArgs !== -1 &&
                                            args.length > maxArgs)
                                    ){
                                        if(syntaxError){
                                            syntaxError = syntaxError.replace('{PERFIX}' , prefix);
                                        }

                                        syntaxError = syntaxError.replace(/{COMMAND}/g , name);

                                        syntaxError = syntaxError.replace(
                                            / {ARGUMENTS}/g ,
                                            expectedArgs ? ` ${expectedArgs}` : ''
                                        )

                                        message.reply(syntaxError);
                                        return;
                                    }

                                    command.execute(message , args);
                                }
                            }
                        }
                    })
                }
            } else {
                throw new Error(`Command directory ${dir} does not exist`);
            }
        }
    }

    public registerCommand(
        instance: ReliableCmds ,
        client: Client ,
        file: string ,
        fileName: string
    ){
        const configuation = require(file);
        const {
            name = fileName ,
            commands ,
            aliases ,
            callback ,
            execute ,
            description 
        } = configuation

        if(callback && execute){
            throw new Error(`Command ${fileName} has both a callback and an execute function.`);
        }

        let names = commands || aliases || [];

        if(!name && (!names || names.length === 0)){
            throw new Error(`Command ${fileName} does not have a name or aliases.`);
        }

        if(typeof names === 'string'){
            names = [names];
        }

        if(name && !names.includes(name.toLowerCase())){
            names.unshift(name);
        }

        if(!description){
            console.warn(`Command ${fileName} does not have a description.`);
        }

        const hasCallBack = callback || execute;

        if(hasCallBack){
            const command = new Command(
                instance ,
                client ,
                name ,
                callback || execute ,
                configuation
            )

            for(const name of names){
                this._commands.set(name.toLowerCase() , command);
            }
        }

    }

    public get commands(): ICommand[]{
        const results: { names: string[]; description: string; }[] = [];

        this._commands.forEach(({ names , description = ''}) => {
            results.push({
                names: [...names] ,
                description
            })
        })

       return results;
    }

    public async fetchDisabledCommands(){
        const results: any[] = await disabledCommands.find({})

        for(const result of results){
            const { guildId , command } = result;

            const array = this._disabled.get(guildId) || [];
            array.push(command);
            this._disabled.set(guildId , array);
        }

        console.log('Disabled Commands: ' , this._disabled);        
    }

    public disableCommand(guildId: string , command: string){
        const array = this._disabled.get(guildId) || [];
        if(array && !array.includes(command)){
            array.push(command);
            this._disabled.set(guildId , array);
        }
    }

    public enableCommand(guildId: string , command: string){
        const array = this._disabled.get(guildId) || [];
        const index = array ? WebGLVertexArrayObject.indexOf(command) : -1;

        if(array && index >= 0){
            array.splice(index , 1);
        }
    }

    public isCommandDisabled(guildId: string , command: string): boolean{
        const array = this._disabled.get(guildId);
        return (array && array.includes(command)) || false;
    }
}

export = CommandHandler;