// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const dialogflow = require("apiai-promisified");

// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);

// Dialogflowのクライアントインスタンスを作成
const nlu = new dialogflow(process.env.DIALOGFLOW_CLIENT_ACCESS_TOKEN, {language: "ja"});

// -----------------------------------------------------------------------------
// ルーター設定
server.post('/webhook', line.middleware(line_config), (req, res, next) => {
    // 先行してLINE側にステータスコード200でレスポンスする。
    res.sendStatus(200);

    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.map((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text"){
            events_processed.push(
                nlu.textRequest(event.message.text, {sessionId: event.source.userId}).then((response) => {
                    if (response.result && response.result.action == "handle-delivery-order"){
                        let message;
                        if (response.result.parameters.menu && response.result.parameters.menu != ""){
                            message = {
                                type: "text",
                                text: `毎度！${response.result.parameters.menu}ね。どちらにお届けしましょ？`
                            }
                        } else {
                            message = {
                                type: "text",
                                text: `毎度！ご注文は？`
                            }
                        }
                        return bot.replyMessage(event.replyToken, message);
                    }
                })
            );
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
        }
    );
});
