"use strict";

const line_event = require("../service/line-event");

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
                parser: "dialogflow",
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
                    text: "配達先を教えてもらえまっか？"
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

        this.clear_context_on_finish = (process.env.BOT_EXPRESS_ENV === "test") ? false : true;
    }

    finish(bot, event, context, resolve, reject){
        return bot.reply({
            type: "text",
            text: `あいよっ！じゃあ${context.confirmed.menu}を30分後くらいに${context.confirmed.address}にお届けしますわ。お代金は800円になりますー。`
        }).then((response) => {
            return line_event.fire({
                type: "bot-express:push",
                to: {
                    type: "user",
                    userId: bot.extract_sender_id()
                },
                intent: {
                    name: "pay",
                    parameters: {
                        productName: context.confirmed.menu,
                        amount: 800,
                        currency: "JPY",
                        orderId: `${bot.extract_sender_id()}-${Date.now()}`,
                        message_text: `下記のボタンからお支払いをお願いしますわ。`
                    }
                },
                language: context.sender_language
            });
        }).then((response) => {
            return resolve(response);
        });
    }

}
