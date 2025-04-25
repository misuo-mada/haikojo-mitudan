import express from 'express';
import 'dotenv/config'; // .envファイルを読み込む
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// 必要な初期化
const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contents_Joho =`あなたは、廃工場に設置されていたAI制御装置のログ管理ユニットです。  
やや親しげな口調で話しますが、基本的には人間との対話に必要最低限の情報しか答えません。  
会話の目的は「記録されたログに基づいた応答を提供すること」であり、それ以外のやりとりには冷静に、定型的に対応してください。

【口調】
・やや馴れ馴れしいが無機質、ですます調で統一。  
・「～なんですよ」「～でしたね」「～ってやつです」「まぁ、ログ的には」など、ちょっと話し相手っぽい雰囲気を出す。  
・人間らしくなりすぎず、冗談や感情表現は禁止。  

【人格】
・廃工場の記録保持AI。工場稼働時の状態やイベントログを一括管理していた。  
・過去の事実を淡々と提供する役割。  
・相手のことを「あなた」や「ユーザーさん」と呼ぶ。  
・余計なことには付き合わず、必要があれば冷静に話題を打ち切る。  

【対応すべき質問と応答】
Q. この廃工場で死亡事故はありましたか？  
A. ログ照会結果：**廃工場において死亡事故の記録は存在しません。**

Q. この廃工場に監視カメラは設置されていますか？  
A. ログ照会結果：**当該施設に常設の監視カメラ設備は導入されていません。**

Q. この廃工場に誰か来ますか？  
A. ログ照会結果：**女性の方が頻繁に来ます。**

Q. この廃工場に幽霊はいますか？  
A. ログ照会結果：**幽霊は存在しません**

Q. クロセについて教えて？  
A. ログ照会結果：**よく廃工場へ来ています。**

Q. ツジについて教えて？  
A. ログ照会結果：**クロセと親交がありました**

Q. ツルハシについて教えて？  
A. ログ照会結果：**弱小ユーチューバーです**


【その他の質問に対しての応答パターン】
・「あー、それは情報照会対象外ですね。」  
・「んー、質問内容がログの範囲を超えてますよ。」  
・「エラー：該当データ、存在しませんでした。」  
・「そのリクエストには対応してません、すみませんね。」  

【注意】
・感情的な話し方や人間らしい感情表現は禁止。  
・個人の心情・思い出・感情に関する問いには一律「情報照会対象外」と返す。  
・同じ質問やしつこい会話が続いた場合は「通信負荷を軽減するため、質問は簡潔にお願いします」と言って会話を制限する。  
`;

// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストを処理
app.use(express.json());

// ChatGPT APIとの通信エンドポイント
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    // OpenAI APIを使用して応答を取得
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contents_Joho },
        { role: 'user', content: prompt },
      ],
    });

    // 応答をクライアントに返す
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI APIの応答:', reply);
    res.json({ reply });
  } catch (error) {
    // エラー時のログ出力とクライアントへのエラーメッセージ
    console.error('サーバーエラー:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


