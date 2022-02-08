import { Client , Message } from 'discord.js';
import ReliableCmds from '..';
import commandStatus from '../modles/disabled-commands';

export = {
    minArgss: 2 ,
    maxArgs: 2 ,
    expectedArgs: 'enable / disable <command>' ,
    callback: async(
        message: Message ,
        args: string[] ,
        text: string ,
        client: Client ,
        prefix: string ,
        instance: ReliableCmds
    ) => {
        const newState = args.shift()?.toLowerCase();
        const name = args.shift()?.toLowerCase();

        if (newState !== 'enable' && newState !== 'disable'){
            message.reply('Invalid command state. Please use `enable` or `disable`');
            return;
        }

        const { guild } = message;

        if(!guild){
            message.reply('This command can only be used in a server');
            return;
        }

        for(const { names } of instance.commands){
            // @ts-ignore
            if(names.includes(name)){
                const mainCommand = names[0];
                const isDisabled = instance.commandHandler.isCommandDisabled(
                    guild.id ,
                    mainCommand
                )

                if(newState === 'enable'){
                    if(!isDisabled){
                        message.reply('That command is already enabled');
                        return;
                    }
                    
                    await commandStatus.deleteOne({
                        guildId: guild.id ,
                        command: mainCommand
                    })

                    instance.commandHandler.enableCommand(guild.id , mainCommand);

                    message.reply(`Enabled command ${mainCommand}`);
                } else{
                    if(isDisabled){
                        message.reply('That command is already disabled');
                        return;
                    }

                    await new commandStatus({
                        guildId: guild.id ,
                        command: mainCommand
                    }).save();

                    // https://github.com/AlexzanderFlores/WOKCommands/commit/befbc0defde7728b40030f18a7d910a997406a99
                }
            }
        }
    }
}