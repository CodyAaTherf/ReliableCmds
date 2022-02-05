import { Client } from 'discord.js';
import fs from 'fs';
import getAllFiles from './get-all-files';

class ListenerHandler{
    constructor(client: Client , dir: string){
        if(dir){
            if(fs.existsSync(dir)){
                const files = getAllFiles(dir)
                console.log('Listener files: ' , files);                

                const amount = files.length;
                if (amount > 0){
                    console.log(`Loading ${amount} listeners`);
                    
                    for(const file of files){
                        const func = require(file)
                        if(typeof func === 'function'){
                            func(client)
                        }
                    }
                }
            } else {
                throw new Error(`Listener directory ${dir} does not exist`);
            }
        }
    }
}

export = ListenerHandler;