// TODO: caching logic is broken, fixes had issues with Markdown responses
// -------------------------------------------------------------------------------------- //
const express = require('express');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // For creating cache keys

dotenv.config();

const app = express();
const port = 5900;

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

const systemPrompt = 'You are a teacher of Japanese language. Explain grammar of provided Japanese sentence in detail. Return answer in Markdown format with Markdown formatting so the output is readable.';
const translationPrompt = 'You are a translator. Translate the provided Japanese text to English. Return answer in Markdown format with Markdown formatting so the output is readable.';
const translationSbSPrompt = 'You are a translator. Translate the provided Japanese text to English. Translate side by side. Translate side by side in Markdown. Create side by side Markdown table. Ensure proper Markdown spacing, so it can be rendered correctly. Make it nicely formatted. Return answer in Markdown format with Markdown formatting so the output is readable.';
const summaryPrompt = 'You are a summarizer. Summarize the provided text in a concise manner. But be also rather detailed in your text summary. Return the summary in Markdown format with Markdown formatting so the output is readable.';
const sentimentPrompt = 'You are a sentiment analyzer. Analyze the sentiment of the provided text in very detailed way. Use example sentences from original text. Return the result in Markdown format with Markdown formatting so the output is readable.';

const GPT_MODEL = 'gpt-3.5-turbo';
const MAX_PROMPT_LENGTH = 200;
const MAX_TRANSLATION_PROMPT_LENGTH = 4000;
const MAX_CALLS = 1000;
const FILE_PATH = path.join(__dirname, 'callCount.json');

const CACHE = {};
const CACHE_TTL = 60 * 60 * 1000; // 1 hour




// ------------------------- GPT related helper functions -------------------------- //

const readCallCount = () => {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf-8');
      return JSON.parse(data).count;
    }
  } catch (error) {
    console.error('Error reading call count:', error);
  }
  return 0;
};

const writeCallCount = (count) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ count }));
  } catch (error) {
    console.error('Error writing call count:', error);
  }
};

const incrementCallCount = () => {
  let count = readCallCount();
  count += 1;
  writeCallCount(count);
  return count;
};

const isWithinCallLimit = () => {
  const count = readCallCount();
  return count < MAX_CALLS;
};

const getCacheKey = (userPrompt, promptType) => {
  const hash = crypto.createHash('sha256').update(userPrompt + promptType).digest('hex');
  return `${promptType}-${hash}`;
};

const getCachedResponse = (cacheKey) => {
  const cachedData = CACHE[cacheKey];
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
    return cachedData.response;
  }
  return null;
};

const setCachedResponse = (cacheKey, response) => {
  CACHE[cacheKey] = {
    response,
    timestamp: Date.now()
  };
};

const handleOpenAIRequest = async (userPrompt, promptType) => {
  let prompt;
  let maxLength;

  switch (promptType) {
    case 'grammar':
      prompt = systemPrompt;
      maxLength = MAX_PROMPT_LENGTH;
      break;
    case 'translation':
      prompt = translationPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH;
      break;
    case 'translation-sbs':
      prompt = translationSbSPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH;
      break;
    case 'summary':
      prompt = summaryPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH; // assuming summary can be long text
      break;
    case 'sentiment':
      prompt = sentimentPrompt;
      maxLength = MAX_TRANSLATION_PROMPT_LENGTH; // assuming sentiment analysis can be long text
      break;
    default:
      throw new Error('Invalid prompt type.');
  }

  if (!userPrompt) {
    throw new Error('userPrompt is required.');
  }

  if (userPrompt.length > maxLength) {
    throw new Error(`userPrompt exceeds maximum length of ${maxLength} characters.`);
  }

  if (!isWithinCallLimit()) {
    throw new Error('API call limit exceeded. Please try again later.');
  }

  const cacheKey = getCacheKey(userPrompt, promptType);
  const cachedResponse = getCachedResponse(cacheKey);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await openai.chat.completions.create({
      model: GPT_MODEL,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userPrompt },
      ],
    });

    incrementCallCount();
    setCachedResponse(cacheKey, response);
    return response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('An error occurred while calling the OpenAI API.');
  }
};


// ----------------------------- API Endpoints -------------------------- //

// PROMPT
// curl -X POST http://localhost:5900/d-api/v1/grammar \
//     -H "Content-Type: application/json" \
//     -d '{
//         "userPrompt": "君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で"
//     }'
//
// ANSWER
// curl -X POST http://localhost:5900/d-api/v1/grammar \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で"
//      }'
// {"id":"chatcmpl-9T72VeDOn8B7BgdnfHhQi9t4Fy4bC",
// "object":"chat.completion",
// "created":1716725599,
// "model":"gpt-3.5-turbo-0125",
// "choices":[{"index":0,
// "message":{"role":"assistant",
// "content":"In this Japanese sentence:\n\n君 は それ を 掴もう と して 、 馬鹿 みたいに 空 を 切った 手 で\n\n- 君: \"you\"\n- は: topic marking particle\n- それ を: \"that\" (direct object marker)\n- 掴もう: volitional form of the verb \"to grab\"\n- と: particle indicating intention or purpose\n- して: te-form of the verb \"to do\"\n- 馬鹿 みたいに: \"like a fool\"\n- 空 を: \"the sky\" (object marker)\n- 切った: past tense of the verb \"to cut/slash\"\n- 手 で: \"with your hand\"\n\nTherefore, the overall translation of the sentence would be: \"You tried to grab that with a foolish, slashing motion of your hand through the air.\""},
// "logprobs":null,
// "finish_reason":"stop"}],
// "usage":
// {"prompt_tokens":70,
// "completion_tokens":201,
// "total_tokens":271},
// "system_fingerprint":null}
app.post('/d-api/v1/grammar', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, 'grammar');
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});



// curl -X POST http://localhost:5900/d-api/v1/translate \
//      -H "Content-Type: application/json" \
//      -d '{
//         "userPrompt": "君はそれを掴もうとして、馬鹿みたいに空を切った手で"
//      }'
app.post('/d-api/v1/translate', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, 'translation');
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});



app.post('/d-api/v1/translate-side-by-side', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, 'translation-sbs');
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});





// curl -X POST http://localhost:5900/d-api/v1/summary \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "This is a long text that needs to be summarized. The text can contain multiple sentences and the goal is to generate a concise summary of the content provided."
//      }'
// {"id":"chatcmpl-9Vi7mYwK0m9nGs2ELVuXvOT0xZn5D",
// "object":"chat.completion",
// "created":1717344810,
// "model":"gpt-3.5-turbo-0125",
// "choices":[{"index":0,
// "message":{"role":"assistant",
// "content":"### Summary:\nThis summarizer task is to provide a concise summary of the text input by the user."},
// "logprobs":null,"finish_reason":"stop"}],
// "usage":{"prompt_tokens":74,"completion_tokens":21,"total_tokens":95},
// "system_fingerprint":null}
app.post('/d-api/v1/summary', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, 'summary');
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


// curl -X POST http://localhost:5900/d-api/v1/sentiment \
//      -H "Content-Type: application/json" \
//      -d '{
//          "userPrompt": "I am feeling very happy today because I received great news!"
//      }'
// {"id":"chatcmpl-9ViE05KGpKn2Pck3QseiX80MVCoTu",
// "object":"chat.completion",
// "created":1717345196,
// "model":"gpt-3.5-turbo-0125",
// "choices":[{"index":0,"message":{"role":"assistant","content":"### Sentiment Analysis:\n\nThe text conveys a **positive** sentiment. The user is **happy** due to receiving great news."},
// "logprobs":null,"finish_reason":"stop"}],
// "usage":{"prompt_tokens":53,"completion_tokens":27,"total_tokens":80},
// "system_fingerprint":null}
app.post('/d-api/v1/sentiment', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    const response = await handleOpenAIRequest(userPrompt, 'sentiment');
    res.send(response);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


// curl -X GET http://localhost:5900/d-api/v1/metrics
//{"callCount":22,"estimatedCost":"$0.04"}
app.get('/d-api/v1/metrics', (req, res) => {
  const count = readCallCount();
  const estimatedCost = (count * 0.002).toFixed(2); // Assume $0.002 per call for simplicity
  res.send({ callCount: count, estimatedCost: `$${estimatedCost}` });
});


// --- //

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

