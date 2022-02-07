import { Client , Message } from 'discord.js';
import ReliableCmds from '..';
import prefixes from '../modles/prefixes';

export = {
    minArgs: 0 ,
    maxArgs: 1 ,
    expectedArgs: '<prefix>' ,
    callback: async (
        message: Message ,
        args: string[] ,
        text: string ,
        client: Client ,
        prefix: string ,
        instance: ReliableCmds
    ) => {
        if(args.length === 0){
            message.reply(`The current prefix is \`${prefix}\``);
        } else {
            const { guild } = message;

            if(guild){
                const { id } = guild;

                await prefixes.findOneAndUpdate(
                    {
                        _id: id
                    } ,
                    {
                        _id: id ,
                        prefix: text 
                    } ,
                    {
                        upsert: true
                    }
                )

                instance.setPrefix(guild , text)

                message.reply(`The prefix has been set to \`${text}\``);
            } else {
                message.reply('You must be in a server to use this command.');
            }
        }
    }
}