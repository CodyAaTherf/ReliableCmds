import { Client , Guild } from "discord.js";
import fs from "fs";
import ReliableCmds from '.';
import Command from './Command';

class CommandHandler {
    private _commands: Map<String , Command> = new Map();

    constructor(instance: ReliableCmds , client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = fs
                    .readdirSync(dir)
                    .filter((file: string) => file.endsWith('.js'));

                const amount = files.length;
                if (amount > 0){
                    console.log(`Found and Loaded ${amount} command(s)`);

                    for(const file of files){
                        const configuration = require(`${dir}/${file}`);
                        const { aliases , callback } = configuration;

                        if(aliases && aliases.length && callback){
                            const command = new Command(
                                instance ,
                                client ,
                                configuration
                            );

                            for(const alias of aliases){
                                this._commands.set(alias.toLowerCase() , command);
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
}

export = CommandHandler;