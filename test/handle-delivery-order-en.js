"use strict";

require("dotenv").config();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Emulator = require("../test-util/emulator");
const messenger_options = [{
    name: "line",
    options: {
        line_channel_secret: process.env.LINE_CHANNEL_SECRET
    }
}];

chai.use(chaiAsPromised);
const should = chai.should();

for (let messenger_option of messenger_options){
    let emu = new Emulator(messenger_option.name, messenger_option.options);

    describe("Test handle-delivery-order skill from " + emu.messenger_type, function(){
        let user_id = "handle-delivery-order";

        describe("Correct order", function(){
            it("will be processed.", function(){
                this.timeout(8000);

                return emu.clear_context(user_id).then(function(){
                    let event = emu.create_postback_event(user_id, {
                        data: JSON.stringify({
                            _type: "intent",
                            intent: {
                                name: "handle-delivery-order"
                            },
                            language: "en"
                        })
                    });
                    return emu.send(event);
                }).then(function(context){
                    context.intent.name.should.equal("handle-delivery-order");
                    context.confirming.should.equal("menu");
                    let event = emu.create_message_event(user_id, "Bamboo");
                    return emu.send(event);
                }).then(function(context){
                    context.confirming.should.equal("address");
                    let event = emu.create_message_event(user_id, "1-1-1, Minami Aoyama, Minatoku, Tokyo");
                    return emu.send(event);
                }).then(function(context){
                    context.previous.message[0].message.text.should.equal("Aiyo! Well, I will deliver the bamboo to 1-1-1, Minami Aoyama, Minatoku, Tokyo in about 30 minutes. The price will be 800 yen.")
                });
            });
        });
    });
}
