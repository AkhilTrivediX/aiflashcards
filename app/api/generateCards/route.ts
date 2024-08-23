import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
    const {topic, cardCount, difficulty, model} = await request.json();

    let parsedDifficulty = "Generate questions that are beginner friendly about the topic but they should be directly related to topic."
    if(difficulty === 'general')
        parsedDifficulty = "Generate questions that need more info about the topic, not guessable."
    if(difficulty === 'advanced')
        parsedDifficulty = "Generate questions that are advanced about the topic that are only known if someone has indepth knowledge of the topic."

    let parsedModel = "llama3-70b-8192";
    if(model === 'gemma')
        parsedModel = "gemma2-9b-it";
    else if(model === 'mistral')
        parsedModel = "mixtral-8x7b-32768"
    if(!topic){
        return Response.json({error: 'Invalid Topic'}, {status: 400})
    }

    console.log(topic, cardCount)
            const cards = await makeBriefIterator(topic, cardCount, parsedDifficulty, parsedModel);
            console.log(cards)

            return Response.json(cards);
}

async function makeBriefIterator(topic: string, cardCount: number, difficulty: string, model: string) {
  console.log('Generating for topic:', topic)
    const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": `You are a flash card generator that gives ${cardCount || 10} flash card in JSON format in key cards: an array with front key  having front part (question) and reveal: having answer to that statement. You must also include three wrong answers similar to answer depending on difficulty in case we need to test user. No two wrongs should be same. Statements should be as compact as possible. ${difficulty} To be created in this format:
            {cards:[{front: '...', reveal: '...', wrongs: ['...', '...', '...']}, ...]}`
          },
          {
            "role": "user",
            "content": topic
          }
        ],
        "model": model,
        "temperature": 1,
        "max_tokens": 2048,
        "top_p": 1,
        "stream": false,
        "stop": null
      });
    
      let content = chatCompletion.choices[0].message.content!;
      content = content?.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      console.log(content)
      return content;
}
