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
                        const configuration = require(file)
                        const {
                            name = fileName ,
                            commands ,
                            aliases ,
                            callback ,
                            execute ,
                            description
                        } = configuration;

                        if(callback && execute){
                            throw new Error(`Command ${fileName} has both callback and execute , please use one or the other`);
                        }

                        let names = commands || aliases || [];

                        if(!name && (!names || names.length === 0)){
                            throw new Error(`Command ${fileName} has no name or aliases.`);
                        }

                        if(typeof names === 'string'){
                            names = [names];
                        }

                        if(name && !names.includes(name.toLowerCase())){
                            names.unshift(name.toLowerCase());
                        }

                        if(!description){
                            console.warn(`Command ${fileName} has no description property.`);
                        }

                        const hasCallback = callback || execute;

                        if(hasCallback){
                            const command = new Command(
                                instance ,
                                client ,
                                names ,
                                callback || execute ,
                                configuration
                            )

                            for(const name of names){
                                this._commands.set(name , command);
                            }
                        }
                    }

                    client.on('message' , (message) => {
                        const guild: Guild | null = message.guild;
                        let content: string = message.content;
                        const prefix = instance.getPrefix(guild);

                        if (content.startsWith(prefix)){
                            content = content.substring(prefix.length);
                            const words = content.split(/ /g);
                            const firstElement = words.shift()

                            if(firstElement){
                                const alias = firstElement.toLowerCase();
                                const command = this._commands.get(alias);
                                
                                if(command){
                                    command.execute(message , words);
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