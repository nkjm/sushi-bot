"use strict";

module.exports = class SkillHandleDeliveryOrder {

    constructor(){
        this.required_parameter = {
            menu: {
                message_to_confirm: {
                    type: "template",
                    altText: "出前のメニューは松、竹、梅の3種類になっとりますけどどちらにしましょっ？",
                    template: {
                        type: "buttons",
                        text: "ご注文は？",
                        actions: [
                            {type: "message", label: "松", text: "松"},
                            {type: "message", label: "竹", text: "竹"},
                            {type: "message", label: "梅", text: "梅"}
                        ]
                    }
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    if (["松", "竹", "梅"].includes(value)) {
                        return resolve(value);
                    }
                    return reject();
                },
                reaction: (error, value, bot, event, context, resolve, reject) => {
                    if (error) return resolve();

                    bot.queue({
                        type: "text",
                        text: `あいよっ！${value}ね。`
                    });
                    return resolve();
                }
            },
            address: {
                message_to_confirm: {
                    type: "text",
                    text: "どちらにお届けしましょっ？"
                },
                parser: (value, bot, event, context, resolve, reject) => {
                    if (typeof value == "string"){
                        return resolve(value);
                    } else if (typeof value == "object" && value.type == "location"){
                        return resolve(value.address);
                    } else {
                        return reject();
                    }
                }
            }
        }
    }

    finish(bot, event, context, resolve, reject){
        return bot.reply({
            type: "text",
            text: `あいよっ。じゃあ${context.confirmed.menu}を30分後くらいに${context.confirmed.address}にお届けしますわ。おおきに。`
        }).then((response) => {
            return resolve(response);
        });
    }

}
