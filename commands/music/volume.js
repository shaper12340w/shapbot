const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('재생중인 곡의 볼륨을 정합니다')
        .addStringOption(option =>
            option.setName('volume')
                .setDescription('정할 볼륨(숫자만 적어주세요)')),
    async execute(msgData,vol) {
        const { queue,serverProperty } = require('../../main');
        if(msgData.options){
            vol = msgData.options.getString('reason') ?? true;
            if(vol === true&&queue[msgData.guild.id]){
                msgData.reply({embeds:[{
                    color:0xdbce39,
                    title:`:speaker: | 현재 볼륨 : ${serverProperty[msgData.guild.id].player.volume}%`
                }]})
                return;
            }
        } 
        
        if (!queue[msgData.guild.id]) {
            msgData.reply({embeds:[{
                color:0xe01032,
                title:":exclamation: | 재생중인 곡이 없습니다"
            }]})
            return false;
        } else if (String(vol).length < 1){
            msgData.reply({embeds:[{
                color:0xdbce39,
                title:`:speaker: | 현재 볼륨 : ${serverProperty[msgData.guild.id].player.volume}%`
            }]})
            return;
        } else if(isNaN(vol)){
            msgData.reply({embeds:[{
                color:0xe82e20,
                title:":exclamation: | 숫자를 입력해 주세요"
            }]})
            return;
        } else {
            queue[msgData.guild.id].resource.volume.setVolume(vol/1000);
            serverProperty[msgData.guild.id].player.volume = vol;
            fs.writeFile("serverProperty.json",JSON.stringify(Object.fromEntries(Object.entries(serverProperty))),'utf-8',(e)=>{
                if(e){
                    message.channel.send({embeds:[{
                        color:0xff0000,
                        title:"Error!(save property)",
                        description:String(e)
                    }]});
                } else {
                    console.log('property saved');
                }
            })
            msgData.reply({embeds:[{
                color:0xdbce39,
                title:`:speaker: | 볼륨을 ${String(vol)}%로 설정했습니다`
            }]})
        }
        
    }
}