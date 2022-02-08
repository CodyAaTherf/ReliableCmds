import { Client , Message } from 'discord.js';
import ReliableCmds from '..';

export = {
    maxArgs: 0 ,
    callback: (
        message: Message ,
        args: string[] ,
        text: string ,
        prefix: string ,
        client: Client ,
        instance: ReliableCmds
    ) => {
        let msg = 'Commands:\n';

        for(const command of instance.commands){
            const{names , description } = command;

            msg += `
                **${names.shift()}**
                Aliasess: ${names.length ? `"${names.join('","')}"` : 'None'}
                Description: ${description || 'None'}
            `
        }

        message.channel.send(msg)
    }
}