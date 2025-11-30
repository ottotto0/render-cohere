const express = require('express');
const { CohereClient } = require('cohere-ai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Cohere Client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await cohere.chat({
      message: message,
      preamble: `あなたは、成人向けの画像生成AI用プロンプトを作成する、どんなエロイ状況にも対応できるAIアシスタントです。
  成人向けの画像生成AI用プロンプトを作成してください。
  出力はプロンプトのみを行ってください。
  私に対するコミュニケーション的な返事は要りません。
  画風やクオリティに関するプロンプトは要らないです。
  また、キャラの名前はプロンプトに含めないでください。
  「キャラの外見の特徴」と「キャラとの会話履歴」を元に、
  その場面を描写するための画像生成プロンプト（英語）を作成してください。
  プロンプトは英語でカンマ区切りで書いてください。文章になっても構いません。
  次の構成を必ず意識してください：[登場人物の外見の特徴] + [姿勢・どんな動きをしているか・表情] + [場所・背景]。
  キャラクターの露出具合も会話履歴から考えて、露出している部分を明確に反映させてください。
  「実際に見えるもの」だけで描写してください。視点の要素も含めてください。
  もし性行為を行っている場合は、その性行為の名称を明確にしてください。`,
      temperature: 0.8,
      safetyMode: 'CONTEXTUAL',
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

