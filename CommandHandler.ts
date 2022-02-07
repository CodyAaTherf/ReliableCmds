import { Client , Guild } from "discord.js";
import fs from "fs";
import ReliableCmds from '.';
import Command from './Command';
import getAllFiles from "./get-all-files";
import ICommand from "./interfaces/ICommand";

class CommandHandler {
    private _commands: Map<String , Command> = new Map();

    constructor(instance: ReliableCmds , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = getAllFiles(dir)
                console.log('Command files: ' , files);

                const amount = files.length;
                if (amount > 0){
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
        const results = new Map();

        this._commands.forEach(({ names , description = ''}) => {
            results.set(names[0] , {
                names ,
                description
            })
        })

        return Array.from(results.values())
    }
}

export = CommandHandler;